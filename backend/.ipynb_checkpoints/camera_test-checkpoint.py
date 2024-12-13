import cv2

# DirectShow 백엔드 사용하여 웹캠 열기
cap = cv2.VideoCapture(4, cv2.CAP_DSHOW)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 640)

if not cap.isOpened():
    print("Error: Could not access the camera.")
    exit()

# 실제 적용된 해상도 확인
actual_width = cap.get(cv2.CAP_PROP_FRAME_WIDTH)
actual_height = cap.get(cv2.CAP_PROP_FRAME_HEIGHT)
print(f"Actual Width: {actual_width}, Actual Height: {actual_height}")

print("Press 'q' to quit the camera test.")

while True:
    # 프레임 읽기
    success, frame = cap.read()
    if success:
        # 프레임 창에 표시
        cv2.imshow("Camera Test", frame)
    else:
        print("Failed to capture frame.")
        break

    # 'q' 키를 눌러 종료
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# 리소스 해제
cap.release()
cv2.destroyAllWindows()
