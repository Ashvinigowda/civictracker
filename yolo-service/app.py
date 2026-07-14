from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import io
try:
    from PIL import Image
    from ultralytics import YOLO
except ImportError:
    print("Warning: Missing required packages for YOLO.")

app = Flask(__name__)
CORS(app)

# Load YOLO model
model = None
try:
    print("Loading YOLOv8 model...")
    model = YOLO('yolov8n.pt')
    print("YOLOv8 model loaded successfully.")
except Exception as e:
    print(f"Warning: Failed to load YOLO model: {e}")

# Text-based issue detection
def analyze_description(description):
    """Analyze text description to detect issue type"""
    try:
        if not description or not isinstance(description, str):
            return {
                'issue_type': 'Other',
                'confidence': 0.5,
                'reason': 'No description provided'
            }
        
        description_lower = description.lower()
        
        # Keywords for each issue type
        pothole_keywords = ['pothole', 'hole', 'broken', 'crack', 'pavement', 'asphalt', 'road damage', 'crater', 'ditch', 'pit']
        garbage_keywords = ['garbage', 'waste', 'trash', 'litter', 'debris', 'junk', 'rubbish', 'dump', 'garbage heap', 'plastic']
        water_leak_keywords = ['water', 'leak', 'leaking', 'wet', 'flooding', 'flood', 'water damage', 'moisture', 'puddle', 'dripping']
        streetlight_keywords = ['streetlight', 'light', 'lamp', 'broken light', 'dark', 'light not working', 'light off', 'bulb', 'street lamp']
        
        # Count keyword matches
        pothole_score = sum(1 for keyword in pothole_keywords if keyword in description_lower)
        garbage_score = sum(1 for keyword in garbage_keywords if keyword in description_lower)
        water_score = sum(1 for keyword in water_leak_keywords if keyword in description_lower)
        streetlight_score = sum(1 for keyword in streetlight_keywords if keyword in description_lower)
        
        # Find the highest score
        scores = {
            'Pothole': pothole_score,
            'Garbage': garbage_score,
            'Water Leak': water_score,
            'Streetlight Damage': streetlight_score
        }
        
        max_score = max(scores.values())
        
        # If no keywords matched
        if max_score == 0:
            return {
                'issue_type': 'Other',
                'confidence': 0.5,
                'reason': 'Could not determine issue type from description'
            }
        
        # Get the issue type with highest score
        detected_type = [k for k, v in scores.items() if v == max_score][0]
        
        # Calculate confidence based on keyword density
        total_words = len(description_lower.split())
        confidence = min(0.95, 0.6 + (max_score / max(total_words, 1)) * 0.3)
        
        return {
            'issue_type': detected_type,
            'confidence': round(confidence, 2),
            'reason': f'Detected {max_score} matching keywords for {detected_type}'
        }
    except Exception as e:
        print(f"Error analyzing description: {e}")
        return {
            'issue_type': 'Other',
            'confidence': 0.5,
            'reason': 'Analysis error'
        }

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'AI service is running with YOLO support'})

@app.route('/classify', methods=['POST'])
def classify_issue():
    """Classify issue based on image (YOLO) or fallback to text"""
    try:
        detected_classes = []
        
        # 1. Try Image Classification
        if 'image' in request.files and model is not None:
            file = request.files['image']
            try:
                img = Image.open(file.stream).convert("RGB")
                results = model(img, verbose=False)
                
                for r in results:
                    for box in r.boxes:
                        cls_name = model.names[int(box.cls)]
                        detected_classes.append(cls_name)
                
                # Map COCO classes to our civic issues
                garbage_items = ['bottle', 'cup', 'bowl', 'fork', 'spoon', 'knife', 'apple', 'orange', 'sandwich', 'pizza', 'donut', 'cake']
                street_items = ['stop sign', 'traffic light']
                water_items = ['fire hydrant', 'sink', 'toilet']
                
                issue_type = None
                
                for cls in detected_classes:
                    if cls in garbage_items:
                        issue_type = 'Garbage'
                    elif cls in street_items:
                        issue_type = 'Streetlight Damage'
                    elif cls in water_items:
                        issue_type = 'Water Leak'
                
                if issue_type:
                    return jsonify({
                        'issue_type': issue_type,
                        'confidence': 0.85,
                        'reason': f'AI vision detected: {", ".join(set(detected_classes))}'
                    })
            except Exception as img_e:
                print(f"[Warning] Image processing failed: {img_e}")

        # 2. Fallback to Text Classification
        description = ''
        if request.is_json:
            data = request.get_json()
            if data:
                description = data.get('description', '')
        else:
            description = request.form.get('description', '')
            
        if not description and not detected_classes:
            return jsonify({'error': 'No description or valid image provided'}), 400

        result = analyze_description(description)
        print(f"[OK] Fallback Text Classification: {result['issue_type']}")
        return jsonify(result)

    except Exception as e:
        print(f"[ERROR] Classify error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    print("=" * 60)
    print("[AI] Issue Detection Service Starting...")
    print("=" * 60)
    print("Features:")
    print("  - Analyzes issue descriptions (text)")
    print("  - Detects: Pothole, Garbage, Water Leak, Streetlight Damage")
    print("  - Intelligent keyword matching")
    print("=" * 60)
    app.run(host='0.0.0.0', port=5001, debug=False)