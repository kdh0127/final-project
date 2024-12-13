from flask import Blueprint, jsonify, Response
from utils.webcam_processing import process_webcam_frame
import cv2
import threading
import time

webcam_blueprint = Blueprint('webcam', __name__)

# 웹캠 초기화
video_capture = cv2.VideoCapture(4, cv2.CAP_DSHOW)
video_capture.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
video_capture.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

latest_diagnosis = []
lock = threading.Lock()

def diagnose_webcam():
    """
    주기적으로 웹캠에서 프레임을 읽고 YOLO 및 CNN으로 진단 수행.
    """
    global latest_diagnosis
    while True:
        success, frame = video_capture.read()
        if success:
            try:
                # 프레임 진단
                diagnosis = process_webcam_frame(frame)  # webcam_processing.py 사용
                with lock:
                    latest_diagnosis = diagnosis
                print("Latest Diagnosis:", diagnosis)
            except Exception as e:
                print(f"Error during diagnosis: {e}")
        else:
            print("Failed to capture frame.")
        time.sleep(10)  # 주기적 처리 간격 (초 단위)

# 클라이언트로 결과 / 스트리밍 전송

@webcam_blueprint.route('/webcam/diagnose', methods=['GET'])
def get_diagnosis():
    """
    최신 진단 결과를 반환.
    """
    with lock:
        return jsonify({'results': latest_diagnosis})

@webcam_blueprint.route('/webcam/video_feed', methods=['GET'])
def video_feed():
    """
    웹캠의 실시간 비디오 스트림을 클라이언트로 전송.
    """
    def generate_frames():
        while True:
            success, frame = video_capture.read()
            if success:
                try:
                    _, buffer = cv2.imencode('.jpg', frame)
                    yield (b'--frame\r\n'
                           b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')
                except Exception as e:
                    print(f"Error encoding frame: {e}")
                    break
            else:
                print("Failed to capture frame.")
                break
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

# 백그라운드에서 진단 스레드 실행
threading.Thread(target=diagnose_webcam, daemon=True).start()