from pydantic import BaseModel, Field

class SmartAssistRequest(BaseModel):
    """Schema Pydantic para os dados de entrada na geração de recomendações pela IA."""
    title: str = Field(..., description="Título da Aula")
    subject: str = Field(..., description="Disciplina")
    summary: str = Field(..., description="Ementa ou Resumo")

class SmartAssistResponse(BaseModel):
    """Schema Pydantic para validação e serialização da resposta devolvida pelo Smart Assist."""
    suggested_content: str = Field(..., description="Conteúdos complementares sugeridos")
    related_topics: str = Field(..., description="Tópicos relacionados em formato de texto")
    tags: str = Field(..., description="3 tags recomendadas separadas por vírgula")
