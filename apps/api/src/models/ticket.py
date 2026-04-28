from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

from src.models.common import new_id, utc_now

if TYPE_CHECKING:
    from src.models.agent import AgentRun
    from src.models.project import Project
    from src.models.timeline import TimelineEvent

from src.models.timeline import TimelineEventRead


class TicketStatus(str, Enum):
    backlog = "backlog"
    ready = "ready"
    in_progress = "in_progress"
    review = "review"
    done = "done"
    blocked = "blocked"


class TicketPriority(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"


class AssigneeType(str, Enum):
    human = "human"
    agent = "agent"
    cell = "cell"


class PreviewStatus(str, Enum):
    idle = "idle"
    starting = "starting"
    running = "running"
    failed = "failed"
    stopped = "stopped"


class VibeStage(str, Enum):
    brief = "brief"
    plan = "plan"
    evidence = "evidence"
    review = "review"


class AcceptanceCheckType(str, Enum):
    manual = "manual"
    playwright = "playwright"
    dom = "dom"
    screenshot = "screenshot"
    console = "console"


class AcceptanceStatus(str, Enum):
    pending = "pending"
    passing = "passing"
    failing = "failing"
    skipped = "skipped"


class TicketBase(SQLModel):
    projectId: str = Field(foreign_key="project.id", index=True)
    title: str = Field(min_length=1, max_length=200)
    description: str | None = Field(default=None, max_length=4000)
    status: TicketStatus = Field(default=TicketStatus.backlog)
    priority: TicketPriority = Field(default=TicketPriority.medium)
    assigneeType: AssigneeType | None = Field(default=None)
    assigneeId: str | None = Field(default=None, max_length=200)
    branchName: str | None = Field(default=None, max_length=200)
    previewUrl: str | None = Field(default=None, max_length=500)
    previewStatus: PreviewStatus = Field(default=PreviewStatus.idle)
    acceptanceScore: float = Field(default=0.0, ge=0, le=1)


class Ticket(TicketBase, table=True):
    __tablename__ = "ticket"

    id: str = Field(default_factory=new_id, primary_key=True)
    createdAt: datetime = Field(default_factory=utc_now, nullable=False)
    updatedAt: datetime = Field(default_factory=utc_now, nullable=False)

    project: "Project" = Relationship(back_populates="tickets")
    acceptanceCriteria: list["AcceptanceCriterion"] = Relationship(back_populates="ticket")
    agentRuns: list["AgentRun"] = Relationship(back_populates="ticket")
    timelineEvents: list["TimelineEvent"] = Relationship(back_populates="ticket")


class TicketCreate(TicketBase):
    pass


class TicketUpdate(SQLModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = Field(default=None, max_length=4000)
    status: TicketStatus | None = None
    priority: TicketPriority | None = None
    assigneeType: AssigneeType | None = None
    assigneeId: str | None = Field(default=None, max_length=200)
    branchName: str | None = Field(default=None, max_length=200)
    previewUrl: str | None = Field(default=None, max_length=500)
    previewStatus: PreviewStatus | None = None
    acceptanceScore: float | None = Field(default=None, ge=0, le=1)


class TicketRead(TicketBase):
    id: str
    createdAt: datetime
    updatedAt: datetime
    vibeStage: VibeStage = Field(default=VibeStage.brief)


class AcceptanceCriterionBase(SQLModel):
    ticketId: str = Field(foreign_key="ticket.id", index=True)
    text: str = Field(min_length=1, max_length=1000)
    checkType: AcceptanceCheckType = Field(default=AcceptanceCheckType.manual)
    generatedCheck: str | None = Field(default=None, max_length=4000)
    status: AcceptanceStatus = Field(default=AcceptanceStatus.pending)
    lastRunAt: datetime | None = None
    lastError: str | None = Field(default=None, max_length=4000)


class AcceptanceCriterion(AcceptanceCriterionBase, table=True):
    __tablename__ = "acceptance_criterion"

    id: str = Field(default_factory=new_id, primary_key=True)

    ticket: Ticket = Relationship(back_populates="acceptanceCriteria")


class AcceptanceCriterionCreate(AcceptanceCriterionBase):
    pass


class AcceptanceCriterionRead(AcceptanceCriterionBase):
    id: str


class TicketDetailRead(TicketRead):
    acceptanceCriteria: list[AcceptanceCriterionRead] = Field(default_factory=list)
    timelineEvents: list[TimelineEventRead] = Field(default_factory=list)
