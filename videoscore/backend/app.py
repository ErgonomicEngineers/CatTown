from flask import Flask, Response, jsonify
from flask_cors import CORS
import cv2
import mediapipe as mp
import time
import threading
import warnings

warnings.filterwarnings("ignore", category=UserWarning, message="resource_tracker")

app = Flask(__name__)
CORS(app)

# Camera setup
cap = cv2.VideoCapture(0)
cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)

# MediaPipe pose
mp_pose = mp.solutions.pose
pose = mp_pose.Pose()
mp_drawing = mp.solutions.drawing_utils

# Globals
latest_frame = None
last_score = 0
last_time = time.time()
interval = 1
lock = threading.Lock()

def calculate_posture_score(landmarks):
    nose = landmarks[0]
    left_ear = landmarks[7]
    right_ear = landmarks[8]
    left_shoulder = landmarks[11]
    right_shoulder = landmarks[12]
    shoulder_mid_x = (left_shoulder.x + right_shoulder.x) / 2
    forward_tilt = abs(nose.x - shoulder_mid_x)
    head_tilt = abs(left_ear.y - right_ear.y)
    shoulder_imbalance = abs(left_shoulder.y - right_shoulder.y)
    dist_left = abs(nose.x - left_shoulder.x)
    dist_right = abs(nose.x - right_shoulder.x)
    rotation = abs(dist_left - dist_right)

    ft_score = min(forward_tilt / 0.10 * 10, 10)
    ht_score = min(head_tilt / 0.10 * 10, 10)
    si_score = min(shoulder_imbalance / 0.10 * 10, 10)
    rot_score = min(rotation / 0.10 * 10, 10)

    raw_score = ft_score * 0.4 + ht_score * 0.2 + si_score * 0.2 + rot_score * 0.2
    return max(1, 11 - round(raw_score))

def camera_loop():
    global latest_frame, last_score, last_time

    while True:
        if not cap.isOpened():
            cap.open(0)
            time.sleep(1)
            continue

        success, frame = cap.read()
        if not success:
            continue

        image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(image_rgb)

        if results.pose_landmarks:
            mp_drawing.draw_landmarks(frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
            current_time = time.time()
            if current_time - last_time >= interval:
                score = calculate_posture_score(results.pose_landmarks.landmark)
                with lock:
                    last_score = score
                    last_time = current_time

        with lock:
            latest_frame = frame.copy()

        time.sleep(0.01)

def generate_frames():
    global latest_frame
    while True:
        with lock:
            if latest_frame is None:
                continue
            success, buffer = cv2.imencode('.jpg', latest_frame)
            if not success:
                continue
            frame_bytes = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

@app.route('/video')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/score')
def get_score():
    with lock:
        return jsonify({"score": last_score})

if __name__ == '__main__':
    threading.Thread(target=camera_loop, daemon=True).start()
    app.run(host='0.0.0.0', port=5001, debug=True)
