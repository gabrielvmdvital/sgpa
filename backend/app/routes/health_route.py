from flask import Blueprint, jsonify
from sqlalchemy import text
from app import db
import logging

health_bp = Blueprint('health', __name__)
logger = logging.getLogger(__name__)

@health_bp.route('/health', methods=['GET'])
def health_check():
    """
    Endpoint para verificar se a API e o banco de dados estão funcionando corretamente.
    ---
    responses:
      200:
        description: API e banco de dados estão funcionando corretamente
        schema:
          type: object
          properties:
            status:
              type: string
              example: saudável
            service:
              type: string
              example: sgpa-backend
            database:
              type: string
              example: conectado
            message:
              type: string
              example: API está funcionando corretamente !
      500:
        description: API ou banco de dados com problemas
    """
    try:
        db.session.execute(text('SELECT 1'))
        return jsonify({
            "status": "saudável",
            "service": "sgpa-backend",
            "database": "conectado",
            "message": "API está funcionando corretamente ! "
        }), 200
    except Exception as e:
        logger.error(f"Erro no health check do banco de dados: {str(e)}")
        return jsonify({
            "status": "com falha",
            "service": "sgpa-backend",
            "database": f"erro: {str(e)}",
            "message": "Erro de conexão com o banco de dados."
        }), 500
