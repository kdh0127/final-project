import os
import cv2
import numpy as np
import requests  # HTTP 요청을 위해 추가
from flask import Flask, Response
from ultralytics import YOLO
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.efficientnet import preprocess_input
from tensorflow.keras.preprocessing.image import img_to_array
import tensorflow as tf

# 포컬 로스 정의 (직렬화 지원)
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

# Flask 서버 설정
app = Flask(__name__)

# 모델 불러오기
yolo_model = YOLO("bee_main.pt")  # YOLO v8 모델
cnn_model = load_model("bee_image_model.keras", custom_objects={"FocalLoss": FocalLoss})  # EfficientNetB0 기반 CNN 모델

# 질병 클래스
DISEASE_CLASSES = ["feather", "normal", "ung"]

# 웹캠 설정
CAMERA_WIDTH = 1280
CAMERA_HEIGHT = 720

# 감지된 클래스 서버 전송 함수
SMS_SERVER_URL = "http://10.104.24.231:5002/log_detection"  # sms_server.py 주소 => 인터넷 마다 프론트 쪽이랑 같이 주소 바꿔줘야 함
def send_to_sms_server(disease_label):
    try:
        response = requests.post(SMS_SERVER_URL, json={"class": disease_label})
        if response.status_code == 200:
            print(f"Data sent to SMS server: {disease_label}")
        else:
            print(f"Failed to send data to SMS server: {response.status_code}")
    except Exception as e:
        print(f"Error sending data to SMS server: {e}")

# 영상 스트리밍 및 처리 함수
def generate_frames():
    cap = cv2.VideoCapture(4, cv2.CAP_DSHOW)  # 웹캠 인덱스 4
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, CAMERA_WIDTH)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, CAMERA_HEIGHT)

    if not cap.isOpened():
        print("Error: Cannot access the webcam.")
        return

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            print("Error: Failed to grab frame.")
            break

        # YOLO 객체 감지
        results = yolo_model(frame)

        for result in results:
            if result.boxes is not None:
                for box in result.boxes.data:
                    x1, y1, x2, y2, conf, cls_id = box
                    x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
                    label = yolo_model.names[int(cls_id)]

                    if label == 'bees':  # 클래스 이름이 'bees'인 경우
                        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)

                        # 벌 이미지를 CNN 모델에 전달
                        bee_image = frame[y1:y2, x1:x2]
                        bee_image = cv2.resize(bee_image, (224, 224))
                        bee_image = preprocess_input(img_to_array(bee_image))
                        bee_image = np.expand_dims(bee_image, axis=0)

                        # CNN으로 질병 분류
                        prediction = cnn_model.predict(bee_image, verbose=0)
                        disease_index = np.argmax(prediction)
                        disease_label = DISEASE_CLASSES[disease_index]

                        # 감지된 클래스 전송
                        if disease_label in ["feather", "ung"]:
                            send_to_sms_server(disease_label)

                        # 바운딩 박스 위에 질병 클래스 출력
                        cv2.putText(frame, disease_label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)
                        print(f"Detected bee disease: {disease_label}")

        # 프레임 인코딩
        ret, buffer = cv2.imencode('.jpg', frame)
        if not ret:
            print("Error: Frame encoding failed.")
            continue

        yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')

    cap.release()
    cv2.destroyAllWindows()


# 스트리밍 엔드포인트
@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')


# 서버 실행
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5001, debug=True)
