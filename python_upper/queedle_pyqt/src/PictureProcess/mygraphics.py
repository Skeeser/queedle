from PyQt5.QtCore import QRectF, Qt, pyqtSignal, QPoint
from PyQt5.QtGui import QColor, QPixmap, QPen
from PyQt5.QtWidgets import QGraphicsView, QGraphicsPixmapItem, QGraphicsScene, QGraphicsItem


# 重写方法
class GraphicsView(QGraphicsView):
    # save_signal = pyqtSignal(bool)

    def __init__(self, parent=None):
        super(GraphicsView, self).__init__(parent)
        self.save_signal = None

    def graphicsview_setting(self, picture_pixmap):
        # 设置放大缩小时跟随鼠标
        self.setTransformationAnchor(QGraphicsView.AnchorUnderMouse)
        self.setResizeAnchor(QGraphicsView.AnchorUnderMouse)

        self.scene = QGraphicsScene()
        self.setScene(self.scene)

        self.image_item = GraphicsPixmapItem(picture_pixmap)
        self.image_item.setFlag(QGraphicsItem.ItemIsMovable) # 让对象可以移动
        self.scene.addItem(self.image_item)
        self.setScene(self.scene)

    def wheelEvent(self, event):
        '''滚轮事件'''
        zoomInFactor = 1.25
        zoomOutFactor = 1 / zoomInFactor

        if event.angleDelta().y() > 0:
            zoomFactor = zoomInFactor
        else:
            zoomFactor = zoomOutFactor

        self.scale(zoomFactor, zoomFactor)

    def mouseReleaseEvent(self, event):
        '''鼠标释放事件'''
        # print(self.image_item.is_finish_cut, self.image_item.is_start_cut)
        if self.image_item.is_finish_cut:
            self.save_signal = True
        else:
            self.save_signal = False


class GraphicsPixmapItem(QGraphicsPixmapItem):
    # save_signal = pyqtSignal(bool)

    def __init__(self, picture, parent=None):
        super(GraphicsPixmapItem, self).__init__(parent)

        self.setPixmap(picture)
        self.is_start_cut = False
        self.current_point = None
        self.is_finish_cut = False

    def mouseMoveEvent(self, event):
        '''鼠标移动事件'''
        self.current_point = event.pos()
        if not self.is_start_cut or self.is_midbutton:
            self.moveBy(self.current_point.x() - self.start_point.x(),
                        self.current_point.y() - self.start_point.y())
            self.is_finish_cut = False
        self.update()

    def mousePressEvent(self, event):
        '''鼠标按压事件'''
        super(GraphicsPixmapItem, self).mousePressEvent(event)
        self.start_point = event.pos()
        self.current_point = None
        self.is_finish_cut = False
        if event.button() == Qt.MidButton:
            self.is_midbutton = True
            self.update()
        else:
            self.is_midbutton = False
            self.update()

    def paint_in43(self,start, current):
        mouse_width = current.x() - start.x()
        mouse_height = current.y() - start.y()
        imgProportion = 3 / 4 if mouse_width > mouse_height else 4 / 3  # 高比宽
        if mouse_width * imgProportion < mouse_height:
           paint_height = mouse_height
           paint_width = paint_height / imgProportion
        else:
            paint_width = mouse_width
            paint_height = paint_width * imgProportion
        end_point = QPoint(int(start.x() + paint_width) , int(start.y() + paint_height))
        return end_point

    def paint(self, painter, QStyleOptionGraphicsItem, QWidget):
        super(GraphicsPixmapItem, self).paint(painter, QStyleOptionGraphicsItem, QWidget)
        if self.is_start_cut and not self.is_midbutton:
            # print(self.start_point, self.current_point)
            pen = QPen(Qt.DashLine)
            pen.setColor(QColor(0, 150, 0, 70))
            pen.setWidth(3)
            painter.setPen(pen)
            painter.setBrush(QColor(0, 0, 255, 70))
            if not self.current_point:
                return
            self.end_point = self.paint_in43(self.start_point, self.current_point)
            painter.drawRect(QRectF(self.start_point, self.end_point))
            # self.end_point = self.current_point
            self.is_finish_cut = True