import requests

# 웹캠 서버 URL 설정
WEBCAM_SERVER_URL = "http://localhost:5001"

def get_diagnosis():
    """
    웹캠 서버에서 최신 진단 결과를 요청.
    :return: 진단 결과(JSON 형식) 또는 오류 메시지.
    """
    try:
        response = requests.get(f"{WEBCAM_SERVER_URL}/webcam/diagnose")
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        return {"error": str(e)}

def stream_video():
    """
    웹캠 서버의 비디오 스트리밍 데이터를 반환.
    :return: 스트리밍 데이터 제너레이터 또는 오류 메시지.
    """
    try:
        response = requests.get(f"{WEBCAM_SERVER_URL}/webcam/video_feed", stream=True)
        response.raise_for_status()
        return response.iter_content(chunk_size=8192)
    except requests.exceptions.RequestException as e:
        raise RuntimeError(f"Failed to stream video: {str(e)}")
