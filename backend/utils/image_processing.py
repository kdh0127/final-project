from tensorflow.keras.preprocessing.image import img_to_array, load_img
import numpy as np

IMG_SIZE = (224, 224)

def preprocess_image(file):
    img = load_img(file, target_size=IMG_SIZE)
    img = img_to_array(img) / 255.0
    img = np.expand_dims(img, axis=0)
    return img
