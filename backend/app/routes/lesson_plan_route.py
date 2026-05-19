from flask import Blueprint, request, jsonify
from app import db
from app.models.lesson_plan import LessonPlan
from app.schemas.lesson_plan import LessonPlanCreate, LessonPlanUpdate, LessonPlanResponse
from pydantic import ValidationError

import logging

lesson_plan_bp = Blueprint('lesson_plan', __name__)
logger = logging.getLogger(__name__)

@lesson_plan_bp.route('', methods=['POST'])
def create_lesson_plan():
    """
    Cria um novo plano de aula.
    ---
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - title
            - objective
            - summary
            - scheduled_date
            - subject
            - content
          properties:
            title:
              type: string
            objective:
              type: string
            summary:
              type: string
            scheduled_date:
              type: string
              format: date
            subject:
              type: string
            content:
              type: string
            support_materials:
              type: string
            tags:
              type: string
    responses:
      201:
        description: Plano de aula criado com sucesso
      400:
        description: Erro de validação
    """
    try:
        data = request.get_json()
        validated_data = LessonPlanCreate(**data)
        
        new_plan = LessonPlan(**validated_data.model_dump())
        db.session.add(new_plan)
        db.session.commit()
        
        logger.info(f'Lesson Plan Created: Title="{new_plan.title}", ID={new_plan.id}')
        
        return jsonify(LessonPlanResponse.model_validate(new_plan).model_dump(mode='json')), 201
        
    except ValidationError as e:
        logger.warning(f'Validation error creating lesson plan: {e.errors()}')
        return jsonify({"errors": e.errors()}), 400
        
    except Exception as e:
        db.session.rollback()
        logger.error(f'Error creating lesson plan: {str(e)}')
        return jsonify({"error": str(e)}), 500

@lesson_plan_bp.route('', methods=['GET'])
def get_lesson_plans():
    """
    Retorna uma lista paginada de planos de aula.
    ---
    parameters:
      - in: query
        name: page
        type: integer
        required: false
        default: 1
      - in: query
        name: per_page
        type: integer
        required: false
        default: 10
    responses:
      200:
        description: Lista de planos de aula
    """
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    
    subject = request.args.get('subject')
    tags = request.args.get('tags')
    scheduled_date = request.args.get('scheduled_date')
    search_title = request.args.get('title')
    
    sort_by = request.args.get('sort_by', 'created_at') 
    sort_order = request.args.get('sort_order', 'desc')

    query = db.select(LessonPlan)
    
    if subject:
        query = query.where(LessonPlan.subject.ilike(f'%{subject}%'))
    if tags:
        query = query.where(LessonPlan.tags.ilike(f'%{tags}%'))
    if scheduled_date:
        from datetime import datetime
        try:
            parsed_date = datetime.strptime(scheduled_date, '%Y-%m-%d').date()
            query = query.where(LessonPlan.scheduled_date == parsed_date)
        except ValueError:
            pass
            
    if search_title:
        query = query.where(LessonPlan.title.ilike(f'%{search_title}%'))
        
    if sort_by == 'title':
        if sort_order == 'asc':
            query = query.order_by(LessonPlan.title.asc())
        else:
            query = query.order_by(LessonPlan.title.desc())
    else:
        if sort_order == 'asc':
            query = query.order_by(LessonPlan.created_at.asc())
        else:
            query = query.order_by(LessonPlan.created_at.desc())

    pagination = db.paginate(
        query, 
        page=page, 
        per_page=per_page, 
        error_out=False
    )
    logger.info(f'Fetched lesson plans: page={page}, total={pagination.total}, subject="{subject}", title="{search_title}"')
    
    return jsonify({
        "data": [LessonPlanResponse.model_validate(plan).model_dump(mode='json') for plan in pagination.items],
        "total": pagination.total,
        "pages": pagination.pages,
        "current_page": page
    }), 200

@lesson_plan_bp.route('/<int:id>', methods=['GET'])
def get_lesson_plan(id):
    """
    Retorna os detalhes de um plano de aula específico.
    ---
    parameters:
      - in: path
        name: id
        type: integer
        required: true
    responses:
      200:
        description: Detalhes do plano de aula
      404:
        description: Plano de aula não encontrado
    """
    plan = db.get_or_404(LessonPlan, id)
    logger.info(f'Fetched lesson plan ID={id}')
    return jsonify(LessonPlanResponse.model_validate(plan).model_dump(mode='json')), 200

@lesson_plan_bp.route('/<int:id>', methods=['PUT'])
def update_lesson_plan(id):
    """
    Atualiza um plano de aula existente.
    ---
    parameters:
      - in: path
        name: id
        type: integer
        required: true
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            title:
              type: string
            objective:
              type: string
            summary:
              type: string
            scheduled_date:
              type: string
              format: date
            subject:
              type: string
            content:
              type: string
            support_materials:
              type: string
            tags:
              type: string
    responses:
      200:
        description: Plano de aula atualizado com sucesso
      400:
        description: Erro de validação
      404:
        description: Plano de aula não encontrado
    """
    plan = db.get_or_404(LessonPlan, id)
    
    try:
        data = request.get_json()
        validated_data = LessonPlanUpdate(**data)
        
        update_data = validated_data.model_dump(exclude_unset=True)
        
        for key, value in update_data.items():
            setattr(plan, key, value)
                
        db.session.commit()
        logger.info(f'Updated lesson plan ID={id}')
        return jsonify(LessonPlanResponse.model_validate(plan).model_dump(mode='json')), 200
        
    except ValidationError as e:
        logger.warning(f'Validation error updating lesson plan ID={id}: {e.errors()}')
        return jsonify({"errors": e.errors()}), 400
    except Exception as e:
        db.session.rollback()
        logger.error(f'Error updating lesson plan ID={id}: {str(e)}')
        return jsonify({"error": str(e)}), 500

@lesson_plan_bp.route('/<int:id>', methods=['DELETE'])
def delete_lesson_plan(id):
    """
    Remove um plano de aula específico.
    ---
    parameters:
      - in: path
        name: id
        type: integer
        required: true
    responses:
      200:
        description: Plano de aula removido com sucesso
      404:
        description: Plano de aula não encontrado
    """
    plan = db.get_or_404(LessonPlan, id)
    db.session.delete(plan)
    db.session.commit()
    logger.info(f'Deleted lesson plan ID={id}')
    return jsonify({"message": "Lesson plan deleted successfully"}), 200
