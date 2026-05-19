import pytest
from unittest.mock import patch

@patch('app.routes.smart_assist_route.llm_service.generate_lesson_recommendations')
def test_smart_assist_success(mock_generate, client):
    """Testa o funcionamento da rota do assistente inteligente com mock."""
    mock_generate.return_value = {
        "suggested_content": "Conteúdo Mockado",
        "related_topics": "Tópicos Mockados",
        "tags": "Mock, Tags, Test"
    }
    
    data = {
        "title": "Aula de Teste",
        "subject": "Matematica",
        "summary": "Resumo teste"
    }
    response = client.post('/smart-assist', json=data)
    assert response.status_code == 200
    assert response.json["suggested_content"] == "Conteúdo Mockado"
    assert response.json["tags"] == "Mock, Tags, Test"

@pytest.mark.parametrize("missing_field", [
    "title",
    "subject",
    "summary"
])
def test_smart_assist_missing_required_fields(client, missing_field):
    """Testa a validação de entrada faltando atributos obrigatórios sucessivamente."""
    data = {
        "title": "Aula de Teste",
        "subject": "Matematica",
        "summary": "Resumo teste"
    }
    
    del data[missing_field]
    
    response = client.post('/smart-assist', json=data)
    assert response.status_code == 400
    
    errors = response.json.get("errors", [])
    assert len(errors) > 0
    assert any(missing_field in error["loc"] for error in errors)
