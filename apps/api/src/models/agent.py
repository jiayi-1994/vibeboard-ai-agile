from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

from src.models.common import new_id

if TYPE_CHECKING:
    from src.models.ticket import Ticket
    from src.models.timeline import TimelineEvent


class AgentType(str, Enum):
    planner = "planner"
    coder = "coder"
    reviewer = "reviewer"
    tester = "tester"


class AgentRunStatus(str, Enum):
    queued = "queued"
    running = "running"
    paused = "paused"
    completed = "completed"
    failed = "failed"
    cancelled = "cancelled"


class AgentRunBase(SQLModel):
    ticketId: str = Field(foreign_key="ticket.id", index=True)
    agentType: AgentType
    status: AgentRunStatus = Field(default=AgentRunStatus.queued)
    model: str | None = Field(default=None, max_length=200)
    startedAt: datetime | None = None
    completedAt: datetime | None = None
    summary: str | None = Field(default=None, max_length=4000)
    error: str | None = Field(default=None, max_length=4000)


class AgentRun(AgentRunBase, table=True):
    __tablename__ = "agent_run"

    id: str = Field(default_factory=new_id, primary_key=True)

    ticket: "Ticket" = Relationship(back_populates="agentRuns")
    timelineEvents: list["TimelineEvent"] = Relationship(back_populates="agentRun")


class AgentRunCreate(AgentRunBase):
    pass


class AgentRunRead(AgentRunBase):
    id: str
