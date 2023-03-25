from PIL import Image, ImageChops
import numpy as np
from typing import List

# 用户操作区###############################
IMG_PATH = 'E:\cv_projects\\hutao.jpg'
FAN_ZHUAN = 0  # 黑白反转
FLIP_LEFT = 0  # 左右翻转
FLIP_TOP = 0  # 上下翻转
# 图像大小，裁剪前
PIX_H = 300  # 图像高
PIX_W = 400 # 图像宽
# 输出格式
MODE = 'W'  # H/W，纵向扫描/横向扫描
NUM_W = 16  # 每行数据个数
OUT_MODE = 'I' # I/O,单片机数据和tcp数据

if OUT_MODE == 'I':
    filename = 'E:\pio_projects\queedle\include\pic.h'
else :
    filename = 'E:\data.txt'


def Print_C51(C51_list):
    count = 0
    if OUT_MODE == 'I':
        with open(filename, 'w') as file_object:
            file_object.write("const unsigned char gImage_BW[15000] PROGMEM = { \n")
            for i in C51_list:
                file_object.write('0x{:02x},'.format(i))
                count += 1
                if (count % NUM_W == 0):
                    file_object.write('\n')
            file_object.write('};\n')
    else:
        with open(filename, 'w') as file_object:
            for i in C51_list:
                file_object.write('{:02x}'.format(i))
                count += 1



def CkeckBMP(bmp_list, width_t, height_t):
    if MODE == 'W':
        if width_t % 8 != 0:
            width_t = width_t + (8 - width_t % 8)
        ck_array = np.empty(shape=(height_t, width_t), dtype=np.uint8)
        width_t = int(width_t / 8)
        for i in range(0, height_t):
            for k in range(0, width_t):
                for p in range(0, 8):
                    ck_array[i][k * 8 - p] = bmp_list[i * width_t + k] % 2
                    bmp_list[i * width_t + k] /= 2
    ck_img = Image.fromarray(255 * ck_array)
    ck_img.save('E:\cv_projects\\CkeckBMP.bmp')  # 预览
    # ck_img.show()


def ToHex(pp: List[int]):
    temp111 = np.uint8(0);
    for i in range(0, 8, 1):
        temp111 = temp111 << 1
        if i < (len(pp)):
            temp111 += pp[i]
        else:
            temp111 += 1 - FAN_ZHUAN
    # print(temp111)
    return np.uint8(temp111)


# ------------此处开始---------------
# 创建大小缩放图片
img_file = Image.open(IMG_PATH).resize((PIX_W, PIX_H))
print('img_file:', img_file.format, img_file.mode, img_file.size, img_file.palette)
# 创建抖动算法处理后的图
img_L = img_file.convert('1')
img_L = (ImageChops.invert(img_L) if FAN_ZHUAN else img_L)
img_L = (img_L.transpose(Image.FLIP_LEFT_RIGHT) if FLIP_LEFT else img_L)
img_L = (img_L.transpose(Image.FLIP_TOP_BOTTOM) if FLIP_TOP else img_L)

# img_L.save('E:\cv_projects\\huidu.bmp')
# 创建图像转数组
img_array = np.array(img_L)
# 创建%8扩容存储二值化的数组np.empty
height, width = img_array.shape
width_2 = width % 8
width_8 = int(width / 8) + (1 if width_2 != 0 else 0)

# 输出C51格式
out_list = []
if MODE == 'W':
    for i in range(0, height):
        for k in range(0, width_8):
            out_list.append(int(ToHex(img_array[i][k * 8:k * 8 + 8 if k * 8 + 8 < width else width])))


Print_C51(out_list)
CkeckBMP(out_list, width, height)
img_file.close()