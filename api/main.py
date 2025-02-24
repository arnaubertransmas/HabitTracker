import os
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from routes.auth_routes import auth_routes
from dotenv import load_dotenv

DEBUG = bool(os.environ.get("DEBUG", True))

load_dotenv(dotenv_path="./.env.local")
app = Flask(__name__)
app.config["DEBUG"] = DEBUG
app.register_blueprint(auth_routes, url_prefix="/auth")

# ? cors settings
CORS(
    app,
    resources={
        r"/*": {
            "origins": [os.environ.get("REACT_APP_URL", "*")],
            "methods": ["GET", "POST", "OPTIONS"],
            "allow_headers": ["Content-Type"],
        }
    },
)


# ? jwt config
app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_KEY", "")
jwt = JWTManager(app)


# @app.route("/")
# def hello():
#     return "Hello, World!"


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
