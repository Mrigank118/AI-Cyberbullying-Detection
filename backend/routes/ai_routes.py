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
    severity_result = analyze_text(text)  

    # Ensure `analyze_text` returns a dictionary with `toxicity`, `score`, and `severity`
    if not isinstance(severity_result, dict) or 'score' not in severity_result:
        return jsonify({'error': 'Invalid response from analysis model'}), 500

    # Log the severity result to debug
    print(f"Generated severity score: {severity_result}")

    return jsonify({
        
        'score': severity_result.get('score', 0),
        
    })
