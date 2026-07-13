# YOLO Service for CivicTrack AI

This service provides AI-powered image classification for civic issue reporting.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the service:
```bash
python app.py
```

The service will run on http://localhost:5001

## API Endpoints

- `GET /health` - Health check
- `POST /classify` - Classify an image
  - Upload an image file as `image`
  - Returns predicted issue type and detections

## Model

The service uses YOLOv8 for object detection. You can:
- Use the default COCO dataset model (yolov8n.pt)
- Train a custom model for civic issues and place `best.pt` in this directory
