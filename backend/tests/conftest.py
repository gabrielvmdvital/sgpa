import pytest
from app import create_app, db

@pytest.fixture
def app():
    """Cria e configura a aplicação Flask para testes."""
    app = create_app()
    app.config.update({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:"
    })
    
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()

@pytest.fixture
def client(app):
    """Retorna o cliente de testes da aplicação."""
    return app.test_client()
