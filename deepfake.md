# DeepScan — Advanced Deepfake Detection System

DeepScan is a complete end-to-end deepfake detection solution for both research and production. It converts raw video into a forensic prediction by combining:
- a **video processing pipeline** that extracts frames and crops faces,
- a **hybrid spatio-temporal deep learning model**, and
- a **FastAPI backend + React frontend dashboard** for upload, prediction, explainability, and results tracking.

DeepScan is built to answer: "Is this video real or manipulated?" and to show which frames influenced that answer.

![DeepScan Frontend UI](assets/frontend.png)

---

## 🌟 What This Project Does
- Accepts a video upload and analyzes it frame-by-frame.
- Detects and crops faces using **InsightFace (buffalo_l)**.
- Extracts spatial features using **EfficientNet-B4**.
- Models temporal relationships across frames with a **Transformer Encoder**.
- Uses **temporal attention** to identify the most influential frames.
- Produces a final **REAL / DEEPFAKE** prediction with confidence scores.
- Saves logs, checkpoints, prediction artifacts, and evaluation reports.

---

## 🏗️ Architecture & Pipeline

The system is split into a robust PyTorch/FastAPI backend and a React frontend.

### 1. Model Architecture
DeepScan's `DeepfakeModel` is a hybrid spatio-temporal network composed of four parts:

- **EfficientNet-B4 backbone**
  - Extracts deep spatial features from each face crop.
  - Input images are resized to `380×380`.
  - Produces a `1792`-dimensional embedding per frame.
  - Uses locally stored ImageNet weights loaded via `timm`.

- **Transformer Encoder**
  - Projects frame embeddings from `1792` to `512` dimensions.
  - Uses `6` encoder layers and `8` attention heads.
  - Adds sinusoidal positional encoding to preserve temporal order.
  - Learns relationships between frames across the entire 32-frame sequence.

- **Temporal Attention**
  - Computes an importance weight for each frame.
  - Uses a small MLP and `Softmax` over the sequence dimension.
  - Aggregates frame-level transformer outputs into one video-level feature.
  - Enables explainability by ranking frames by their influence.

- **Classifier head**
  - Receives the aggregated temporal representation.
  - Uses BatchNorm, ReLU, Dropout, and a final linear layer.
  - Outputs a single logit used with `BCEWithLogitsLoss`.

| Component | Role |
| :--- | :--- |
| EfficientNet-B4 | Extracts spatial features from each cropped face image |
| Transformer Encoder | Models temporal dependencies across the frame sequence |
| Temporal Attention | Scores frame importance and aggregates temporal features |
| Classifier | Produces the final deepfake probability |

### 2. Training Pipeline
Training is implemented as a sequential pipeline and includes:

- **Data Ingestion**
  - Organizes raw `deepfake` and `original` video directories.
  - Creates artifact directories for reproducibility.

- **Video Validation**
  - Checks frame count, resolution, FPS, and corrupted videos.
  - Removes invalid or unusable videos.

- **Frame Extraction**
  - Uniformly samples `32` frames per video.
  - Saves extracted frames to the artifact directory.

- **Face Detection**
  - Uses InsightFace `buffalo_l` to detect faces in each sampled frame.
  - Selects the largest face and resizes it to the configured face output size.

- **Dataset Creation**
  - Builds PyTorch datasets for train, validation, and test splits.
  - Ensures each sample contains a sequence of face images.

- **Model Preparation**
  - Loads or downloads EfficientNet-B4 ImageNet weights.
  - Builds the hybrid model and applies a fine-tuning strategy.
  - Freezes most backbone layers and unfreezes the final `25%` of parameters.

- **Model Training**
  - Uses `AdamW` optimizer with differential learning rates.
  - Uses `BCEWithLogitsLoss` and mixed precision via `GradScaler`.
  - Applies `CosineAnnealingLR` scheduling and gradient clipping.

- **Model Evaluation**
  - Evaluates on a hold-out test set.
  - Produces metrics, classification reports, confusion matrix, and ROC curve artifacts.

### 3. Prediction Pipeline
The production inference pipeline follows these steps:

- **Video upload and validation**
  - FastAPI accepts common video formats and saves them to a temporary working directory.

- **Uniform frame sampling**
  - Samples exactly `32` frames from the source video.
  - Uses the same sample strategy as training for consistency.

- **Face detection and cropping**
  - Detects faces with InsightFace.
  - Retains only the largest face per frame and resizes it.

- **Input tensor creation**
  - Converts images to RGB, resizes, normalizes, and stacks into a tensor.
  - Pads the sequence by repeating the final face if fewer than `32` faces are available.

- **Inference with attention**
  - Runs `forward_with_attention()` to get logits and temporal attention weights.
  - Computes deepfake probability via `sigmoid(logits)`.
  - Returns `REAL` or `DEEPFAKE` based on a `0.5` threshold.

- **Explainable output**
  - Normalizes attention weights and selects the top 5 most influential frames.
  - Produces frame-level scores and timestamps for the UI.

### 4. Checkpoints & Resume Support
Training saves a full checkpoint state that includes:
- model weights
- optimizer state
- scheduler state
- mixed precision scaler state
- current epoch
- best validation loss/accuracy
- patience counter
- training history

This enables robust resume support and safe recovery if training is interrupted.

### 5. Logging & Artifact Tracking
The project logs every major stage to `logs/<timestamp>/...` including:
- pipeline initialization and completion
- dataset sizes and batch counts
- model preparation and fine-tuning details
- training losses and validation metrics
- checkpoint creation and resume operations
- prediction requests, results, and cleanup actions

This logging strategy supports debugging, reproducibility, and production observability.

---

## 📊 Model Evaluation & Metrics

The model was rigorously tested on a hold-out test dataset of 300 videos (150 Real, 150 Deepfake), achieving exceptional performance.

### Quantitative Metrics
* **Accuracy:** 98.00%
* **Precision:** 98.65%
* **Recall:** 97.33%
* **F1-Score:** 97.99%
* **ROC AUC:** 99.87%

### Visual Reports

| Confusion Matrix | ROC Curve |
| :---: | :---: |
| ![Confusion Matrix](assets/model_evaluation/confusion_matrix.png) | ![ROC Curve](assets/model_evaluation/roc_curve.png) |

---