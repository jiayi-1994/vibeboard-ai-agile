"""initial schema

Revision ID: 61eb15c8a2d1
Revises:
Create Date: 2026-04-27 23:36:28.121043

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision: str = "61eb15c8a2d1"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "project",
        sa.Column("name", sqlmodel.sql.sqltypes.AutoString(length=200), nullable=False),
        sa.Column("repositoryUrl", sqlmodel.sql.sqltypes.AutoString(length=500), nullable=True),
        sa.Column("localPath", sqlmodel.sql.sqltypes.AutoString(length=500), nullable=True),
        sa.Column("defaultBranch", sqlmodel.sql.sqltypes.AutoString(length=200), nullable=True),
        sa.Column("previewCommand", sqlmodel.sql.sqltypes.AutoString(length=500), nullable=True),
        sa.Column("installCommand", sqlmodel.sql.sqltypes.AutoString(length=500), nullable=True),
        sa.Column("testCommand", sqlmodel.sql.sqltypes.AutoString(length=500), nullable=True),
        sa.Column("id", sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column("createdAt", sa.DateTime(), nullable=False),
        sa.Column("updatedAt", sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "ticket",
        sa.Column("projectId", sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column("title", sqlmodel.sql.sqltypes.AutoString(length=200), nullable=False),
        sa.Column("description", sqlmodel.sql.sqltypes.AutoString(length=4000), nullable=True),
        sa.Column(
            "status",
            sa.Enum("backlog", "ready", "in_progress", "review", "done", "blocked", name="ticketstatus"),
            nullable=False,
        ),
        sa.Column("priority", sa.Enum("low", "medium", "high", name="ticketpriority"), nullable=False),
        sa.Column("assigneeType", sa.Enum("human", "agent", "cell", name="assigneetype"), nullable=True),
        sa.Column("assigneeId", sqlmodel.sql.sqltypes.AutoString(length=200), nullable=True),
        sa.Column("branchName", sqlmodel.sql.sqltypes.AutoString(length=200), nullable=True),
        sa.Column("previewUrl", sqlmodel.sql.sqltypes.AutoString(length=500), nullable=True),
        sa.Column(
            "previewStatus",
            sa.Enum("idle", "starting", "running", "failed", "stopped", name="previewstatus"),
            nullable=False,
        ),
        sa.Column("acceptanceScore", sa.Float(), nullable=False),
        sa.Column("id", sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column("createdAt", sa.DateTime(), nullable=False),
        sa.Column("updatedAt", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["projectId"], ["project.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    with op.batch_alter_table("ticket", schema=None) as batch_op:
        batch_op.create_index(batch_op.f("ix_ticket_projectId"), ["projectId"], unique=False)

    op.create_table(
        "acceptance_criterion",
        sa.Column("ticketId", sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column("text", sqlmodel.sql.sqltypes.AutoString(length=1000), nullable=False),
        sa.Column(
            "checkType",
            sa.Enum("manual", "playwright", "dom", "screenshot", "console", name="acceptancechecktype"),
            nullable=False,
        ),
        sa.Column("generatedCheck", sqlmodel.sql.sqltypes.AutoString(length=4000), nullable=True),
        sa.Column(
            "status",
            sa.Enum("pending", "passing", "failing", "skipped", name="acceptancestatus"),
            nullable=False,
        ),
        sa.Column("lastRunAt", sa.DateTime(), nullable=True),
        sa.Column("lastError", sqlmodel.sql.sqltypes.AutoString(length=4000), nullable=True),
        sa.Column("id", sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.ForeignKeyConstraint(["ticketId"], ["ticket.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    with op.batch_alter_table("acceptance_criterion", schema=None) as batch_op:
        batch_op.create_index(batch_op.f("ix_acceptance_criterion_ticketId"), ["ticketId"], unique=False)

    op.create_table(
        "agent_run",
        sa.Column("ticketId", sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column("agentType", sa.Enum("planner", "coder", "reviewer", "tester", name="agenttype"), nullable=False),
        sa.Column(
            "status",
            sa.Enum("queued", "running", "paused", "completed", "failed", "cancelled", name="agentrunstatus"),
            nullable=False,
        ),
        sa.Column("model", sqlmodel.sql.sqltypes.AutoString(length=200), nullable=True),
        sa.Column("startedAt", sa.DateTime(), nullable=True),
        sa.Column("completedAt", sa.DateTime(), nullable=True),
        sa.Column("summary", sqlmodel.sql.sqltypes.AutoString(length=4000), nullable=True),
        sa.Column("error", sqlmodel.sql.sqltypes.AutoString(length=4000), nullable=True),
        sa.Column("id", sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.ForeignKeyConstraint(["ticketId"], ["ticket.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    with op.batch_alter_table("agent_run", schema=None) as batch_op:
        batch_op.create_index(batch_op.f("ix_agent_run_ticketId"), ["ticketId"], unique=False)

    op.create_table(
        "timeline_event",
        sa.Column("ticketId", sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column("agentRunId", sqlmodel.sql.sqltypes.AutoString(), nullable=True),
        sa.Column(
            "type",
            sa.Enum("plan", "file_read", "file_write", "command", "test", "preview", "comment", "decision", "error", name="timelineeventtype"),
            nullable=False,
        ),
        sa.Column("title", sqlmodel.sql.sqltypes.AutoString(length=200), nullable=False),
        sa.Column("payload", sa.JSON(), nullable=False),
        sa.Column("id", sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column("createdAt", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(["agentRunId"], ["agent_run.id"]),
        sa.ForeignKeyConstraint(["ticketId"], ["ticket.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    with op.batch_alter_table("timeline_event", schema=None) as batch_op:
        batch_op.create_index(batch_op.f("ix_timeline_event_agentRunId"), ["agentRunId"], unique=False)
        batch_op.create_index(batch_op.f("ix_timeline_event_ticketId"), ["ticketId"], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    with op.batch_alter_table("timeline_event", schema=None) as batch_op:
        batch_op.drop_index(batch_op.f("ix_timeline_event_ticketId"))
        batch_op.drop_index(batch_op.f("ix_timeline_event_agentRunId"))

    op.drop_table("timeline_event")

    with op.batch_alter_table("agent_run", schema=None) as batch_op:
        batch_op.drop_index(batch_op.f("ix_agent_run_ticketId"))

    op.drop_table("agent_run")

    with op.batch_alter_table("acceptance_criterion", schema=None) as batch_op:
        batch_op.drop_index(batch_op.f("ix_acceptance_criterion_ticketId"))

    op.drop_table("acceptance_criterion")

    with op.batch_alter_table("ticket", schema=None) as batch_op:
        batch_op.drop_index(batch_op.f("ix_ticket_projectId"))

    op.drop_table("ticket")
    op.drop_table("project")
