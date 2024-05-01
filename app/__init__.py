from flask import Flask
from flask_login import LoginManager
from .extensions import db, migrate
from .models import User


# Blueprints
from .main import main as main_blueprint
from .auth import auth as auth_blueprint


def create_app(database_uri="sqlite:///db.sqlite"):
    app = Flask(__name__)
    app.config["SECRET_KEY"] = "LiI(2mJ*Qm_2FC;<_0n+[D2Tb^Diqx"
    app.config["SQLALCHEMY_DATABASE_URI"] = database_uri

    login_manager = LoginManager()
    login_manager.login_view = 'auth.login'

    login_manager.init_app(app)
    db.init_app(app)
    migrate.init_app(app, db)

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    app.register_blueprint(auth_blueprint)
    app.register_blueprint(main_blueprint)

    return app
