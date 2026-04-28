from __future__ import annotations

import asyncio
import json
from collections import defaultdict
from collections.abc import Mapping
from typing import Annotated, Any

from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from sqlmodel import Session, select

from src.core.database import get_session
from src.models.timeline import TimelineEvent, TimelineEventRead

router = APIRouter()


class TicketConnectionRegistry:
    def __init__(self) -> None:
        self._connections: defaultdict[str, set[WebSocket]] = defaultdict(set)
        self._lock = asyncio.Lock()

    async def connect(self, ticket_id: str, websocket: WebSocket) -> None:
        async with self._lock:
            self._connections[ticket_id].add(websocket)

    async def disconnect(self, ticket_id: str, websocket: WebSocket) -> None:
        async with self._lock:
            sockets = self._connections.get(ticket_id)
            if not sockets:
                return
            sockets.discard(websocket)
            if not sockets:
                self._connections.pop(ticket_id, None)

    async def broadcast(self, ticket_id: str, payload: Mapping[str, Any]) -> None:
        async with self._lock:
            sockets = list(self._connections.get(ticket_id, set()))

        stale_connections: list[WebSocket] = []
        for websocket in sockets:
            try:
                await websocket.send_json(dict(payload))
            except Exception:
                stale_connections.append(websocket)

        for websocket in stale_connections:
            await self.disconnect(ticket_id, websocket)


timeline_connections = TicketConnectionRegistry()


@router.websocket("/tickets/{ticket_id}")
async def ticket_timeline(
    websocket: WebSocket,
    ticket_id: str,
    since: int | None = None,
    session: Session = Depends(get_session),
) -> None:
    await websocket.accept()
    await timeline_connections.connect(ticket_id, websocket)

    statement = select(TimelineEvent).where(TimelineEvent.ticketId == ticket_id)
    if since is not None:
        statement = statement.where(TimelineEvent.sequence > since)
    statement = statement.order_by(TimelineEvent.sequence.asc())

    events = session.exec(statement).all()
    for event in events:
        event_read = TimelineEventRead.from_model(event)
        await websocket.send_json(
            {
                "type": "timeline.event.created",
                "data": event_read.model_dump(mode="json"),
            }
        )

    await websocket.send_json({"type": "timeline.live", "ticketId": ticket_id})

    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        await timeline_connections.disconnect(ticket_id, websocket)
