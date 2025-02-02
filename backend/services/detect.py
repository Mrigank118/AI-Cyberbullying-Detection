from transformers import pipeline

# Load the Hugging Face model once to avoid reloading on every request
toxicity_classifier = pipeline('text-classification', model='unitary/toxic-bert')

# Function to analyze text toxicity
def analyze_text(text, threshold=0.7):
    result = toxicity_classifier(text)

    # Extract toxicity score and label
    toxicity_score = result[0]['score']
    label = result[0]['label']

    print(f"Toxicity label: {label}, Score: {toxicity_score}")  # Debugging

    # Convert toxicity score to severity (Example Mapping: 1-10 scale)
    severity = int(toxicity_score * 10)

    return {
        "toxicity": label,
        "score": toxicity_score,
        "severity": severity  # This will be used in the frontend
    }
