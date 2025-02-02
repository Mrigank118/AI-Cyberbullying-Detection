from flask import Blueprint, request, jsonify
from flask_cors import CORS
from services.detect import analyze_text  # Import your actual model function

ai_bp = Blueprint('ai', __name__)

@ai_bp.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    text = data.get('text', '')

    if not text:
        return jsonify({'error': 'No text provided'}), 400

    # Call your actual model function
    severity_score = analyze_text(text)

    # Log the severity score to debug
    print(f"Generated severity score: {severity_score}")

    return jsonify({
        'severity': severity_score
    })
