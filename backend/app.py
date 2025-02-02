from flask import Flask
from flask_cors import CORS
from routes.ai_routes import ai_bp  # Import AI-related routes

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

# Register Blueprints (Modular API routes)
app.register_blueprint(ai_bp, url_prefix='/api')

if __name__ == '__main__':
    app.run(debug=True)
