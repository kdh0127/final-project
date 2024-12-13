from flask import Flask
from flask_cors import CORS
from webcam_predict import webcam_blueprint, diagnose_webcam
import threading
import atexit
import time

# Flask 애플리케이션 초기화
app = Flask(__name__)
CORS(app)

# Blueprint 등록
app.register_blueprint(webcam_blueprint, url_prefix="/webcam")

# 글로벌 변수
diagnose_thread = None
thread_running = True

def start_diagnose_thread():
    """
    진단 스레드를 시작.
    """
    global diagnose_thread
    diagnose_thread = threading.Thread(target=diagnose_webcam, daemon=True)
    diagnose_thread.start()

def stop_diagnose_thread():
    """
    서버 종료 시 스레드 종료.
    """
    global thread_running
    thread_running = False
    if diagnose_thread and diagnose_thread.is_alive():
        diagnose_thread.join()

# 서버 종료 시 리소스 해제
@atexit.register
def cleanup():
    stop_diagnose_thread()
    print("Server resources have been cleaned up.")

if __name__ == "__main__":
    # 백그라운드 스레드 실행
    start_diagnose_thread()

    # Flask 서버 실행
    try:
        app.run(host="0.0.0.0", port=5001, debug=True)
    except KeyboardInterrupt:
        print("Server shutting down...")
