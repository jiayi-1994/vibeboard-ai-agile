from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING, Annotated, Any, Literal

from pydantic import BaseModel, ConfigDict, Field as PydanticField
from sqlalchemy import JSON, Column
from sqlmodel import Field, Relationship, SQLModel

from src.models.common import new_id, utc_now

if TYPE_CHECKING:
    from src.models.agent import AgentRun
    from src.models.ticket import Ticket


class TimelineEventType(str, Enum):
    plan = "plan"
    file_read = "file_read"
    file_write = "file_write"
    command = "command"
    test = "test"
    preview = "preview"
    comment = "comment"
    decision = "decision"
    error = "error"
    stage_patch = "stage_patch"
    plan_step_status_patch = "plan_step_status_patch"
    evidence_node_patch = "evidence_node_patch"
    terminal_log_append = "terminal_log_append"
    checkpoint = "checkpoint"


class StagePatchPayload(BaseModel):
    model_config = ConfigDict(extra="forbid")

    stage: Literal["brief", "plan", "evidence", "review"]


class PlanStepStatusPatchPayload(BaseModel):
    model_config = ConfigDict(extra="forbid")

    planStepId: str
    status: Literal["pending", "running", "success", "failed"]
    summary: str | None = None
    details: str | None = None
    requiresCheckpoint: bool | None = None


class EvidenceNodePatchPayload(BaseModel):
    model_config = ConfigDict(extra="forbid")

    nodeId: str
    status: Literal["pending", "running", "success", "failed"]
    summary: str | None = None
    details: str | None = None
    artifactPath: str | None = None
    failureReason: str | None = None
    requiresCheckpoint: bool | None = None
    planStepId: str | None = None
    evidenceType: Literal[
        "ui_preview",
        "test_log",
        "api_response",
        "file_change",
        "command",
        "agent_decision",
        "user_correction",
        "checkpoint",
    ] | None = None


class TerminalLogAppendPayload(BaseModel):
    model_config = ConfigDict(extra="forbid")

    nodeId: str | None = None
    planStepId: str | None = None
    tag: str | None = None
    text: str
    tagColor: str | None = None
    textColor: str | None = None


class CheckpointPayload(BaseModel):
    model_config = ConfigDict(extra="forbid")

    nodeId: str | None = None
    planStepId: str | None = None
    summary: str | None = None
    details: str | None = None
    requiresCheckpoint: bool = True


class LegacyTimelinePayload(BaseModel):
    model_config = ConfigDict(extra="allow")


class BaseEventEnvelope(BaseModel):
    model_config = ConfigDict(extra="forbid")

    kind: TimelineEventType
    title: str


class StagePatchEventEnvelope(BaseEventEnvelope):
    kind: Literal[TimelineEventType.stage_patch]
    payload: StagePatchPayload


class PlanStepStatusPatchEventEnvelope(BaseEventEnvelope):
    kind: Literal[TimelineEventType.plan_step_status_patch]
    payload: PlanStepStatusPatchPayload


class EvidenceNodePatchEventEnvelope(BaseEventEnvelope):
    kind: Literal[TimelineEventType.evidence_node_patch]
    payload: EvidenceNodePatchPayload


class TerminalLogAppendEventEnvelope(BaseEventEnvelope):
    kind: Literal[TimelineEventType.terminal_log_append]
    payload: TerminalLogAppendPayload


class CheckpointEventEnvelope(BaseEventEnvelope):
    kind: Literal[TimelineEventType.checkpoint]
    payload: CheckpointPayload


class LegacyTimelineEventEnvelope(BaseEventEnvelope):
    kind: Literal[
        TimelineEventType.plan,
        TimelineEventType.file_read,
        TimelineEventType.file_write,
        TimelineEventType.command,
        TimelineEventType.test,
        TimelineEventType.preview,
        TimelineEventType.comment,
        TimelineEventType.decision,
        TimelineEventType.error,
    ]
    payload: LegacyTimelinePayload = PydanticField(default_factory=LegacyTimelinePayload)


TimelineEventEnvelope = Annotated[
    StagePatchEventEnvelope
    | PlanStepStatusPatchEventEnvelope
    | EvidenceNodePatchEventEnvelope
    | TerminalLogAppendEventEnvelope
    | CheckpointEventEnvelope
    | LegacyTimelineEventEnvelope,
    PydanticField(discriminator="kind"),
]


def _dump_payload(payload: Any) -> dict[str, Any]:
    if isinstance(payload, BaseModel):
        return payload.model_dump(mode="json", exclude_none=True)
    if isinstance(payload, dict):
        return payload
    raise TypeError(f"Unsupported timeline payload type: {type(payload)!r}")


class TimelineEventBase(SQLModel):
    ticketId: str = Field(foreign_key="ticket.id", index=True)
    agentRunId: str | None = Field(default=None, foreign_key="agent_run.id", index=True)
    type: TimelineEventType
    sequence: int = Field(default=0, index=True)
    title: str = Field(min_length=1, max_length=200)
    payload: dict[str, Any] = Field(
        default_factory=dict,
        sa_column=Column(JSON, nullable=False),
    )


class TimelineEvent(TimelineEventBase, table=True):
    __tablename__ = "timeline_event"

    id: str = Field(default_factory=new_id, primary_key=True)
    createdAt: datetime = Field(default_factory=utc_now, nullable=False)

    ticket: Ticket = Relationship(back_populates="timelineEvents")
    agentRun: AgentRun = Relationship(back_populates="timelineEvents")


class TimelineEventCreate(SQLModel):
    ticketId: str = Field(foreign_key="ticket.id", index=True)
    agentRunId: str | None = Field(default=None, foreign_key="agent_run.id", index=True)
    event: TimelineEventEnvelope

    def to_event_data(self) -> dict[str, Any]:
        return {
            "ticketId": self.ticketId,
            "agentRunId": self.agentRunId,
            "type": self.event.kind,
            "title": self.event.title,
            "payload": _dump_payload(self.event.payload),
        }


class TimelineEventRead(SQLModel):
    ticketId: str
    agentRunId: str | None = None
    sequence: int = 0
    id: str
    createdAt: datetime
    event: TimelineEventEnvelope

    @classmethod
    def from_model(cls, event: TimelineEvent) -> "TimelineEventRead":
        envelope = {
            "kind": event.type,
            "title": event.title,
            "payload": event.payload,
        }
        return cls.model_validate(
            {
                "ticketId": event.ticketId,
                "agentRunId": event.agentRunId,
                "sequence": event.sequence,
                "id": event.id,
                "createdAt": event.createdAt,
                "event": envelope,
            }
        )
