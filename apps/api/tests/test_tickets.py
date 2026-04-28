from __future__ import annotations

from fastapi.testclient import TestClient
from sqlmodel import Session

from src.core.database import get_engine
from src.core.config import Settings
from src.models.ticket import AcceptanceCriterion
from src.models.timeline import TimelineEvent, TimelineEventType


def _create_project(client: TestClient) -> str:
    response = client.post("/api/projects/", json={"name": "Core project"})
    assert response.status_code == 201
    return response.json()["id"]


def test_fetch_tickets_returns_kanban_items(client: TestClient) -> None:
    project_id = _create_project(client)
    create_response = client.post(
        "/api/tickets/",
        json={
            "projectId": project_id,
            "title": "Ship board integration",
            "status": "ready",
            "priority": "high",
        },
    )
    assert create_response.status_code == 201

    list_response = client.get("/api/tickets/")
    assert list_response.status_code == 200
    tickets = list_response.json()
    assert len(tickets) == 1
    assert tickets[0]["title"] == "Ship board integration"
    assert tickets[0]["status"] == "ready"
    assert tickets[0]["vibeStage"] == "plan"


def test_create_ticket_rejects_empty_title(client: TestClient) -> None:
    project_id = _create_project(client)

    response = client.post(
        "/api/tickets/",
        json={
            "projectId": project_id,
            "title": "",
        },
    )

    assert response.status_code == 422


def test_patch_ticket_status_persists_update(client: TestClient) -> None:
    project_id = _create_project(client)
    create_response = client.post(
        "/api/tickets/",
        json={
            "projectId": project_id,
            "title": "Move card across columns",
            "status": "backlog",
        },
    )
    ticket = create_response.json()

    patch_response = client.patch(
        f"/api/tickets/{ticket['id']}",
        json={"status": "in_progress"},
    )
    assert patch_response.status_code == 200
    assert patch_response.json()["status"] == "in_progress"
    assert patch_response.json()["vibeStage"] == "evidence"

    get_response = client.get(f"/api/tickets/{ticket['id']}")
    assert get_response.status_code == 200
    assert get_response.json()["status"] == "in_progress"


def test_get_ticket_detail_returns_aggregate_payload(client: TestClient, test_settings: Settings) -> None:
    project_id = _create_project(client)
    create_response = client.post(
        "/api/tickets/",
        json={
            "projectId": project_id,
            "title": "Inspect ticket detail",
            "status": "review",
            "previewStatus": "running",
            "previewUrl": "http://127.0.0.1:4173",
        },
    )
    ticket = create_response.json()

    with Session(get_engine(test_settings)) as session:
        session.add(
            AcceptanceCriterion(
                ticketId=ticket["id"],
                text="Review payload has acceptance criteria",
            )
        )
        session.add(
            TimelineEvent(
                ticketId=ticket["id"],
                type=TimelineEventType.comment,
                title="Ticket created",
                payload={"source": "test"},
                sequence=1,
            )
        )
        session.add(
            TimelineEvent(
                ticketId=ticket["id"],
                type=TimelineEventType.stage_patch,
                title="Move to evidence",
                payload={"stage": "evidence"},
                sequence=2,
            )
        )
        session.commit()

    get_response = client.get(f"/api/tickets/{ticket['id']}")
    assert get_response.status_code == 200

    detail = get_response.json()
    assert detail["id"] == ticket["id"]
    assert detail["previewUrl"] == "http://127.0.0.1:4173"
    assert detail["vibeStage"] == "evidence"
    assert detail["acceptanceCriteria"][0]["ticketId"] == ticket["id"]
    assert detail["timelineEvents"][0]["ticketId"] == ticket["id"]
    assert detail["timelineEvents"][0]["event"]["title"] == "Ticket created"
    assert detail["timelineEvents"][0]["event"]["kind"] == "comment"
