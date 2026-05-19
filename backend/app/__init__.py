import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flasgger import Swagger

from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///sgpa.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    app.config['SWAGGER'] = {
        'title': 'SGPA API',
        'uiversion': 3
    }

    db.init_app(app)
    Swagger(app)

    @app.route('/')
    def index():
        from flask import redirect
        return redirect('/apidocs')

    from app.routes.health_route import health_bp
    app.register_blueprint(health_bp)
    
    from app.routes.lesson_plan_route import lesson_plan_bp
    app.register_blueprint(lesson_plan_bp, url_prefix='/lesson-plans')
    
    from app.routes.smart_assist_route import smart_assist_bp
    app.register_blueprint(smart_assist_bp, url_prefix='/smart-assist')

    with app.app_context():
        db.create_all()

    return app
