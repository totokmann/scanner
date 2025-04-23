from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import SessionLocal
from app.schemas.user import UserCreate
from app.services.user_service import create_user, get_user_by_username, verify_user
from app.core.security import verify_token
router = APIRouter()

async def get_db():
    async with SessionLocal() as session:
        yield session

@router.post("/register")
async def register(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    existing = await get_user_by_username(db, user_data.username)
    if existing:
        raise HTTPException(status_code=400, detail="Usuario ya existe")
    user = await create_user(db, user_data.username, user_data.password)
    return {"id": user.id, "username": user.username}

from fastapi.security import OAuth2PasswordRequestForm
from app.core.security import create_access_token
from fastapi import status

@router.post("/login")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    user = await verify_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciales inválidas")
    
    token = create_access_token({"sub": user.username})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/me")
async def me(username: str = Depends(verify_token)):
    return {"user": username}
