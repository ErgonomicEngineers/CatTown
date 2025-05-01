from flask import Flask, render_template, Response, jsonify
import cv2
import mediapipe as mp
import time

app = Flask(__name__)

# Initialize MediaPipe Pose
mp_pose = mp.solutions.pose
pose = mp_pose.Pose()
mp_drawing = mp.solutions.drawing_utils

cap = cv2.VideoCapture(0)

last_time = time.time()
interval = 5  # seconds between posture checks
last_score = 0

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

    raw_score = (ft_score * 0.4 + ht_score * 0.2 + si_score * 0.2 + rot_score * 0.2)
    posture_score = max(1, round(raw_score))
    return posture_score

def generate_frames():
    global last_time, last_score

    while True:
        success, frame = cap.read()
        if not success:
            break

        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(image)

        if results.pose_landmarks:
            mp_drawing.draw_landmarks(frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

            current_time = time.time()
            if current_time - last_time >= interval:
                last_score = calculate_posture_score(results.pose_landmarks.landmark)
                print(f"Posture Score: {last_score}")
                last_time = current_time

        # No longer drawing posture score on the frame

        _, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/video')
def video():
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/score')
def score():
    return jsonify({"score": last_score})

if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True, port=5001)