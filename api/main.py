import os
from datetime import timedelta
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from routes.auth_routes import auth_routes, login_manager
from routes.habit_routes import habit_routes
from routes.notes_routes import notes_routes
from routes.progress_routes import progress_routes
from dotenv import load_dotenv

load_dotenv(dotenv_path=".env.local")

DEBUG = bool(os.environ.get("DEBUG", True))


def create_app():
    app = Flask(__name__)
    app.config["DEBUG"] = DEBUG
    app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY", "")
    app.config["JWT_TOKEN_LOCATION"] = ["headers", "cookies"]
    app.config["JWT_COOKIE_SECURE"] = False
    app.config["JWT_COOKIE_CSRF_PROTECT"] = False
    app.config["JWT_COOKIE_SAMESITE"] = "Lax"
    app.config["JWT_COOKIE_DOMAIN"] = None
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
    app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=7)

    # Blueprints
    app.register_blueprint(auth_routes, url_prefix="/auth")
    app.register_blueprint(habit_routes, url_prefix="/habit")
    app.register_blueprint(notes_routes, url_prefix="/notes")
    app.register_blueprint(progress_routes, url_prefix="/progress")

    # CORS configuration
    CORS(
        app,
        supports_credentials=True,
        resources={
            r"/*": {
                "origins": [
                    os.environ.get("REACT_APP_API_URL", "http://localhost:3000")
                ],
                "methods": ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
                "allow_headers": [
                    "Content-Type",
                    "Authorization",
                    "Access-Control-Allow-Credentials",
                ],
            }
        },
    )

    jwt = JWTManager(app)
    login_manager.init_app(app)

    @jwt.unauthorized_loader
    def handle_unauthorized_error(error_desc):
        return (
            jsonify(
                {
                    "success": False,
                    "message": "Authentication required",
                    "error": str(error_desc),
                }
            ),
            401,
        )

    return app, jwt


app, jwt = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5050, debug=True)
