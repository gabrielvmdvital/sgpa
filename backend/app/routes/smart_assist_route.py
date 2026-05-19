from flask import Blueprint, request, jsonify
from pydantic import ValidationError
from app.schemas.smart_assist import SmartAssistRequest, SmartAssistResponse
from app.services.llm_service import LLMService

import logging

smart_assist_bp = Blueprint('smart_assist', __name__)
logger = logging.getLogger(__name__)

llm_service = LLMService()

@smart_assist_bp.route('', methods=['POST'])
def generate_recommendations():
    """
    Gera recomendações pedagógicas usando IA (Smart Assist).
    ---
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - title
            - subject
            - summary
          properties:
            title:
              type: string
              description: Título da Aula
            subject:
              type: string
              description: Disciplina
            summary:
              type: string
              description: Ementa ou Resumo
    responses:
      200:
        description: Recomendações geradas com sucesso
      400:
        description: Erro de validação nos parâmetros
      500:
        description: Erro interno ou falha na API da IA
    """
    try:
        data = request.get_json()
        if not data:
            logger.warning('Nenhuma requisição enviada para /smart-assist')
            return jsonify({"error": "Nenhum dado enviado"}), 400
            
        validated_data = SmartAssistRequest(**data)
        
        recommendations = llm_service.generate_lesson_recommendations(
            title=validated_data.title,
            subject=validated_data.subject,
            summary=validated_data.summary
        )
        
        response_data = SmartAssistResponse(**recommendations)
        
        return jsonify(response_data.model_dump(mode='json')), 200
        
    except ValidationError as e:
        logger.warning(f'Erro de validação nos dados de entrada do Smart Assist: {e.errors()}')
        return jsonify({"errors": e.errors()}), 400
    except Exception as e:
        logger.error(f'Falha inesperada no Smart Assist: {str(e)}')
        return jsonify({"error": str(e)}), 500
