from fastapi import APIRouter, HTTPException
from app.schemas.user import UserCreate, UserLogin
from app.core.security import hash_password, verify_password
from app.core.jwt import create_access_token
from app.db.mongodb import get_database
from datetime import datetime

router = APIRouter(prefix="/auth", tags=["Auth"])
db = get_database()


@router.post("/register")
async def register(user: UserCreate):
    existing = await db.users.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")

    user_doc = {
        "name": user.name,
        "email": user.email,
        "passwordHash": hash_password(user.password),
        "role": "user",
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow(),
    }

    await db.users.insert_one(user_doc)
    return {"message": "User registered successfully"}


@router.post("/login")
async def login(user: UserLogin):
    db_user = await db.users.find_one({"email": user.email})
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(user.password, db_user["passwordHash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(
        {"sub": str(db_user["_id"]), "role": db_user["role"]}
    )

    return {
        "token": token,
        "user": {
            "id": str(db_user["_id"]),
            "name": db_user["name"],
            "email": db_user["email"],
            "role": db_user["role"],
        },
    }
