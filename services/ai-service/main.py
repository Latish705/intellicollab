from fastapi import FastAPI
from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
from models import AIModel, AIChatSession, AIChatMessage # Import your new models
import os
import dotenv
import asyncio
from kafka_consumer import consume_messages

dotenv.load_dotenv()

# Create the FastAPI app instance
app = FastAPI()

mongo_url = os.environ.get("MONGO_URL")

@app.on_event("startup")
async def app_init():
    client = AsyncIOMotorClient(mongo_url) 

    await init_beanie(
        database=client.intellicollab, 
        document_models=[AIModel, AIChatSession, AIChatMessage] 
    )
    print("Database connection initialized.")

    consumer_task = asyncio.create_task(consume_messages('new-messages', 'localhost:9092'))



@app.get("/health")
def read_root():
    return {"status": "AI service is running"}