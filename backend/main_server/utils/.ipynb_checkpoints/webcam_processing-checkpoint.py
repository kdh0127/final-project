import os
import cv2
import numpy as np
import tensorflow as tf
from io import BytesIO
from ultralytics import YOLO
from keras.saving import register_keras_serializable
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import ImageDataGenerator, img_to_array
from tensorflow.keras.applications.efficientnet import preprocess_input

# 커스텀 FocalLoss 클래스 정의 및 등록
@register_keras_serializable()
class FocalLoss(tf.keras.losses.Loss):
    def __init__(self, gamma=2., alpha=None, **kwargs):
        super(FocalLoss, self).__init__(**kwargs)
        self.gamma = gamma
        self.alpha = alpha

    def call(self, y_true, y_pred):
        epsilon = tf.keras.backend.epsilon()
        y_pred = tf.clip_by_value(y_pred, epsilon, 1. - epsilon)
        cross_entropy = -y_true * tf.math.log(y_pred)
        weights = tf.pow(1 - y_pred, self.gamma)
        if self.alpha is not None:
            alpha_weight = y_true * self.alpha
            weights *= alpha_weight
        focal_loss = tf.reduce_sum(weights * cross_entropy, axis=-1)
        return focal_loss

    def get_config(self):
        config = super(FocalLoss, self).get_config()
        config.update({
            "gamma": self.gamma,
            "alpha": self.alpha,
        })
        return config

    @classmethod
    def from_config(cls, config):
        return cls(**config)

# 모델 경로
current_dir = os.path.dirname(os.path.abspath(__file__))
cnn_model_path = os.path.join(current_dir, "../bee_image_model.keras")  # CNN 모델 파일 경로
yolo_model_path = os.path.join(current_dir, "../bee_main.pt")  # YOLO 모델 파일 경로

try:
    # 모델 로드 시 FocalLoss 클래스를 포함하여 처리
    cnn_model = load_model(
        cnn_model_path,
        custom_objects={'FocalLoss': FocalLoss}  # 직렬화된 FocalLoss 처리
    )
    print("WEBCAM_CNN 모델 로드 성공.")
except Exception as e:
    print(f"Failed to load CNN model: {e}")

try:
    # YOLO 모델 로드
    yolo_model = YOLO(yolo_model_path)
    print("YOLO 모델 로드 성공.")
except Exception as e:
    print(f"Failed to load YOLO model: {e}")

# 클래스 이름 리스트
CLASS_NAMES = ['feather', 'normal', 'ung']

# ImageDataGenerator 설정
datagen = ImageDataGenerator(preprocessing_function=preprocess_input)

def letterbox_resize(image, target_size):
    """
    Letterbox 패딩 방식을 사용해 이미지를 비율을 유지하며 target_size로 조정합니다.
    """
    original_h, original_w = image.shape[:2]
    target_h, target_w = target_size

    # 비율 계산
    scale = min(target_w / original_w, target_h / original_h)
    new_w, new_h = int(original_w * scale), int(original_h * scale)

    # 이미지 리사이즈
    resized_image = cv2.resize(image, (new_w, new_h), interpolation=cv2.INTER_LINEAR)

    # 패딩 계산
    top_padding = (target_h - new_h) // 2
    bottom_padding = target_h - new_h - top_padding
    left_padding = (target_w - new_w) // 2
    right_padding = target_w - new_w - left_padding

    # 패딩 추가
    padded_image = cv2.copyMakeBorder(resized_image, top_padding, bottom_padding,
                                      left_padding, right_padding, cv2.BORDER_CONSTANT, value=(0, 0, 0))
    return padded_image

def process_webcam_frame(frame):
    """
    YOLO 및 CNN을 사용하여 벌 탐지 및 질병 진단을 수행.
    """
    # 프레임 패딩 추가
    padded_frame = letterbox_resize(frame, (640, 640))
    
    # YOLO 탐지
    results = yolo_model(padded_frame, conf=0.25)

    bees = []
    if results and hasattr(results[0], 'boxes') and results[0].boxes is not None:
        for box in results[0].boxes.xyxy:
            x1, y1, x2, y2 = map(int, box[:4])
            cropped = frame[y1:y2, x1:x2]
            if cropped.shape[0] >= 50 and cropped.shape[1] >= 50:  # 작은 이미지 필터링
                bees.append(cropped)

    # CNN 질병 진단
    diagnoses = []
    for bee_image in bees:
        resized_image = cv2.resize(bee_image, (224, 224))
        img_array = img_to_array(resized_image)
        img_array = np.expand_dims(img_array, axis=0)
        
        # ImageDataGenerator를 사용해 전처리
        processed_image = datagen.flow(img_array, batch_size=1)[0]

        prediction = cnn_model.predict(processed_image)
        class_index = np.argmax(prediction)
        diagnoses.append(CLASS_NAMES[class_index] if 0 <= class_index < len(CLASS_NAMES) else "Unknown")

    return diagnoses
