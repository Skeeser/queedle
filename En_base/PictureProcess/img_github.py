# from numba import jit
import numpy as np

def floyd_steinberg(image):
    # image: np.array of shape (height, width), dtype=float, 0.0-1.0
    # works in-place!
    h, w = image.shape
    for y in range(h):
        for x in range(w):
            old = image[y, x]
            new = np.round(old)
            image[y, x] = new
            error = old - new
            # precomputing the constants helps
            if x + 1 < w:
                image[y, x + 1] += error * 0.4375 # right, 7 / 16
            if (y + 1 < h) and (x + 1 < w):
                image[y + 1, x + 1] += error * 0.0625 # right, down, 1 / 16
            if y + 1 < h:
                image[y + 1, x] += error * 0.3125 # down, 5 / 16
            if (x - 1 >= 0) and (y + 1 < h):
                image[y + 1, x - 1] += error * 0.1875 # left, down, 3 / 16
    return image

# example usage - in a Jupyter notebook
from PIL import Image

def pil_to_np(pilimage):
    return np.array(pilimage) / 255

def np_to_pil(image):
    return Image.fromarray((image * 255).astype('uint8'))

# !wget 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/%27David%27_by_Michelangelo_Fir_JBU013.jpg/220px-%27David%27_by_Michelangelo_Fir_JBU013.jpg' -O david-statue.jpg
img_statue = Image.open('david-statue.jpg').convert('L')
img_statue_array = pil_to_np(img_statue)

# eg. ~ 0.5 ms / image via Numba, ~ 770 ms / image plain Pyhton (on an older MacBook)
# %timeit floyd_steinberg(img_statue_array)

display(floyd_steinberg(img_statue_array))