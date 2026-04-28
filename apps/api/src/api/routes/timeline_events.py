from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import text
from sqlmodel import Session, select

from src.api.websocket.timeline_ws import timeline_connections
from src.core.database import get_session
from src.models.agent import AgentRun
from src.models.ticket import Ticket
from src.models.timeline import TimelineEvent, TimelineEventCreate, TimelineEventRead

router = APIRouter()
SessionDep = Annotated[Session, Depends(get_session)]


def _get_ticket_or_404(session: Session, ticket_id: str) -> Ticket:
    ticket = session.get(Ticket, ticket_id)
    if ticket is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")
    return ticket


@router.get("/{ticket_id}/timeline-events", response_model=list[TimelineEventRead])
def list_timeline_events(
    ticket_id: str,
    session: SessionDep,
    since: int | None = None,
 ) -> list[TimelineEventRead]:
    _get_ticket_or_404(session, ticket_id)
    statement = select(TimelineEvent).where(TimelineEvent.ticketId == ticket_id)

    if since is not None:
        statement = statement.where(TimelineEvent.sequence > since)

    statement = statement.order_by(TimelineEvent.sequence.asc())
    return [TimelineEventRead.from_model(event) for event in session.exec(statement)]


@router.post(
    "/{ticket_id}/timeline-events",
    response_model=TimelineEventRead,
    status_code=status.HTTP_201_CREATED,
)
async def create_timeline_event(
    ticket_id: str,
    payload: TimelineEventCreate,
    session: SessionDep,
 ) -> TimelineEventRead:
    if payload.ticketId != ticket_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Path ticket_id must match payload.ticketId",
        )

    _get_ticket_or_404(session, ticket_id)
    if payload.agentRunId and session.get(AgentRun, payload.agentRunId) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent run not found")

    connection = session.connection()
    if connection.dialect.name == "sqlite":
        connection.exec_driver_sql("BEGIN IMMEDIATE")

    max_seq = session.exec(
        select(TimelineEvent.sequence)
        .where(TimelineEvent.ticketId == ticket_id)
        .order_by(TimelineEvent.sequence.desc())
        .limit(1)
    ).first()
    next_sequence = (max_seq or 0) + 1

    event_data = payload.to_event_data()
    event_data["sequence"] = next_sequence
    timeline_event = TimelineEvent(**event_data)
    session.add(timeline_event)
    session.commit()
    session.refresh(timeline_event)

    timeline_event_read = TimelineEventRead.from_model(timeline_event)

    await timeline_connections.broadcast(
        ticket_id,
        {
            "type": "timeline.event.created",
            "data": timeline_event_read.model_dump(mode="json"),
        },
    )

    return timeline_event_read
