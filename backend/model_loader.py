import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image
from PIL import Image
import io
import base64

# Load your saved model
model = tf.keras.models.load_model("final_model.h5")

def preprocess_image(file_bytes):
    img = Image.open(io.BytesIO(file_bytes)).convert("RGB")
    img = img.resize((64, 64))
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array, img

def predict_image(file_bytes):
    img_array, original_img = preprocess_image(file_bytes)

    prediction = model.predict(img_array)[0][0]

    label = "dog" if prediction >= 0.5 else "cat"

    # Convert image to base64 string
    buffer = io.BytesIO()
    original_img.save(buffer, format="PNG")
    img_base64 = base64.b64encode(buffer.getvalue()).decode("utf-8")

    return {
        "label": label,
        "confidence": float(prediction),
        "image": img_base64
    }
