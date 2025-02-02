from flask import Blueprint, request, jsonify
import random
from flask_cors import CORS

ai_bp = Blueprint('ai', __name__)

@ai_bp.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    text = data.get('text', '')

    if not text:
        return jsonify({'error': 'No text provided'}), 400

    # Generate a random severity score between 1 and 10
    severity_score = random.randint(1, 10)

    # Log the severity score to see what is being returned
    print(f"Generated severity score: {severity_score}")

    return jsonify({
        'severity': severity_score
    })
