from datetime import datetime
from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

from src.models.common import new_id, utc_now

if TYPE_CHECKING:
    from src.models.ticket import Ticket


class ProjectBase(SQLModel):
    name: str = Field(min_length=1, max_length=200)
    repositoryUrl: str | None = Field(default=None, max_length=500)
    localPath: str | None = Field(default=None, max_length=500)
    defaultBranch: str | None = Field(default=None, max_length=200)
    previewCommand: str | None = Field(default=None, max_length=500)
    installCommand: str | None = Field(default=None, max_length=500)
    testCommand: str | None = Field(default=None, max_length=500)


class Project(ProjectBase, table=True):
    __tablename__ = "project"

    id: str = Field(default_factory=new_id, primary_key=True)
    createdAt: datetime = Field(default_factory=utc_now, nullable=False)
    updatedAt: datetime = Field(default_factory=utc_now, nullable=False)

    tickets: list["Ticket"] = Relationship(back_populates="project")


class ProjectCreate(ProjectBase):
    pass


class ProjectRead(ProjectBase):
    id: str
    createdAt: datetime
    updatedAt: datetime
