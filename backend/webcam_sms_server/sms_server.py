import os
from flask import Flask, request, jsonify
from twilio.rest import Client
from dotenv import load_dotenv
from datetime import datetime

# .env 파일 불러오기
load_dotenv("key_sms.env")

app = Flask(__name__)

# Twilio 설정 (env 파일에서 가져오기)
ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_PHONE = os.getenv("TWILIO_PHONE")
TO_PHONE = os.getenv("TO_PHONE")
client = Client(ACCOUNT_SID, AUTH_TOKEN)

# 감지 횟수 및 클래스별 임계값 설정
class_counts = {"feather": 0, "ung": 0}
thresholds = {"feather": 10000, "ung": 10000}  # 클래스별 임계값 설정

# 클래스명 매핑 (메시지 내용용)
CLASS_NAME_MAPPING = {
    "feather": "날개불구감염병",
    "ung": "응애병"
}

# 발송 메시지 내역 저장 리스트
sent_messages_log = []

# 문자 메시지 전송 함수
def send_sms(detected_classes):
    translated_classes = [CLASS_NAME_MAPPING.get(cls, cls) for cls in detected_classes]
    # 현재시간을 HH:MM 형식으로 가져오기
    current_time = datetime.now().strftime("%H:%M")
    message_body = f"{current_time} 부산광역시 기장군 기장읍 기장대로 313\n[3번 벌통] {', '.join(translated_classes)} 감지"

    try:
        message = client.messages.create(
            to="+821027851989",
            from_="+13613385019",
            body=message_body
        )
        print("SMS sent successfully:", message.sid)
        
        # 로그 저장을 위한 상세 시간 (년-월-일 시:분:초)
        log_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # 메시지 내역 로그에 저장
        sent_messages_log.append({
            "timestamp": log_time,
            "detected_classes": translated_classes,
            "message_sid": message.sid,
            "raw_body": message_body
        })
    except Exception as e:
        print("Error sending SMS:", e)

# 감지된 클래스 데이터 수신 엔드포인트
@app.route('/log_detection', methods=['POST'])
def log_detection():
    data = request.get_json()
    detected_class = data.get("class")

    if detected_class in class_counts:
        class_counts[detected_class] += 1
        print(f"Received {detected_class}: {class_counts[detected_class]} times")  # 누적 횟수 서버 콘솔 표시

        # 클래스별 임계값 확인
        if class_counts[detected_class] >= thresholds[detected_class]:
            print(f"{detected_class} 감지가 {thresholds[detected_class]}회 초과: 문자 전송")
            send_sms([detected_class])
            class_counts[detected_class] = 0  # 감지 횟수 초기화

    return jsonify({"status": "success", "class": detected_class})

# 발송된 메시지 내역 조회 엔드포인트
@app.route('/messages', methods=['GET'])
def get_messages():
    return jsonify(sent_messages_log)

# 서버 실행
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5002, debug=True)
