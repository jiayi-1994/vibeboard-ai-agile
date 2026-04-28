from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import selectinload
from sqlmodel import Session, select

from src.core.database import get_session
from src.models.common import utc_now
from src.models.project import Project
from src.models.ticket import Ticket, TicketCreate, TicketDetailRead, TicketRead, TicketStatus, TicketUpdate, VibeStage
from src.models.timeline import TimelineEventRead, TimelineEventType

router = APIRouter()
SessionDep = Annotated[Session, Depends(get_session)]


def _get_ticket_or_404(session: Session, ticket_id: str) -> Ticket:
    ticket = session.get(Ticket, ticket_id)
    if ticket is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")
    return ticket


def _derive_ticket_stage(ticket: Ticket) -> VibeStage:
    if ticket.timelineEvents:
        latest_stage_patch = next(
            (
                event
                for event in sorted(ticket.timelineEvents, key=lambda item: item.sequence, reverse=True)
                if event.type == TimelineEventType.stage_patch and isinstance(event.payload, dict) and event.payload.get("stage")
            ),
            None,
        )
        if latest_stage_patch is not None:
            stage = latest_stage_patch.payload.get("stage")
            if stage in {"brief", "plan", "evidence", "review"}:
                return VibeStage(stage)

    if ticket.status in {TicketStatus.review, TicketStatus.done}:
        return VibeStage.review
    if ticket.previewStatus != "idle" or ticket.status in {TicketStatus.in_progress, TicketStatus.blocked}:
        return VibeStage.evidence
    if ticket.status == TicketStatus.ready:
        return VibeStage.plan
    return VibeStage.brief


@router.get("/", response_model=list[TicketRead])
def list_tickets(
    session: SessionDep,
    projectId: str | None = Query(default=None),
    statusFilter: TicketStatus | None = Query(default=None, alias="status"),
) -> list[TicketRead]:
    statement = select(Ticket)
    if projectId:
        statement = statement.where(Ticket.projectId == projectId)
    if statusFilter:
        statement = statement.where(Ticket.status == statusFilter)
    statement = statement.order_by(Ticket.updatedAt.desc())
    return [
        TicketRead(**ticket.model_dump(), vibeStage=_derive_ticket_stage(ticket))
        for ticket in session.exec(statement)
    ]


@router.get("/{ticket_id}", response_model=TicketDetailRead)
def get_ticket(ticket_id: str, session: SessionDep) -> TicketDetailRead:
    statement = (
        select(Ticket)
        .where(Ticket.id == ticket_id)
        .options(
            selectinload(Ticket.acceptanceCriteria),
            selectinload(Ticket.timelineEvents),
        )
    )
    ticket = session.exec(statement).first()
    if ticket is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")

    return TicketDetailRead(
        **ticket.model_dump(),
        vibeStage=_derive_ticket_stage(ticket),
        acceptanceCriteria=[
            criterion.model_dump()
            for criterion in sorted(ticket.acceptanceCriteria, key=lambda item: item.id)
        ],
        timelineEvents=[
            TimelineEventRead.from_model(event).model_dump(mode="python")
            for event in sorted(ticket.timelineEvents, key=lambda item: item.createdAt)
        ],
    )


@router.post("/", response_model=TicketRead, status_code=status.HTTP_201_CREATED)
def create_ticket(payload: TicketCreate, session: SessionDep) -> Ticket:
    project = session.get(Project, payload.projectId)
    if project is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    ticket = Ticket(**payload.model_dump())
    session.add(ticket)
    session.commit()
    session.refresh(ticket)
    return TicketRead(**ticket.model_dump(), vibeStage=_derive_ticket_stage(ticket))


@router.patch("/{ticket_id}", response_model=TicketRead)
def update_ticket(ticket_id: str, payload: TicketUpdate, session: SessionDep) -> Ticket:
    ticket = _get_ticket_or_404(session, ticket_id)

    for field_name, value in payload.model_dump(exclude_unset=True).items():
        setattr(ticket, field_name, value)
    ticket.updatedAt = utc_now()

    session.add(ticket)
    session.commit()
    session.refresh(ticket)
    return TicketRead(**ticket.model_dump(), vibeStage=_derive_ticket_stage(ticket))
