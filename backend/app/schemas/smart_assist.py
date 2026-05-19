from pydantic import BaseModel, Field

class SmartAssistRequest(BaseModel):
    title: str = Field(..., description="Título da Aula")
    subject: str = Field(..., description="Disciplina")
    summary: str = Field(..., description="Ementa ou Resumo")

class SmartAssistResponse(BaseModel):
    suggested_content: str = Field(..., description="Conteúdos complementares sugeridos")
    related_topics: str = Field(..., description="Tópicos relacionados em formato de texto")
    tags: str = Field(..., description="3 tags recomendadas separadas por vírgula")
