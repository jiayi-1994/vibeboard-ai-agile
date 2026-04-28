from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api.routes.projects import router as projects_router
from src.api.routes.tickets import router as tickets_router
from src.api.routes.timeline_events import router as timeline_events_router
from src.api.websocket.timeline_ws import router as timeline_ws_router
from src.core.config import Settings, get_settings
from src.core.database import bootstrap_database


def create_app(settings: Settings | None = None) -> FastAPI:
    resolved_settings = settings or get_settings()

    @asynccontextmanager
    async def lifespan(_: FastAPI):
        bootstrap_database(resolved_settings)
        yield

    app = FastAPI(
        title=resolved_settings.appName,
        version=resolved_settings.appVersion,
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=resolved_settings.corsOrigins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    if settings is not None:
        app.dependency_overrides[get_settings] = lambda: resolved_settings

    app.include_router(projects_router, prefix=f"{resolved_settings.apiPrefix}/projects", tags=["projects"])
    app.include_router(tickets_router, prefix=f"{resolved_settings.apiPrefix}/tickets", tags=["tickets"])
    app.include_router(timeline_events_router, prefix=f"{resolved_settings.apiPrefix}/tickets", tags=["timeline-events"])
    app.include_router(timeline_ws_router, prefix="/ws", tags=["timeline"])

    @app.get("/health")
    def health() -> dict[str, str]:
        return {"status": "ok"}

    return app


app = create_app()
