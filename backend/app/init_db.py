# app/init_db.py

import asyncio
from app.core.database import Base, engine
from app.models.user import User  # importá todos tus modelos acá

async def init_models():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

if __name__ == "__main__":
    asyncio.run(init_models())
