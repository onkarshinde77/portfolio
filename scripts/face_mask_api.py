import base64
import io
import cv2
import numpy as np
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import logging
import os

# Get the directory of the current script
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
# Models are in the parent directory of 'scripts', inside 'models' folder
MODELS_DIR = os.path.join(os.path.dirname(SCRIPT_DIR), 'models')

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for models
face_detector = None
mask_classifier = None

def load_models():
    global face_detector, mask_classifier
    
    yolo_path = os.path.join(MODELS_DIR, 'face_detector', 'model.pt')
    h5_path = os.path.join(MODELS_DIR, 'efficientnetb0_model.h5')

    try:
        from ultralytics import YOLO
        logger.info(f"Loading YOLO face detector from {yolo_path}...")
        face_detector = YOLO(yolo_path)
        logger.info("YOLO face detector loaded successfully.")
    except Exception as e:
        logger.error(f"Failed to load YOLO model: {e}")
        try:
            import torch
            logger.info("Trying torch.hub for YOLOv5...")
            face_detector = torch.hub.load('ultralytics/yolov5', 'custom', path=yolo_path)
            logger.info("YOLOv5 model loaded successfully via torch.hub.")
        except Exception as e2:
            logger.error(f"Failed to load face detector via torch.hub: {e2}")

    try:
        from tensorflow.keras.models import load_model
        logger.info(f"Loading EfficientNetB0 mask classifier from {h5_path}...")
        mask_classifier = load_model(h5_path)
        logger.info("EfficientNetB0 mask classifier loaded successfully.")
    except Exception as e:
        logger.error(f"Failed to load mask classifier: {e}")

@app.on_event("startup")
async def startup_event():
    load_models()

class FrameRequest(BaseModel):
    image: str

@app.post("/detect")
async def detect_mask(req: FrameRequest):
    # If models failed to load, return mock data
    if face_detector is None or mask_classifier is None:
        logger.warning("Models not loaded properly. Returning empty detections.")
        return []

    try:
        # Decode the base64 image
        image_data = req.image.split(",")[1] if "," in req.image else req.image
        decoded = base64.b64decode(image_data)
        np_arr = np.frombuffer(decoded, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        
        if img is None:
            return []

        # Run face detection
        results = face_detector(img, verbose=False)
        
        detections = []
        
        # Parse YOLO results
        # Depending on ultralytics YOLOv8 vs YOLOv5 torch hub, the results object differs.
        # YOLOv8 returns a list of Results objects. YOLOv5 returns a Detections object.
        boxes = []
        if hasattr(results, 'xyxy'): # YOLOv5 from torch.hub
            for *xyxy, conf, cls in results.xyxy[0]:
                x1, y1, x2, y2 = map(int, xyxy)
                boxes.append((x1, y1, x2, y2, float(conf)))
        elif isinstance(results, list): # YOLOv8 from ultralytics
            for r in results:
                for box in r.boxes:
                    x1, y1, x2, y2 = map(int, box.xyxy[0])
                    conf = float(box.conf[0])
                    boxes.append((x1, y1, x2, y2, conf))

        for x1, y1, x2, y2, conf in boxes:
            # Add some padding to the bounding box
            h, w = img.shape[:2]
            padding = 10
            py1 = max(0, y1 - padding)
            py2 = min(h, y2 + padding)
            px1 = max(0, x1 - padding)
            px2 = min(w, x2 + padding)

            face_img = img[py1:py2, px1:px2]
            
            # Skip if crop is empty
            if face_img.size == 0:
                continue

            # Preprocess for EfficientNetB0
            # Resize to 224x224 and convert to RGB (from BGR)
            face_resized = cv2.resize(face_img, (224, 224))
            face_rgb = cv2.cvtColor(face_resized, cv2.COLOR_BGR2RGB)
            
            # Try converting to float32 and standardizing or rescaling
            face_float = face_rgb.astype('float32')
            
            # Many face mask models trained on Kaggle datasets (WithMask vs WithoutMask)
            # use either rescale=1/255 or the built-in preprocess_input.
            # Let's try standard tf keras applications preprocess_input:
            from tensorflow.keras.applications.efficientnet import preprocess_input
            face_input = preprocess_input(np.expand_dims(face_float, axis=0))
            
            # Predict mask
            pred = mask_classifier.predict(face_input, verbose=0)
            logger.info(f"Raw prediction: {pred}")
            
            # Assuming output is sigmoid binary (1 class) or softmax (2 classes)
            # If pred shape is (1, 1):
            if pred.shape[1] == 1:
                prob = float(pred[0][0])
                # If class 0 is Mask, class 1 is No Mask
                is_mask = prob < 0.5  # Typical for binary: 0=Mask, 1=No Mask
                label_conf = 1 - prob if is_mask else prob
                label = "Mask" if is_mask else "No Mask"
            else:
                # Softmax [prob_mask, prob_no_mask] or similar
                class_idx = np.argmax(pred[0])
                prob = float(pred[0][class_idx])
                
                # Check prediction array.
                # Usually class 0 = Mask (or WithMask), class 1 = No Mask (or WithoutMask)
                # because "Mask" comes before "No Mask" or "WithMask" comes before "WithoutMask" alphabetically.
                label = "Mask" if class_idx == 0 else "No Mask"
                label_conf = prob
                
                # If you notice it's reversed, we can flip it:
                # label = "No Mask" if class_idx == 0 else "Mask"
            
            detections.append({
                "box": [x1, y1, x2, y2],
                "label": label,
                "confidence": label_conf
            })
        
        return detections

    except Exception as e:
        logger.error(f"Error during detection: {e}")
        return []

if __name__ == "__main__":
    uvicorn.run("face_mask_api:app", host="0.0.0.0", port=8000, reload=True)
