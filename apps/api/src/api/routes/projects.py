from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from src.core.database import get_session
from src.models.project import Project, ProjectCreate, ProjectRead

router = APIRouter()
SessionDep = Annotated[Session, Depends(get_session)]


@router.get("/", response_model=list[ProjectRead])
def list_projects(session: SessionDep) -> list[Project]:
    statement = select(Project).order_by(Project.updatedAt.desc())
    return list(session.exec(statement))


@router.get("/{project_id}", response_model=ProjectRead)
def get_project(project_id: str, session: SessionDep) -> Project:
    project = session.get(Project, project_id)
    if project is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return project


@router.post("/", response_model=ProjectRead, status_code=status.HTTP_201_CREATED)
def create_project(payload: ProjectCreate, session: SessionDep) -> Project:
    project = Project(**payload.model_dump())
    session.add(project)
    session.commit()
    session.refresh(project)
    return project
