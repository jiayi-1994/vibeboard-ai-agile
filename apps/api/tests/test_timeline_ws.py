from __future__ import annotations

from fastapi.testclient import TestClient


def _create_ticket(client: TestClient) -> str:
    project_response = client.post("/api/projects/", json={"name": "Realtime project"})
    project_id = project_response.json()["id"]
    ticket_response = client.post(
        "/api/tickets/",
        json={
            "projectId": project_id,
            "title": "Watch agent timeline",
        },
    )
    return ticket_response.json()["id"]


def test_websocket_receives_confirmation_and_broadcast(client: TestClient) -> None:
    ticket_id = _create_ticket(client)

    with client.websocket_connect(f"/ws/tickets/{ticket_id}") as websocket:
        confirmation = websocket.receive_json()
        assert confirmation == {"type": "timeline.live", "ticketId": ticket_id}

        create_event_response = client.post(
            f"/api/tickets/{ticket_id}/timeline-events",
            json={
                "ticketId": ticket_id,
                "event": {
                    "kind": "command",
                    "title": "Run API tests",
                    "payload": {"stdout": "pytest -q"},
                },
            },
        )
        assert create_event_response.status_code == 201

        event_message = websocket.receive_json()
        assert event_message["type"] == "timeline.event.created"
        assert event_message["data"]["ticketId"] == ticket_id
        assert event_message["data"]["event"]["title"] == "Run API tests"
        assert event_message["data"]["event"]["kind"] == "command"


def test_disconnect_does_not_break_event_creation(client: TestClient) -> None:
    ticket_id = _create_ticket(client)

    with client.websocket_connect(f"/ws/tickets/{ticket_id}") as websocket:
        websocket.receive_json()

    create_event_response = client.post(
        f"/api/tickets/{ticket_id}/timeline-events",
        json={
            "ticketId": ticket_id,
            "event": {
                "kind": "decision",
                "title": "Client disconnected",
                "payload": {"summary": "connection closed"},
            },
        },
    )
    assert create_event_response.status_code == 201


def test_websocket_replays_events_after_since_and_then_goes_live(client: TestClient) -> None:
    ticket_id = _create_ticket(client)

    first = client.post(
        f"/api/tickets/{ticket_id}/timeline-events",
        json={
            "ticketId": ticket_id,
            "event": {
                "kind": "command",
                "title": "First event",
                "payload": {"stdout": "first"},
            },
        },
    )
    second = client.post(
        f"/api/tickets/{ticket_id}/timeline-events",
        json={
            "ticketId": ticket_id,
            "event": {
                "kind": "command",
                "title": "Second event",
                "payload": {"stdout": "second"},
            },
        },
    )

    assert first.status_code == 201
    assert second.status_code == 201

    with client.websocket_connect(f"/ws/tickets/{ticket_id}?since=1") as websocket:
        replay = websocket.receive_json()
        assert replay["type"] == "timeline.event.created"
        assert replay["data"]["sequence"] == 2
        assert replay["data"]["event"]["title"] == "Second event"

        live = websocket.receive_json()
        assert live == {"type": "timeline.live", "ticketId": ticket_id}
