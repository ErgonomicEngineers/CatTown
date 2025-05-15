Cat Town - Posture Monitoring Application
A posture monitoring application that uses computer vision and pixel art cats to encourage better sitting habits during work.

Overview
Cat Town is a web application that tracks your posture in real-time using your webcam and MediaPipe pose detection. Virtual pixel cats react to your posture and provide alerts when you need to sit up straight.
Live Demo: https://ergonomicengineers.github.io/CatTown/
Features

Installation
Clone Repository
git clone https://github.com/ergonomicengineers/CatTown.git
cd CatTown

Install Python dependencies:
pip install flask
pip install flask-cors
pip install mediapipe
pip install opencv-python
pip install numpy

Frontend Setup
Install Node.js dependencies:
npm install
Running the Application

Start Backend Server
Navigate to backend directory and run:
cd backend
python app.py (located in videoscore file - backend)
This starts the Flask server on http://localhost:5000

Start Frontend
In a new terminal, run:
npm start
This opens the React app at http://localhost:3000


Instructions:
Open http://localhost:3000 in your browser
Allow camera permissions when prompted
Toggle the camera to enable posture scoring
Position yourself in front of the camera
Click "Start" to begin monitoring session
Maintain good posture while cats react to your position

