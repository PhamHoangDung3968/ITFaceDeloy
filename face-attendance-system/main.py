import os.path
import datetime
import pickle

import tkinter as tk
import cv2
from PIL import Image, ImageTk
import face_recognition

from flask import Flask, request, jsonify
import numpy as np
import io
import base64
app = Flask(__name__)

import util
from Silent_Face_Anti_Spoofing.test import test


class App:
    def __init__(self):
        self.main_window = tk.Tk()
        self.main_window.geometry("1200x520+350+100")

        self.login_button_main_window = util.get_button(self.main_window, 'login', 'green', self.login)
        self.login_button_main_window.place(x=750, y=200)

        self.logout_button_main_window = util.get_button(self.main_window, 'logout', 'red', self.logout)
        self.logout_button_main_window.place(x=750, y=300)

        self.register_new_user_button_main_window = util.get_button(self.main_window, 'register new user', 'gray',
                                                                    self.register_new_user, fg='black')
        self.register_new_user_button_main_window.place(x=750, y=400)

        self.webcam_label = util.get_img_label(self.main_window)
        self.webcam_label.place(x=10, y=0, width=700, height=500)

        self.add_webcam(self.webcam_label)

        self.db_dir = './face-attendance-system/db'
        if not os.path.exists(self.db_dir):
            os.mkdir(self.db_dir)

        self.log_path = './face-attendance-system/log.txt'
        self.image_count = 0
        self.embeddings = []

    def add_webcam(self, label):
        if 'cap' not in self.__dict__:
            self.cap = cv2.VideoCapture(0)  # Adjust the index if needed
            if not self.cap.isOpened():
                print("Error: Could not open webcam.")
                return

        self._label = label
        self.process_webcam()

    def process_webcam(self):
        ret, frame = self.cap.read()
        if not ret:
            print("Error: Could not read frame from webcam.")
            return

        self.most_recent_capture_arr = frame
        img_ = cv2.cvtColor(self.most_recent_capture_arr, cv2.COLOR_BGR2RGB)
        self.most_recent_capture_pil = Image.fromarray(img_)
        imgtk = ImageTk.PhotoImage(image=self.most_recent_capture_pil)
        self._label.imgtk = imgtk
        self._label.configure(image=imgtk)

        self._label.after(20, self.process_webcam)
        
    # def login(self):
    #     label = test(
    #         image=self.most_recent_capture_arr,
    #         model_dir='./face-attendance-system/Silent_Face_Anti_Spoofing/resources/anti_spoof_models',
    #         device_id=0
    #     )

    #     if label == 1:
    #         name = util.recognize(self.most_recent_capture_arr, self.db_dir)

    #         if name in ['unknown_person', 'no_persons_found']:
    #             util.msg_box('Ups...', 'Unknown user. Please register new user or try again.')
    #         else:
    #             util.msg_box('Welcome back!', 'Welcome, {}.'.format(name))
    #             with open(self.log_path, 'a') as f:
    #                 f.write('{},{},in\n'.format(name, datetime.datetime.now()))
    #                 f.close()

    #             # Create user directory if it doesn't exist
    #             user_dir = os.path.join(self.db_dir, name)
    #             if not os.path.exists(user_dir):
    #                 os.makedirs(user_dir)

    #             try:
    #                 # Count the number of images already saved
    #                 existing_images = len([name for name in os.listdir(user_dir) if os.path.isfile(os.path.join(user_dir, name))])

    #                 if existing_images < 5:
    #                     # Save the new image
    #                     image_path = os.path.join(user_dir, 'login_{}.jpg'.format(existing_images + 1))
    #                     cv2.imwrite(image_path, self.most_recent_capture_arr)

    #                     # Load existing embeddings
    #                     file_path = os.path.join(self.db_dir, '{}.pickle'.format(name))
    #                     if os.path.exists(file_path):
    #                         with open(file_path, 'rb') as file:
    #                             embeddings = pickle.load(file)
    #                     else:
    #                         embeddings = []

    #                     # Update embeddings if less than 5 images
    #                     if len(embeddings) < 5:
    #                         new_embedding = face_recognition.face_encodings(self.most_recent_capture_arr)[0]
    #                         embeddings.append(new_embedding)
    #                         with open(file_path, 'wb') as file:
    #                             pickle.dump(embeddings, file)
    #             except PermissionError as e:
    #                 print(f"PermissionError: {e}")
    #                 util.msg_box('Error', 'Permission denied. Please check your directory permissions.')
    #     else:
    #         util.msg_box('Hey, you are a spoofer!', 'You are fake!')

    def login(self):
        label = test(
            image=self.most_recent_capture_arr,
            model_dir='./face-attendance-system/Silent_Face_Anti_Spoofing/resources/anti_spoof_models',
            device_id=0
        )

        if label == 1:
            name = util.recognize(self.most_recent_capture_arr, self.db_dir)

            if name in ['unknown_person', 'no_persons_found']:
                util.msg_box('Ups...', 'Unknown user. Please register new user or try again.')
            else:
                util.msg_box('Welcome back!', 'Welcome, {}.'.format(name))
                with open(self.log_path, 'a') as f:
                    f.write('{},{},in\n'.format(name, datetime.datetime.now()))

                # Create user directory if it doesn't exist
                user_dir = os.path.join(self.db_dir, name)
                if not os.path.exists(user_dir):
                    os.makedirs(user_dir)

                try:
                    # Count the number of images already saved
                    existing_images = len([name for name in os.listdir(user_dir) if os.path.isfile(os.path.join(user_dir, name))])

                    if existing_images < 5:
                        # Save the new image
                        image_path = os.path.join(user_dir, 'login_{}.jpg'.format(existing_images + 1))
                        cv2.imwrite(image_path, self.most_recent_capture_arr)

                        # Load existing embeddings
                        file_path = os.path.join(self.db_dir, '{}.pickle'.format(name))
                        if os.path.exists(file_path):
                            with open(file_path, 'rb') as file:
                                embeddings = pickle.load(file)
                        else:
                            embeddings = []

                        # Update embeddings if less than 5 images
                        if len(embeddings) < 5:
                            new_embedding = face_recognition.face_encodings(self.most_recent_capture_arr, num_jitters=10)[0]  # Sử dụng num_jitters
                            embeddings.append(new_embedding)
                            with open(file_path, 'wb') as file:
                                pickle.dump(embeddings, file)
                except PermissionError as e:
                    print(f"PermissionError: {e}")
                    util.msg_box('Error', 'Permission denied. Please check your directory permissions.')
        else:
            util.msg_box('Hey, you are a spoofer!', 'You are fake!')

    def logout(self):
        label = test(
            image=self.most_recent_capture_arr,
            model_dir='/home/phillip/Desktop/todays_tutorial/27_face_recognition_spoofing/code/face-attendance-system/Silent-Face-Anti-Spoofing/resources/anti_spoof_models',
            device_id=0
        )

        if label == 1:
            name = util.recognize(self.most_recent_capture_arr, self.db_dir)

            if name in ['unknown_person', 'no_persons_found']:
                util.msg_box('Ups...', 'Unknown user. Please register new user or try again.')
            else:
                util.msg_box('Hasta la vista !', 'Goodbye, {}.'.format(name))
                with open(self.log_path, 'a') as f:
                    f.write('{},{},out\n'.format(name, datetime.datetime.now()))
                    f.close()
        else:
            util.msg_box('Hey, you are a spoofer!', 'You are fake !')

            
    def register_new_user(self):
        self.register_new_user_window = tk.Toplevel(self.main_window)
        self.register_new_user_window.geometry("1200x520+370+120")

        self.accept_button_register_new_user_window = util.get_button(self.register_new_user_window, 'Accept', 'green', self.accept_register_new_user)
        self.accept_button_register_new_user_window.place(x=750, y=300)

        self.try_again_button_register_new_user_window = util.get_button(self.register_new_user_window, 'Try again', 'red', self.try_again_register_new_user)
        self.try_again_button_register_new_user_window.place(x=750, y=400)

        self.capture_label = util.get_img_label(self.register_new_user_window)
        self.capture_label.place(x=10, y=0, width=700, height=500)

        self.add_img_to_label(self.capture_label)

        self.entry_text_register_new_user = util.get_entry_text(self.register_new_user_window)
        self.entry_text_register_new_user.place(x=750, y=150)

        self.text_label_register_new_user = util.get_text_label(self.register_new_user_window, 'Please, \ninput username:')
        self.text_label_register_new_user.place(x=750, y=70)

    def try_again_register_new_user(self):
        self.register_new_user_window.destroy()

    def add_img_to_label(self, label):
        imgtk = ImageTk.PhotoImage(image=self.most_recent_capture_pil)
        label.imgtk = imgtk
        label.configure(image=imgtk)

        self.register_new_user_capture = self.most_recent_capture_arr.copy()

    def start(self):
        self.main_window.mainloop()

    def accept_register_new_user(self):
        name = self.entry_text_register_new_user.get(1.0, "end-1c").strip()
        face_encodings = face_recognition.face_encodings(self.register_new_user_capture, num_jitters=10)  # Sử dụng num_jitters
        if not face_encodings:
            util.msg_box('Error', 'No face detected. Please try again.')
            return
        embeddings = face_encodings[0]
        file_path = os.path.join(self.db_dir, f'{name}.pickle')
        with open(file_path, 'wb') as file:
            pickle.dump(embeddings, file)
        self.register_new_user_window.destroy()
    # def re_register_user(self):
    #     name = self.entry_text_re_register.get(1.0, "end-1c").strip()
        
    #     # Kiểm tra xem tên người dùng có hợp lệ không
    #     if not name:
    #         util.msg_box('Error', 'Username cannot be empty. Please enter a valid username.')
    #         return

    #     # Kiểm tra xem người dùng đã tồn tại chưa
    #     file_path = os.path.join(self.db_dir, f'{name}.pickle')
    #     if not os.path.exists(file_path):
    #         util.msg_box('Error', 'User  does not exist. Please register first.')
    #         return

    #     # Lấy mã hóa khuôn mặt cũ
    #     with open(file_path, 'rb') as file:
    #         old_embeddings = pickle.load(file)

    #     # Sử dụng num_jitters để cải thiện độ chính xác
    #     face_encodings = face_recognition.face_encodings(self.re_register_capture, num_jitters=10)  
    #     if not face_encodings:
    #         util.msg_box('Error', 'No face detected. Please try again.')
    #         return

    #     new_embeddings = face_encodings[0]
        
    #     # Kết hợp mã hóa cũ và mới
    #     combined_embeddings = (old_embeddings + new_embeddings) / 2  # Trung bình hóa

    #     # Lưu mã hóa khuôn mặt đã cập nhật vào tệp
    #     with open(file_path, 'wb') as file:
    #         pickle.dump(combined_embeddings, file)

    #     util.msg_box('Success', 'User  data has been updated successfully!')
    #     self.re_register_window.destroy()


@app.route('/api/add_webcam', methods=['POST'])
def add_webcam():
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        return jsonify({"error": "Could not open webcam."}), 500

    ret, frame = cap.read()
    if not ret:
        return jsonify({"error": "Could not read frame from webcam."}), 500

    img_ = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    pil_img = Image.fromarray(img_)
    buf = io.BytesIO()
    pil_img.save(buf, format='JPEG')
    byte_im = buf.getvalue()
    base64_str = base64.b64encode(byte_im).decode('utf-8')

    return jsonify({"image": base64_str})

#Đăng kí FaceID
# @app.route('/api/register', methods=['POST'])
# def register_user():
#     try:
#         data = request.json
#         name = data['name']
#         image_data = data['image']
#         image = np.array(Image.open(io.BytesIO(base64.b64decode(image_data))))

#         face_encodings = face_recognition.face_encodings(image)
#         if not face_encodings:
#             return jsonify({'status': 'error', 'message': 'No face detected. Please try again.'}), 400

#         embeddings = face_encodings[0]

#         db_dir = './db'
#         if not os.path.exists(db_dir):
#             os.makedirs(db_dir)

#         file_path = os.path.join(db_dir, f'{name}.pickle')
#         with open(file_path, 'wb') as file:
#             pickle.dump(embeddings, file)

#         return jsonify({'status': 'success', 'message': 'User was registered successfully!'})

#     except Exception as e:
#         return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/register', methods=['POST'])
def register_user():
    try:
        data = request.json
        name = data['name']
        image_data = data['image']
        image = np.array(Image.open(io.BytesIO(base64.b64decode(image_data))))

        face_encodings = face_recognition.face_encodings(image, num_jitters=10)  # Added num_jitters for better accuracy
        if not face_encodings:
            return jsonify({'status': 'error', 'message': 'No face detected. Please try again.'}), 400

        embeddings = face_encodings[0]

        db_dir = './db'
        if not os.path.exists(db_dir):
            os.makedirs(db_dir)

        file_path = os.path.join(db_dir, f'{name}.pickle')
        with open(file_path, 'wb') as file:
            pickle.dump(embeddings, file)

        return jsonify({'status': 'success', 'message': 'User was registered successfully!'})

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500
    

# @app.route('/api/login', methods=['POST'])
# def login():
#     try:
#         data = request.json
#         user_name = data['name']
#         image_data = data['image']
#         image = np.array(Image.open(io.BytesIO(base64.b64decode(image_data))))

#         label = test(
#             image=image,
#             model_dir='./Silent_Face_Anti_Spoofing/resources/anti_spoof_models',
#             device_id=0
#         )
#         db_dir = './db'
#         log_path = './log.txt'
#         if label == 1:
#             recognized_name = util.recognize(image, db_dir)
#             if recognized_name != user_name:
#                 return jsonify({'status': 'error', 'message': 'Tên đăng nhập không khớp. Vui lòng thử lại.'}), 401
#             else:
#                 with open(log_path, 'a') as f:
#                     f.write('{},{},in\n'.format(recognized_name, datetime.datetime.now()))

#                 # Create user directory if it doesn't exist
#                 user_dir = os.path.join(db_dir, recognized_name)
#                 if not os.path.exists(user_dir):
#                     os.makedirs(user_dir)

#                 try:
#                     # Count the number of images already saved
#                     existing_images = len([name for name in os.listdir(user_dir) if os.path.isfile(os.path.join(user_dir, name))])

#                     if existing_images < 5:
#                         # Convert color format from RGB to BGR
#                         image_bgr = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
                        
#                         # Save the new image
#                         image_path = os.path.join(user_dir, 'login_{}.jpg'.format(existing_images + 1))
#                         cv2.imwrite(image_path, image_bgr)

#                         # Load existing embeddings
#                         file_path = os.path.join(db_dir, '{}.pickle'.format(recognized_name))
#                         if os.path.exists(file_path):
#                             with open(file_path, 'rb') as file:
#                                 embeddings = pickle.load(file)
#                         else:
#                             embeddings = []

#                         # Update embeddings if less than 5 images
#                         if len(embeddings) < 5:
#                             new_embedding = face_recognition.face_encodings(image, num_jitters=10)[0]  # Added num_jitters for better accuracy
#                             embeddings.append(new_embedding)
#                             with open(file_path, 'wb') as file:
#                                 pickle.dump(embeddings, file)
#                 except PermissionError as e:
#                     print(f"PermissionError: {e}")
#                     return jsonify({'status': 'error', 'message': 'Permission denied. Please check your directory permissions.'}), 500

#                 return jsonify({'status': 'success', 'message': 'Welcome, {}.'.format(recognized_name)}), 200
#         else:
#             return jsonify({'status': 'error', 'message': 'You are a spoofer!'}), 403

#     except Exception as e:
#         return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.json
        user_name = data['name']
        image_data = data['image']
        image = np.array(Image.open(io.BytesIO(base64.b64decode(image_data))))

        label = test(
            image=image,
            model_dir='./Silent_Face_Anti_Spoofing/resources/anti_spoof_models',
            device_id=0
        )
        db_dir = './db'
        log_path = './log.txt'
        if label == 1:
            recognized_name = util.recognize(image, db_dir)
            if recognized_name != user_name:
                return jsonify({'status': 'error', 'message': 'Tên đăng nhập không khớp. Vui lòng thử lại.'}), 401
            else:
                with open(log_path, 'a') as f:
                    f.write('{},{},in\n'.format(recognized_name, datetime.datetime.now()))

                # Create user directory if it doesn't exist
                user_dir = os.path.join(db_dir, recognized_name)
                if not os.path.exists(user_dir):
                    os.makedirs(user_dir)

                # Optionally save face embeddings
                file_path = os.path.join(db_dir, f'{recognized_name}.pickle')
                face_encodings = face_recognition.face_encodings(image, num_jitters=10)
                if face_encodings:
                    with open(file_path, 'wb') as file:
                        pickle.dump(face_encodings[0], file)

                return jsonify({'status': 'success', 'message': 'Welcome, {}.'.format(recognized_name)}), 200
        else:
            return jsonify({'status': 'error', 'message': 'You are a spoofer!'}), 403

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500
    
#kiểm tra người dùng đã đăng ký FaceID chưa
@app.route('/api/check_user', methods=['POST'])
def check_user():
    try:
        data = request.json
        name = data['name']

        db_dir = './db'
        file_path = os.path.join(db_dir, f'{name}.pickle')
        if os.path.exists(file_path):
            return jsonify({'status': 'success', 'message': 'User is already registered.'}), 200
        else:
            return jsonify({'status': 'error', 'message': 'User not found.'}), 404

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500
    
@app.route('/api/re_register', methods=['POST'])
def re_register_user():
    try:
        data = request.json
        name = data['name']
        image_data = data['image']
        image = np.array(Image.open(io.BytesIO(base64.b64decode(image_data))))

        # Check if the username is valid
        if not name:
            return jsonify({'status': 'error', 'message': 'Username cannot be empty. Please enter a valid username.'}), 400

        db_dir = './db'
        file_path = os.path.join(db_dir, f'{name}.pickle')

        # Check if the user exists
        if not os.path.exists(file_path):
            return jsonify({'status': 'error', 'message': 'User does not exist. Please register first.'}), 400

        # Load old face embeddings
        with open(file_path, 'rb') as file:
            old_embeddings = pickle.load(file)

        # Use num_jitters for better accuracy
        face_encodings = face_recognition.face_encodings(image, num_jitters=10)
        if not face_encodings:
            return jsonify({'status': 'error', 'message': 'No face detected. Please try again.'}), 400

        new_embeddings = face_encodings[0]

        # Combine old and new embeddings
        combined_embeddings = (old_embeddings + new_embeddings) / 2  # Averaging

        # Save updated face embeddings to file
        with open(file_path, 'wb') as file:
            pickle.dump(combined_embeddings, file)

        return jsonify({'status': 'success', 'message': 'User data has been updated successfully!'}), 200

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

# @app.route('/api/admin/release_webcam', methods=['POST'])
# def release_webcam():
#     cap = cv2.VideoCapture(0)
#     if cap.isOpened():
#         cap.release()
#         return jsonify({"message": "Đã giải phóng webcam thành công."}), 200
#     else:
#         return jsonify({"error": "Webcam không mở."}), 500
# if __name__ == "__main__":
#     app = App()
#     app.start()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)