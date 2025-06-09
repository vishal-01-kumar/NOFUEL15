from flask import Flask, jsonify, request
import cv2
import requests
import easyocr
import numpy as np
import serial
import time
from datetime import datetime
from vehicle_database import vehicle_db

app = Flask(__name__)

# Camera and Arduino setup
ESP32_CAM_URL = 'http://192.168.86.151/capture'
arduino = serial.Serial('COM8', 9600)  # Change if needed
time.sleep(2)

reader = easyocr.Reader(['en'])
CURRENT_YEAR = 2025

def get_frame():
    try:
        response = requests.get(ESP32_CAM_URL, timeout=5)
        img_array = np.asarray(bytearray(response.content), dtype=np.uint8)
        return cv2.imdecode(img_array, -1)
    except Exception as e:
        print("Failed to get frame:", e)
        return None

def get_vehicle_age(plate):
    plate = plate.upper().replace(" ", "")
    if plate in vehicle_db:
        return CURRENT_YEAR - vehicle_db[plate]
    return None

@app.route('/scan', methods=['POST'])
def scan():
    frame = get_frame()
    if frame is None:
        return jsonify({"error": "Camera feed unavailable"}), 500

    results = reader.readtext(frame)
    for (bbox, text, prob) in results:
        if prob > 0.4:
            plate = text.upper().replace(" ", "")
            age = get_vehicle_age(plate)
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

            if age is not None:
                access_status = "allowed" if age <= 15 else "denied"
            else:
                access_status = "denied"

            arduino.write(b'1' if access_status == "allowed" else b'0')

            return jsonify({
                "plate": plate,
                "vehicle_age": age,
                "access_status": access_status,
                "timestamp": timestamp
            })

    return jsonify({"error": "No valid plate detected"}), 400

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
