import cv2
import numpy as np
import sys

img = cv2.imread("42.jpg",0)

def compare(pixel, mid):
    if pixel > mid:
        pixel = 255
    else:
        pixel = 0
    return pixel

height,width = img.shape
# if height % 2 != 0:
#     height -= 1
#
# if width % 2 != 0:
#     width -= 1
print(height,width)

if height > width:
    img=np.rot90(img)
    height,width = width,height

# Floyd-Steinberg 抖动算法-基于错误扩散 基本计算方式
# for each y from top to bottom
#    for each x from left to right
#       oldpixel  := pixel[x][y]
#       newpixel  := find_closest_palette_color(oldpixel)
#       pixel[x][y]  := newpixel
#       quant_error  := oldpixel - newpixel
#       pixel[x+1][y  ] := pixel[x+1][y  ] + quant_error * 7/16
#       pixel[x-1][y+1] := pixel[x-1][y+1] + quant_error * 3/16
#       pixel[x  ][y+1] := pixel[x  ][y+1] + quant_error * 5/16
#       pixel[x+1][y+1] := pixel[x+1][y+1] + quant_error * 1/16

for y in range(height):
    for x in range(width):
        old = img[y, x]
        new = np.round(old)
        img[y, x] = new
        error = old - new
        # precomputing the constants helps
        if x + 1 < width:
            img[y, x + 1] += error * 0.4375 # right, 7 / 16
        if (y + 1 < height) and (x + 1 < width):
            img[y + 1, x + 1] += error * 0.0625 # right, down, 1 / 16
        if y + 1 < height:
            img[y + 1, x] += error * 0.3125 # down, 5 / 16
        if (x - 1 >= 0) and (y + 1 < height):
            img[y + 1, x - 1] += error * 0.1875 # left, down, 3 / 16

# for h in range(1, height-1):
#     for w in range(1, width-1):
#         # 算法实现
#         oldpixel = img[h][w]
#         newpixel = compare(oldpixel, 127)
#         img[h][w] = newpixel
#         quant_error = oldpixel - newpixel
#         img[h][w+1] = img[h][w+1] + quant_error * 7 / 16
#         img[h+1][w-1] = img[h+1][w-1] + quant_error * 3 / 16
#         img[h+1][w]= img[h+1][w] + quant_error * 5 / 16
#         img[h+1][w+1] = img[h+1][w+1] + quant_error * 1 / 16


ret,img=cv2.threshold(img,127,255,cv2.THRESH_BINARY)


img = cv2.resize(img,(400,300))
cv2.imwrite("E:\cv_projects\output2.bmp", img)
cv2.imshow("title", img)
cv2.waitKey(0)
cv2.destroyAllWindows()

