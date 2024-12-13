import os
import tensorflow as tf
import numpy as np
from io import BytesIO
from flask import Blueprint, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array, load_img, ImageDataGenerator
from tensorflow.keras.applications.efficientnet import preprocess_input
from keras.saving import register_keras_serializable  # 직렬화 지원

# Flask Blueprint 설정
predict_blueprint = Blueprint('predict', __name__)

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

# 현재 파일의 디렉토리 경로 설정
current_dir = os.path.dirname(os.path.abspath(__file__))
cnn_model_path = os.path.join(current_dir, "../bee_image_model.keras")  # CNN 모델 파일 경로

try:
    # 모델 로드 시 FocalLoss 클래스를 포함하여 처리
    cnn_model = load_model(
        cnn_model_path,
        custom_objects={'FocalLoss': FocalLoss}  # 직렬화된 FocalLoss 처리
    )
    print("IMAGE_CNN 모델 로드 성공.")
except Exception as e:
    print(f"Failed to load CNN model: {e}")

# 이미지 크기 및 클래스 이름 설정
IMG_SIZE = (224, 224)
class_names = ['feather', 'normal', 'ung']

# ImageDataGenerator 설정
datagen = ImageDataGenerator(preprocessing_function=preprocess_input)

@predict_blueprint.route('/predict', methods=['POST'])
def predict():
    """
    이미지 파일을 입력받아 CNN 모델로 예측.
    """
    if cnn_model is None:
        return jsonify({'error': 'Model is not loaded'}), 500

    # 파일 확인
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    if file:
        try:
            # 이미지를 모델 입력 형식으로 변환
            img = load_img(BytesIO(file.read()), target_size=IMG_SIZE)
            img = img_to_array(img)
            img = np.expand_dims(img, axis=0)

            # ImageDataGenerator를 사용해 전처리
            img = datagen.flow(img, batch_size=1)[0]

            # 예측 실행
            prediction = cnn_model.predict(img)
            predicted_class = np.argmax(prediction, axis=1)[0]
            predicted_class_name = class_names[predicted_class]

            # 디버깅용 출력
            print(f"Predicted class index: {predicted_class}")
            print(f"Predicted class name: {predicted_class_name}")

            # 결과 반환
            return jsonify({
                'predicted_class': int(predicted_class),
                'predicted_class_name': predicted_class_name
            })

        except Exception as e:
            print(f"Prediction error: {e}")
            return jsonify({'error': f'Prediction failed: {str(e)}'}), 500

    return jsonify({'error': 'Invalid file'}), 400
