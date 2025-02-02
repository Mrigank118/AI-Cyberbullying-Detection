from transformers import pipeline

# Load AI model (Example: Twitter-roBERTa for toxicity detection)
toxicity_model = pipeline("text-classification", model="unitary/toxic-bert")

def analyze_text(text):
    result = toxicity_model(text)[0]
    score = result['score']
    label = result['label']

    # Map AI output to severity levels
    severity_mapping = {
        "LABEL_0": "Low",
        "LABEL_1": "Medium",
        "LABEL_2": "High"
    }

    severity = severity_mapping.get(label, "Unknown")

    return severity, label
