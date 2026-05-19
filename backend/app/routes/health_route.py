from flask import Blueprint, jsonify

health_bp = Blueprint('health', __name__)

@health_bp.route('/health', methods=['GET'])
def health_check():
    """
    Endpoint para verificar se a API está funcionando corretamente.
    ---
    responses:
      200:
        description: API está funcionando corretamente
        schema:
          type: object
          properties:
            status:
              type: string
              example: saudável
            service:
              type: string
              example: sgpa-backend
            message:
              type: string
              example: API está funcionando corretamente ! 
    """
    return jsonify({
        "status": "saudável",
        "service": "sgpa-backend",
        "message": "API está funcionando corretamente ! "
    }), 200
