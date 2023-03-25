#include "stm32f10x.h"
#include "delay.h"
#include "sys.h"
//EPD
#include "Display_EPD_W21_spi.h"
#include "Display_EPD_W21.h"
#include "Ap_29demo.h"	
//GUI
#include "GUI_Paint.h"
#include "fonts.h"

unsigned char BlackImage[4000];//Define canvas space  
////////Partial refresh schematic////////////////

				 ////////////////Y///(0,0)          /   #  ->(x,y)
				 //		              /               / #   # 
///-FPC--/		              /x              /   #
///------/			            /	              / #   # 
				 //	                /               /   #
				 ////////////////////		  
//Tips//
/*
1.When the e-paper is refreshed in full screen, the picture flicker is a normal phenomenon, and the main function is to clear the display afterimage in the previous picture.
2.When the partial refresh is performed, the screen does not flash.
3.After the e-paper is refreshed, you need to put it into sleep mode, please do not delete the sleep command.
4.Please do not take out the electronic paper when power is on.
5.Wake up from sleep, need to re-initialize the e-paper.
6.When you need to transplant the driver, you only need to change the corresponding IO. The BUSY pin is the input mode and the others are the output mode.
*/
int	main(void)
{
	unsigned char fen_L,fen_H,miao_L,miao_H;
		delay_init();	    	     //Delay function initialization
		NVIC_Configuration(); 	//Set NVIC interrupt grouping 2
    EPD_GPIO_Init();       //EPD GPIO  initialization
	while(1)
	{
  ///////////////////////////Normal picture display/////////////////////////////////////////////////////////////////
		/************Normal picture display*******************/
    EPD_HW_Init(); //EPD init
	  EPD_WhiteScreen_ALL(gImage_1);//EPD_picture1
		EPD_DeepSleep();//EPD_DeepSleep,Sleep instruction is necessary, please do not delete!!!
		delay_s(2); //2s	
		
		//Clear
		EPD_HW_Init(); //EPD init
	  EPD_WhiteScreen_White();//EPD Clear
		EPD_DeepSleep();//EPD_DeepSleep,Sleep instruction is necessary, please do not delete!!!
		delay_s(2); //2s	
		
		
//////////////////////Partial refresh time demo/////////////////////////////////////
    EPD_HW_Init(); //Electronic paper initialization	
	  EPD_SetRAMValue_BaseMap(gImage_basemap); //Partial refresh background color  		
		for(fen_H=0;fen_H<6;fen_H++)
		{
		for(fen_L=0;fen_L<10;fen_L++)
		{
		for(miao_H=0;miao_H<6;miao_H++) 	
		{
		for(miao_L=0;miao_L<10;miao_L++)
		{
				EPD_Dis_Part_myself(16,60,(unsigned char *)&Num[miao_L],         //x-A,y-A,DATA-A
														16,92,(unsigned char *)&Num[miao_H],         //x-B,y-B,DATA-B
														16,132,(unsigned char *)gImage_numdot,       //x-C,y-C,DATA-C
														16,174,(unsigned char *)&Num[fen_L],         //x-D,y-D,DATA-D
														16,206,(unsigned char *)&Num[fen_H],32,64);	 //x-E,y-E,DATA-E,Resolution 32*64
														
														if((fen_L==0)&&(miao_H==0)&&(miao_L==9))
														goto Clear;
			}
		}
		}
		
		}
		
////////////////////////////////////////////////////////////////////////	
			//Clear screen
		Clear:
		EPD_HW_Init(); //Electronic paper initialization
		EPD_WhiteScreen_White(); //Show all white
		EPD_DeepSleep(); //Enter deep sleep,Sleep instruction is necessary, please do not delete!!!
    delay_s(2); //2s	
		
		
		
		
  ///////////////////////////GUI///////////////////////////////////////////////////////////////////////////////////
   //Data initialization settings
    Paint_NewImage(BlackImage, EPD_WIDTH, EPD_HEIGHT, 270, WHITE); //Set screen size and display orientation
    Paint_SelectImage(BlackImage);//Set the virtual canvas data storage location

    /**************Drawing**********************/
		EPD_HW_Init_GUI(); //EPD init GUI
		Paint_Clear(WHITE);
		//Point   
    Paint_DrawPoint(5, 10, BLACK, DOT_PIXEL_1X1, DOT_STYLE_DFT);
    Paint_DrawPoint(5, 25, BLACK, DOT_PIXEL_2X2, DOT_STYLE_DFT);
    Paint_DrawPoint(5, 40, BLACK, DOT_PIXEL_3X3, DOT_STYLE_DFT);
    Paint_DrawPoint(5, 55, BLACK, DOT_PIXEL_4X4, DOT_STYLE_DFT);
		//Line
    Paint_DrawLine(20, 10, 70, 60, BLACK, LINE_STYLE_SOLID, DOT_PIXEL_1X1);
    Paint_DrawLine(70, 10, 20, 60, BLACK, LINE_STYLE_SOLID, DOT_PIXEL_1X1);
		//Rectangle
    Paint_DrawRectangle(20, 10, 70, 60, BLACK, DRAW_FILL_EMPTY, DOT_PIXEL_1X1);
    Paint_DrawRectangle(85, 10, 130, 60, BLACK, DRAW_FILL_FULL, DOT_PIXEL_1X1);
    //Circle
		Paint_DrawCircle(150, 90, 30, BLACK, DRAW_FILL_EMPTY, DOT_PIXEL_1X1);
    Paint_DrawCircle(200, 90, 30, BLACK, DRAW_FILL_FULL, DOT_PIXEL_1X1);
    EPD_Display(BlackImage);//display image
		EPD_DeepSleep();//EPD_DeepSleep,Sleep instruction is necessary, please do not delete!!!
    delay_s(2); //2s		
		
    /***********String***************************/ 
		EPD_HW_Init_GUI(); //EPD init GUI
		Paint_Clear(WHITE);
    Paint_DrawString_EN(0, 0, "Good Display", &Font8, WHITE, BLACK);  //5*8
		Paint_DrawString_EN(0, 10, "Good Display", &Font12, WHITE, BLACK); //7*12
		Paint_DrawString_EN(0, 25, "Good Display", &Font16, WHITE, BLACK); //11*16
		Paint_DrawString_EN(0, 45, "Good Display", &Font20, WHITE, BLACK); //14*20
		Paint_DrawString_EN(0, 80, "Good Display", &Font24, WHITE, BLACK); //17*24
    EPD_Display(BlackImage); //display image
		EPD_DeepSleep();//EPD_DeepSleep,Sleep instruction is necessary, please do not delete!!!
    delay_s(2); //2s		
		/*************Number************************/
		EPD_HW_Init_GUI(); //EPD init GUI
		Paint_Clear(WHITE);
    Paint_DrawNum(0, 0, 123456789, &Font8, WHITE, BLACK);  //5*8
		Paint_DrawNum(0, 10, 123456789, &Font12, WHITE, BLACK); //7*12
		Paint_DrawNum(0, 25, 123456789, &Font16, WHITE, BLACK); //11*16
		Paint_DrawNum(0, 45, 123456789, &Font20, WHITE, BLACK); //14*20
		Paint_DrawNum(0, 70, 123456789, &Font24, WHITE, BLACK); //17*24
    EPD_Display(BlackImage); //display image
		EPD_DeepSleep();//EPD_DeepSleep,Sleep instruction is necessary, please do not delete!!!
    delay_s(2); //2s	 			
		
			//Clear screen
		EPD_HW_Init(); //Electronic paper initialization
		EPD_WhiteScreen_White(); //Show all white
		EPD_DeepSleep(); //Enter deep sleep,Sleep instruction is necessary, please do not delete!!!
    delay_s(2); //2s			
			

	}
}	


