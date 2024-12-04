import os
from flask import Blueprint, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array, load_img
from tensorflow.keras.applications.efficientnet import preprocess_input
import numpy as np
from io import BytesIO

predict_blueprint = Blueprint('predict', __name__)




# 모델 로드
current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(current_dir, "../bee_image_model.keras")  # 모델 파일 경로
model = load_model(model_path)
print("Model loaded successfully.")

# 이미지 크기 및 클래스 이름 설정
IMG_SIZE = (224, 224)
class_names = ['feather', 'normal', 'ung']

@predict_blueprint.route('/predict', methods=['POST'])
def predict():
    # 파일이 요청에 포함되었는지 확인
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    if file:
        try:
            # 이미지를 모델 입력 형식으로 변환
            img = load_img(BytesIO(file.read()), target_size=IMG_SIZE)
            img = img_to_array(img)
            img = preprocess_input(img)  # 주피터 노트북과 동일한 전처리 적용
            img = np.expand_dims(img, axis=0)

            # 예측 실행
            prediction = model.predict(img)
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
            print(f"Prediction error: {e}")  # 디버깅용 에러 출력
            return jsonify({'error': f'Prediction failed: {str(e)}'}), 500

    return jsonify({'error': 'Invalid file'}), 400
