from __future__ import annotations

from collections.abc import Generator
from pathlib import Path

from alembic import command
from alembic.config import Config
from fastapi import Depends
from sqlalchemy import event
from sqlalchemy.engine import Engine, make_url
from sqlmodel import SQLModel, Session, create_engine

from src.core.config import API_DIR, Settings, get_settings
import src.models  # noqa: F401

_ENGINES: dict[str, Engine] = {}


def _is_sqlite(database_url: str) -> bool:
    return make_url(database_url).get_backend_name() == "sqlite"


def _ensure_sqlite_directory(database_url: str) -> None:
    url = make_url(database_url)
    if url.get_backend_name() != "sqlite" or not url.database or url.database == ":memory:":
        return

    database_path = Path(url.database)
    if not database_path.is_absolute():
        database_path = API_DIR / database_path

    database_path.parent.mkdir(parents=True, exist_ok=True)


def _configure_sqlite(engine: Engine) -> None:
    if not _is_sqlite(str(engine.url)):
        return

    @event.listens_for(engine, "connect")
    def _set_sqlite_pragma(dbapi_connection, _):  # type: ignore[no-untyped-def]
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()


def get_engine(settings: Settings | None = None) -> Engine:
    resolved_settings = settings or get_settings()
    database_url = resolved_settings.databaseUrl

    if database_url not in _ENGINES:
        _ensure_sqlite_directory(database_url)
        engine = create_engine(
            database_url,
            connect_args={"check_same_thread": False} if _is_sqlite(database_url) else {},
        )
        _configure_sqlite(engine)
        _ENGINES[database_url] = engine

    return _ENGINES[database_url]


def _build_alembic_config(settings: Settings) -> Config:
    config = Config(str(API_DIR / "alembic.ini"))
    config.set_main_option("script_location", str(API_DIR / "alembic"))
    config.set_main_option("sqlalchemy.url", settings.databaseUrl)
    return config


def bootstrap_database(settings: Settings | None = None) -> None:
    resolved_settings = settings or get_settings()
    _ensure_sqlite_directory(resolved_settings.databaseUrl)
    command.upgrade(_build_alembic_config(resolved_settings), "head")


def get_session(settings: Settings = Depends(get_settings)) -> Generator[Session, None, None]:
    with Session(get_engine(settings)) as session:
        yield session
