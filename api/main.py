import os
from datetime import timedelta
from flask import Flask, jsonify, make_response
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from routes.auth_routes import auth_routes, login_manager
from routes.habit_routes import habit_routes
from routes.notes_routes import notes_routes
from routes.progress_routes import progress_routes
from dotenv import load_dotenv

# load env variables
load_dotenv(dotenv_path=".env.local")
DEBUG = bool(os.environ.get("DEBUG", True))

# Set frontend URL with a fallback
FRONTEND_URL = os.environ.get("REACT_APP_URL", "https://habit-tracker-seven-ecru.vercel.app")

def create_app():
    app = Flask(__name__)
    app.config["DEBUG"] = DEBUG
    app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY", "")
    app.config["JWT_TOKEN_LOCATION"] = ["headers", "cookies"]
    app.config["JWT_COOKIE_SECURE"] = False
    app.config["JWT_COOKIE_CSRF_PROTECT"] = False
    app.config["JWT_COOKIE_SAMESITE"] = "Lax"
    
    # Remove localhost domain restriction for deployed environment
    # app.config["JWT_COOKIE_DOMAIN"] = "localhost"
    
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
    app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=7)
    
    # Blueprints register
    app.register_blueprint(auth_routes, url_prefix="/auth")
    app.register_blueprint(habit_routes, url_prefix="/habit")
    app.register_blueprint(notes_routes, url_prefix="/notes")
    app.register_blueprint(progress_routes, url_prefix="/progress")
    
    # CORS config - allow the specific frontend domain
    CORS(
        app,
        supports_credentials=True,
        resources={
            r"/*": {
                "origins": [FRONTEND_URL],
                "supports_credentials": True,
                "methods": ["GET", "POST", "OPTIONS", "HEAD", "PUT", "DELETE"],
                "allow_headers": [
                    "Content-Type",
                    "Authorization",
                    "Access-Control-Allow-Credentials",
                ],
            }
        },
    )
    
    jwt = JWTManager(app)
    # start login_manager in routes
    login_manager.init_app(app)
    return app, jwt

app, jwt = create_app()

# CORS headers
@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = FRONTEND_URL
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS, PUT, DELETE"
    response.headers["Access-Control-Allow-Headers"] = (
        "Content-Type, Authorization, Access-Control-Allow-Credentials"
    )
    return response

# OPTIONS (preflight)
@app.route("/auth/signin", methods=["OPTIONS"])
@app.route("/auth/signup", methods=["OPTIONS"])
@app.route("/auth/logout", methods=["OPTIONS"])
@app.route("/auth/check_session", methods=["OPTIONS"])
def handle_options():
    response = make_response()
    response.headers["Access-Control-Allow-Origin"] = FRONTEND_URL
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS, PUT, DELETE"
    response.headers["Access-Control-Allow-Headers"] = (
        "Content-Type, Authorization, Access-Control-Allow-Credentials"
    )
    return response

@jwt.unauthorized_loader
def handle_unauthorized_error(error_desc):
    """Authentication JWT errors"""
    return (
        jsonify(
            {
                "success": False,
                "message": "Authentication required",
                "error": error_desc,
            }
        ),
        401,
    )

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
# import os
# from datetime import timedelta
# from flask import Flask, jsonify, make_response
# from flask_cors import CORS
# from flask_jwt_extended import JWTManager
# from routes.auth_routes import auth_routes, login_manager
# from routes.habit_routes import habit_routes
# from routes.notes_routes import notes_routes
# from routes.progress_routes import progress_routes
# from dotenv import load_dotenv

# # load env variables
# load_dotenv(dotenv_path=".env.local")

# DEBUG = bool(os.environ.get("DEBUG", True))


# def create_app():
#     app = Flask(__name__)
#     app.config["DEBUG"] = DEBUG
#     app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY", "")
#     app.config["JWT_TOKEN_LOCATION"] = ["headers", "cookies"]
#     app.config["JWT_COOKIE_SECURE"] = False
#     app.config["JWT_COOKIE_CSRF_PROTECT"] = False
#     app.config["JWT_COOKIE_SAMESITE"] = "Lax"
#     app.config["JWT_COOKIE_DOMAIN"] = "localhost"
#     app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
#     app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=7)

#     # Blueprints register
#     app.register_blueprint(auth_routes, url_prefix="/auth")
#     app.register_blueprint(habit_routes, url_prefix="/habit")
#     app.register_blueprint(notes_routes, url_prefix="/notes")
#     app.register_blueprint(progress_routes, url_prefix="/progress")

#     # CORS config
#     CORS(
#         app,
#         supports_credentials=True,
#         resources={
#             r"/*": {
#                 "origins": [os.environ.get("REACT_APP_URL", "")],
#                 "supports_credentials": True,
#                 "methods": ["GET", "POST", "OPTIONS", "HEAD", "PUT", "DELETE"],
#                 "allow_headers": [
#                     "Content-Type",
#                     "Authorization",
#                     "Access-Control-Allow-Credentials",
#                 ],
#             }
#         },
#     )

#     jwt = JWTManager(app)
#     # start login_manager in routes
#     login_manager.init_app(app)

#     return app, jwt


# app, jwt = create_app()


# # CORS headers
# @app.after_request
# def add_cors_headers(response):
#     response.headers["Access-Control-Allow-Origin"] = os.environ.get(
#         "REACT_APP_URL", ""
#     )
#     response.headers["Access-Control-Allow-Credentials"] = "true"
#     response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS, PUT, DELETE"
#     response.headers["Access-Control-Allow-Headers"] = (
#         "Content-Type, Authorization, Access-Control-Allow-Credentials"
#     )
#     return response


# # OPTIONS (preflight)
# @app.route("/auth/signin", methods=["OPTIONS"])
# @app.route("/auth/signup", methods=["OPTIONS"])
# @app.route("/auth/logout", methods=["OPTIONS"])
# @app.route("/auth/check_session", methods=["OPTIONS"])
# def handle_options():
#     response = make_response()
#     response.headers["Access-Control-Allow-Origin"] = os.environ.get(
#         "REACT_APP_URL", ""
#     )
#     response.headers["Access-Control-Allow-Credentials"] = "true"
#     response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS, PUT, DELETE"
#     response.headers["Access-Control-Allow-Headers"] = (
#         "Content-Type, Authorization, Access-Control-Allow-Credentials"
#     )
#     return response


# @jwt.unauthorized_loader
# def handle_unauthorized_error(error_desc):
#     """Authentication JWT errors"""
#     return (
#         jsonify(
#             {
#                 "success": False,
#                 "message": "Authentication required",
#                 "error": error_desc,
#             }
#         ),
#         401,
#     )


# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=5000, debug=True)
