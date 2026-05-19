from pydantic import BaseModel, Field
from typing import Optional
from datetime import date, datetime

class LessonPlanCreate(BaseModel):
    """Schema Pydantic para validação de dados de criação de um Plano de Aula."""
    title: str = Field(..., min_length=3, max_length=200, description="Título da Aula")
    objective: str = Field(..., min_length=5, description="Objetivo da Aula")
    summary: str = Field(..., min_length=5, description="Ementa ou Resumo")
    scheduled_date: date = Field(..., description="Data Prevista")
    subject: str = Field(..., min_length=2, max_length=100, description="Disciplina")
    content: str = Field(..., min_length=5, description="Conteúdos abordados")
    support_materials: Optional[str] = Field(None, description="Recursos de Apoio")
    tags: Optional[str] = Field(None, description="Tags")

class LessonPlanUpdate(BaseModel):
    """Schema Pydantic para validação de dados de atualização de um Plano de Aula."""
    title: Optional[str] = Field(None, min_length=3, max_length=200)
    objective: Optional[str] = Field(None, min_length=5)
    summary: Optional[str] = Field(None, min_length=5)
    scheduled_date: Optional[date] = None
    subject: Optional[str] = Field(None, min_length=2, max_length=100)
    content: Optional[str] = Field(None, min_length=5)
    support_materials: Optional[str] = None
    tags: Optional[str] = None

class LessonPlanResponse(BaseModel):
    """Schema Pydantic para serialização de resposta de um Plano de Aula."""
    id: int
    title: str
    objective: str
    summary: str
    scheduled_date: date
    subject: str
    content: str
    support_materials: Optional[str] = None
    tags: Optional[str] = None
    created_at: datetime

    model_config = {
        "from_attributes": True
    }
