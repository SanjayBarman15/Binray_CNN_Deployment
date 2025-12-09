import tensorflow as tf
from tensorflow.keras.preprocessing import image
import numpy as np
import sys

# Load the trained model
model = tf.keras.models.load_model('final_model.h5')

def predict_image(image_path):
    try:
        # Load and preprocess the image
        test_image = image.load_img(image_path, target_size=(64, 64))
        test_image = image.img_to_array(test_image)
        test_image = np.expand_dims(test_image, axis=0)

        # Make prediction
        result = model.predict(test_image)
        
        # Determine class (assuming 1 is dog, but checking class_indices is better if we had them)
        # In the original script: result[0][0] == 1 means dog
        if result[0][0] == 1:
            prediction = 'dog'
        else:
            prediction = 'cat'
            
        print(f"Prediction: {prediction}")
        return prediction

    except Exception as e:
        print(f"Error predicting image: {e}")
        return None

# if __name__ == "__main__":
#     if len(sys.argv) > 1:
#         img_path = sys.argv[1]
#         predict_image(img_path)
#     else:
#         # Default test image if no argument provided
#         # You can change this path or pass a path as an argument
#         default_path = 'test_set/cats/cat.4001.jpg' 
#         print(f"No image path provided. Using default: {default_path}")
#         predict_image(default_path)
if __name__ == "__main__":
    if len(sys.argv) > 1:
        img_path = sys.argv[1]
    else:
        print("No image path provided.")
        print("👉 Please enter the image path below:")
        img_path = input("Image Path: ")

    predict_image(img_path)

