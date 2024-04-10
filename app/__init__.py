from flask import Flask
from .extensions import db, migrate
from . import models


# Blueprints
from .main import main as main_blueprint
from .auth import auth as auth_blueprint


def create_app():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = "LiI(2mJ*Qm_2FC;<_0n+[D2Tb^Diqx"
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db.sqlite"

    db.init_app(app)
    migrate.init_app(app, db)

    app.register_blueprint(auth_blueprint)
    app.register_blueprint(main_blueprint)

    return app
