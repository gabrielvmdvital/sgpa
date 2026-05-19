import pytest

def test_create_lesson_plan(client):
    """Testa a criação de um plano de aula com dados válidos."""
    data = {
        "title": "Aula de Teste",
        "objective": "Testar a rota de criacao",
        "summary": "Resumo teste",
        "scheduled_date": "2026-10-10",
        "subject": "Matematica",
        "content": "Conteudo teste"
    }
    response = client.post('/lesson-plans', json=data)
    assert response.status_code == 201
    assert response.json["title"] == "Aula de Teste"

@pytest.mark.parametrize("missing_field", [
    "title",
    "objective",
    "summary",
    "scheduled_date",
    "subject",
    "content"
])
def test_create_lesson_plan_missing_required_fields(client, missing_field):
    """Testa a criação de um plano de aula faltando cada um dos campos obrigatórios sucessivamente."""
    data = {
        "title": "Aula de Teste",
        "objective": "Testar a rota de criacao",
        "summary": "Resumo teste",
        "scheduled_date": "2026-10-10",
        "subject": "Matematica",
        "content": "Conteudo teste"
    }
    
    del data[missing_field]
    
    response = client.post('/lesson-plans', json=data)
    
    assert response.status_code == 400
    errors = response.json.get("errors", [])
    
    assert len(errors) > 0
    assert any(missing_field in error["loc"] for error in errors)

def test_create_lesson_plan_invalid_data(client):
    """Testa a criação com dados inválidos (ex: string muito curta)."""
    data = {
        "title": "Au",
        "objective": "Testar a rota de criacao",
        "summary": "Resumo teste",
        "scheduled_date": "2026-10-10",
        "subject": "Matematica",
        "content": "Conteudo teste"
    }
    response = client.post('/lesson-plans', json=data)
    assert response.status_code == 400
    errors = response.json.get("errors", [])
    assert any("title" in error["loc"] for error in errors)

def test_get_lesson_plans(client):
    """Testa a listagem paginada de planos de aula."""
    response = client.get('/lesson-plans')
    assert response.status_code == 200
    assert "data" in response.json
    assert "total" in response.json

def test_get_lesson_plan_by_id(client):
    """Testa a busca de um plano de aula pelo ID."""
    data = {
        "title": "Aula Específica",
        "objective": "Testar busca",
        "summary": "Resumo",
        "scheduled_date": "2026-11-11",
        "subject": "Fisica",
        "content": "Conteudo"
    }
    post_response = client.post('/lesson-plans', json=data)
    plan_id = post_response.json["id"]
    
    get_response = client.get(f'/lesson-plans/{plan_id}')
    assert get_response.status_code == 200
    assert get_response.json["title"] == "Aula Específica"
