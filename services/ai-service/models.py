from beanie import Document, Link
from pydantic import BaseModel, Field
from typing import Optional
import datetime

# This model corresponds to the 'model' table in your ERD
class AIModel(Document):
    model_name: str
    provider: str
    is_premium_only: bool = False

    class Settings:
        name = "models" # This is the MongoDB collection name

# This model corresponds to the 'ai_chat_session' table
class AIChatSession(Document):
    room_id: str  # Assuming this links to a room in the chat-service
    user_id: str  # The user who started the session
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)

    class Settings:
        name = "ai_chat_sessions"

# This model corresponds to the 'ai_chat_messages' table
class AIChatMessage(Document):
    session_id: Link[AIChatSession] # A link to the parent session
    model_id: Link[AIModel] # A link to the model used for the response
    prompt_text: str
    response_text: str
    tokens_used: int
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)

    class Settings:
        name = "ai_chat_messages"