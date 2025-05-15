# 🐱 Cat Town - Posture Monitoring Application

A posture monitoring application that uses computer vision and pixel art cats to encourage better sitting habits during work.

---

## 📖 Overview

Cat Town is a web application that tracks your posture in real-time using your webcam and MediaPipe pose detection. Virtual pixel cats react to your posture and provide alerts when you need to sit up straight.

🔗 **Live Demo**: [https://ergonomicengineers.github.io/CatTown/](https://ergonomicengineers.github.io/CatTown/)

---

## ✨ Features

- Real-time webcam-based posture detection  
- Uses MediaPipe for pose estimation  
- Animated pixel cats give visual feedback  
- Gamified nudges to encourage good posture  
- Lightweight browser-based interface

---

## ⚙️ Prerequisites

- Python 3.8 - 3.10 
- npm package manager  
- Webcam for posture detection  
- macOS (tested environment)

---

## 📦 Installation

### 1. Clone the Repository
- git clone https://github.com/ergonomicengineers/CatTown.git
- cd CatTown

## 🛠️ Installation

### 📦 Backend Setup (Python)

Install the required Python dependencies:

```bash
pip install flask
pip install flask-cors
pip install mediapipe
pip install opencv-python
pip install numpy
````

## 🧑‍💻 Frontend Setup

Install Node.js dependencies:

```bash
npm install
````

## 🚀 Running the Application

### ▶️ Start Backend Server

Navigate to the backend directory and run the Flask server:

```bash
cd backend
python app.py
````
Note: app.py is located in the videoscore folder
This starts the Flask server at: http://localhost:5000


### ▶️ Start Frontend

In a new terminal, run:

```bash
npm start
````
This opens the React app at: http://localhost:3000

## 🎮 Instructions

1. Open [http://localhost:3000](http://localhost:3000) in your browser  
2. Allow **camera permissions** when prompted  
3. Toggle the camera to enable posture scoring  
4. Position yourself in front of the camera  
5. Click **"Start"** to begin the monitoring session  
6. Maintain good posture — the **pixel cats** will react to your position!
