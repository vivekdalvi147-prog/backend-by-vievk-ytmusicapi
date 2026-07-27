from pydantic import BaseModel
from typing import Any, Dict, List, Optional

class SearchQuery(BaseModel):
    query: str
    filter: Optional[str] = None
    limit: int = 20

class StandardResponse(BaseModel):
    success: bool = True
    data: Any
    message: Optional[str] = None
