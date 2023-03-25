import cv2
import numpy as np
import sys
img = cv2.imread("42.jpg",0)


height,width = img.shape
if height % 2 != 0:
    height -= 1

if width % 2 != 0:
    width -= 1

if height > width:
    img=np.rot90(img)
    height,width = width,height

k_size = 2
def change(gray,img):
    step = int(255/(k_size*k_size+1))
    k1 = range(0,step)
    k2 = range(step,2*step)
    k3 = range(2*step,3*step)
    k4 = range(3*step,4*step)
    k5 = range(4*step,255+1)
    if gray in k1:
        img[0][0] = 0
        img[0][1] = 0
        img[1][0] = 0
        img[1][1] = 0
    if gray in k2:
        img[0][0] = 0
        img[0][1] = 0
        img[1][0] = 255
        img[1][1] = 0
    if gray in k3:
        img[0][0] = 0
        img[0][1] = 255
        img[1][0] = 255
        img[1][1] = 0
    if gray in k4:
        img[0][0] = 0
        img[0][1] = 255
        img[1][0] = 255
        img[1][1] = 255
    if gray in k5:
        img[0][0] = 255
        img[0][1] = 255
        img[1][0] = 255
        img[1][1] = 255

for h in range(0,height,k_size):
    for w in range(0,width,k_size):
        gray = int(sum([img[h][w],img[h][w+1],img[h+1][w],img[h+1][w+1]])/(k_size*k_size)) # 计算2x2矩阵中灰度平均值
        temp = img[h:h+2,w:w+2] # 取样
        change(gray,temp) # 将取样的矩阵根据其灰度值进行处理

ret,img=cv2.threshold(img,127,255,cv2.THRESH_BINARY)

img = cv2.resize(img,(400,300))
cv2.imwrite("E:\cv_projects\output.jpg", img)
cv2.imshow("title", img)
cv2.waitKey(0)
cv2.destroyAllWindows()

