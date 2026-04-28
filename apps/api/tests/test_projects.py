from __future__ import annotations

from fastapi.testclient import TestClient


def test_create_and_list_projects(client: TestClient) -> None:
    create_response = client.post(
        "/api/projects/",
        json={
            "name": "VibeBoard",
            "repositoryUrl": "https://example.com/vibeboard.git",
            "defaultBranch": "main",
        },
    )
    assert create_response.status_code == 201
    created_project = create_response.json()
    assert created_project["name"] == "VibeBoard"

    list_response = client.get("/api/projects/")
    assert list_response.status_code == 200
    projects = list_response.json()
    assert len(projects) == 1
    assert projects[0]["id"] == created_project["id"]
