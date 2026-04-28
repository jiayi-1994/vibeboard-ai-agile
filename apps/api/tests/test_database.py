from __future__ import annotations

from pathlib import Path

import pytest
from sqlalchemy import inspect
from sqlalchemy.exc import IntegrityError
from sqlmodel import Session

from src.core.config import Settings
from src.core.database import bootstrap_database, get_engine
from src.models.ticket import Ticket


def _settings_for(tmp_path: Path) -> Settings:
    return Settings(databaseUrl=f"sqlite:///{(tmp_path / 'database.db').as_posix()}")


def test_bootstrap_database_creates_expected_tables(tmp_path: Path) -> None:
    settings = _settings_for(tmp_path)
    bootstrap_database(settings)

    inspector = inspect(get_engine(settings))
    table_names = set(inspector.get_table_names())

    assert {
        "project",
        "ticket",
        "acceptance_criterion",
        "agent_run",
        "timeline_event",
    }.issubset(table_names)


def test_invalid_project_reference_raises_integrity_error(tmp_path: Path) -> None:
    settings = _settings_for(tmp_path)
    bootstrap_database(settings)

    with Session(get_engine(settings)) as session:
        session.add(
            Ticket(
                projectId="missing-project",
                title="Broken reference",
            )
        )

        with pytest.raises(IntegrityError):
            session.commit()
