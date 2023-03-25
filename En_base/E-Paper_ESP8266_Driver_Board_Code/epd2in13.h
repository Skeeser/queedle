/**
  ******************************************************************************
  * @file    edp2in13.h
  * @author  Waveshare Team
  * @version V1.0.0
  * @date    23-January-2018
  * @brief   This file describes initialisation of e-Papers:
  *              2.13 and 2.13_V3,
  *              2.13b and 2.13c,
  *              2.13d.
  *
  ******************************************************************************
  */

unsigned char lut_full_2in13[] = {
    0x22, 0x55, 0xAA, 0x55, 0xAA, 0x55, 0xAA, 0x11,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x1E, 0x1E, 0x1E, 0x1E, 0x1E, 0x1E, 0x1E, 0x1E,
    0x01, 0x00, 0x00, 0x00, 0x00, 0x00
};
const unsigned char lut_full_2in3v2[] = {
    0x80,0x60,0x40,0x00,0x00,0x00,0x00,             //LUT0: BB:     VS 0 ~7
    0x10,0x60,0x20,0x00,0x00,0x00,0x00,             //LUT1: BW:     VS 0 ~7
    0x80,0x60,0x40,0x00,0x00,0x00,0x00,             //LUT2: WB:     VS 0 ~7
    0x10,0x60,0x20,0x00,0x00,0x00,0x00,             //LUT3: WW:     VS 0 ~7
    0x00,0x00,0x00,0x00,0x00,0x00,0x00,             //LUT4: VCOM:   VS 0 ~7

    0x03,0x03,0x00,0x00,0x02,                       // TP0 A~D RP0
    0x09,0x09,0x00,0x00,0x02,                       // TP1 A~D RP1
    0x03,0x03,0x00,0x00,0x02,                       // TP2 A~D RP2
    0x00,0x00,0x00,0x00,0x00,                       // TP3 A~D RP3
    0x00,0x00,0x00,0x00,0x00,                       // TP4 A~D RP4
    0x00,0x00,0x00,0x00,0x00,                       // TP5 A~D RP5
    0x00,0x00,0x00,0x00,0x00,                       // TP6 A~D RP6

    0x15,0x41,0xA8,0x32,0x30,0x0A,
};

const unsigned char WS_20_30_2IN13_V3[159] ={											
	0x80, 0x4A,	0x40, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0,
	0x40, 0x4A,	0x80, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0,
	0x80, 0x4A,	0x40, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0,
	0x40, 0x4A,	0x80, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0,
	0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0,
	0xF, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0,					
	0xF, 0x0, 0x0, 0xF, 0x0, 0x0, 0x2,					
	0xF, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0,					
	0x1, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0,					
	0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0,					
	0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0,					
	0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0,					
	0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0,					
	0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0,					
	0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0,					
	0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0,					
	0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0,					
	0x22, 0x22, 0x22, 0x22,	0x22, 0x22, 0x0, 0x0, 0x0,			
	0x22, 0x17, 0x41, 0x0, 0x32, 0x36						
};

const unsigned char lut_vcomDC_2in13d[] = {
    0x00, 0x08, 0x00, 0x00, 0x00, 0x02, 0x60, 0x28, 0x28, 0x00, 0x00,
    0x01, 0x00, 0x14, 0x00, 0x00, 0x00, 0x01, 0x00, 0x12, 0x12, 0x00,
    0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
};

const unsigned char lut_ww_2in13d[] = {
    0x40, 0x08, 0x00, 0x00, 0x00, 0x02, 0x90, 0x28, 0x28, 0x00, 0x00, 0x01, 0x40, 0x14,
    0x00, 0x00, 0x00, 0x01, 0xA0, 0x12, 0x12, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
};

const unsigned char lut_bw_2in13d[] = {
    0x40, 0x17, 0x00, 0x00, 0x00, 0x02, 0x90, 0x0F, 0x0F, 0x00, 0x00, 0x03, 0x40, 0x0A,
    0x01, 0x00, 0x00, 0x01, 0xA0, 0x0E, 0x0E, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
};

const unsigned char lut_wb_2in13d[] = {
    0x80, 0x08, 0x00, 0x00, 0x00, 0x02, 0x90, 0x28, 0x28, 0x00, 0x00, 0x01, 0x80, 0x14,
    0x00, 0x00, 0x00, 0x01, 0x50, 0x12, 0x12, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
};

const unsigned char lut_bb_2in13d[] = {
    0x80, 0x08, 0x00, 0x00, 0x00, 0x02, 0x90, 0x28, 0x28, 0x00, 0x00, 0x01, 0x80, 0x14,
    0x00, 0x00, 0x00, 0x01, 0x50, 0x12, 0x12, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
};


int EPD_Init_2in13()
{
  int EPD2in13V = 2;
    if(EPD2in13V == 1) {
        Serial.print("\r\nEPD_Init_2in13 V1");
        EPD_Reset();
        EPD_Send_3(0x01, 249, 0, 0);       // DRIVER_OUTPUT_CONTROL: LO(h-1), HI(h-1), GD = 0; SM = 0; TB = 0;
        EPD_Send_3(0x0C, 0xD7, 0xD6, 0x9D);// BOOSTER_SOFT_START_CONTROL
        EPD_Send_1(0x2C, 0xA8);            // WRITE_VCOM_REGISTER: VCOM 7C
        EPD_Send_1(0x3A, 0x1A);            // SET_DUMMY_LINE_PERIOD: 4 dummy lines per gate
        EPD_Send_1(0x3B, 0x08);            // SET_GATE_TIME: 2us per line
        EPD_Send_1(0x11, 0x03);            // DATA_ENTRY_MODE_SETTING: X increment; Y increment

        EPD_lut(0x32, 30, &lut_full_2in13[0]);
        return 0;
    } else {
        Serial.print("\r\nEPD_Init_2in13 V2");
        EPD_Reset();
        while (digitalRead(BUSY_PIN) == 1) delay(100);
        EPD_SendCommand(0x12);
        while (digitalRead(BUSY_PIN) == 1) delay(100);
        EPD_Send_1(0x74, 0x54);
        EPD_Send_1(0x7e, 0x3B);
        EPD_Send_3(0x01, 0XF9, 0X00, 0X00);
        EPD_Send_1(0X11, 0X01);
        EPD_Send_2(0X44, 0X00, 0X0F);
        EPD_Send_4(0x45, 0xF9, 0x00, 0x00, 0x00);
        EPD_Send_1(0X3C, 0X03);
        EPD_Send_1(0X2C, 0X55);
        EPD_Send_1(0x03, lut_full_2in3v2[70]);
        EPD_Send_3(0x04, lut_full_2in3v2[71], lut_full_2in3v2[72], lut_full_2in3v2[73]);
        EPD_Send_1(0x3A, lut_full_2in3v2[74]);
        EPD_Send_1(0x3B, lut_full_2in3v2[75]);
        char count;
        EPD_SendCommand(0x32);
        for(count = 0; count < 70; count++)
            EPD_SendData(lut_full_2in3v2[count]);
        EPD_Send_1(0x4E, 0x00);
        EPD_Send_2(0x4F, 0xF9, 0x00);

		int Width, Height;
		Width = (122 % 8 == 0)? (122 / 8 ): (122 / 8 + 1);
		Height = 250;
		EPD_SendCommand(0x24);
		for (int j = 0; j < Height; j++) {
			for (int i = 0; i < Width; i++) {
				EPD_SendData(0XFF);
			}
		}
		EPD_SendCommand(0x22);
		EPD_SendData(0xC7);
		EPD_SendCommand(0x20);
		while (digitalRead(BUSY_PIN) == 1) delay(100);
        
        return 0;
    }
}

int EPD_Init_2in13_V3()
{
	Serial.print("\r\nEPD_Init_2in13 V3");
	EPD_Reset();
	delay(100);
	while (digitalRead(BUSY_PIN) == 1) delay(10);
	EPD_SendCommand(0x12);
	while (digitalRead(BUSY_PIN) == 1) delay(10);
	EPD_Send_3(0x01, 0XF9, 0X00, 0X00);
	EPD_Send_1(0X11, 0X03);
	EPD_Send_2(0X44, 0X00, 0X0F);
	EPD_Send_4(0x45, 0x00, 0x00, 0x00, 0xF9);
	EPD_Send_1(0x4E, 0x00);
	EPD_Send_2(0x4F, 0X00, 0X00);
	EPD_Send_1(0x3C, 0x05);
	EPD_Send_2(0x21, 0x00, 0x80);
	EPD_Send_1(0x18, 0x80);
	
	while (digitalRead(BUSY_PIN) == 1) delay(100);
	int count;
	EPD_SendCommand(0x32);
	for(count = 0; count < 153; count++)
		EPD_SendData(WS_20_30_2IN13_V3[count]);
	EPD_Send_1(0x3f, WS_20_30_2IN13_V3[153]);
	EPD_Send_1(0x03, WS_20_30_2IN13_V3[154]);
	EPD_Send_3(0x04, WS_20_30_2IN13_V3[155], WS_20_30_2IN13_V3[156], WS_20_30_2IN13_V3[157]);
	EPD_Send_1(0x2C, WS_20_30_2IN13_V3[158]);
	
	int Width, Height;
	Width = (122 % 8 == 0)? (122 / 8 ): (122 / 8 + 1);
	Height = 250;
	EPD_SendCommand(0x24);
	for (int j = 0; j < Height; j++) {
		for (int i = 0; i < Width; i++) {
			EPD_SendData(0XFF);
		}
	}
	
	EPD_SendCommand(0x22);
	EPD_SendData(0xC7);
	EPD_SendCommand(0x20);
	while (digitalRead(BUSY_PIN) == 1) delay(10);
	return 0;
}

/* Show image and turn to deep sleep mode ------*/
void EPD_2IN13_V3_Show()
{
    Serial.print("\r\n EPD_2IN13_V3_Show");
    // Refresh
    EPD_Send_1(0x22, 0xC7); //DISPLAY_UPDATE_CONTROL_2
    EPD_SendCommand(0x20);  //MASTER_ACTIVATION
	while (digitalRead(BUSY_PIN) == 1) delay(10);

    // Sleep
    EPD_Send_1(0x10, 0x01); //DEEP_SLEEP_MODE
    EPD_WaitUntilIdle();
}

int EPD_Init_2in13b()
{
    EPD_Reset();
    EPD_Send_3(0x06, 0x17, 0x17, 0x17);// BOOSTER_SOFT_START
    EPD_SendCommand(0x04);             // POWER_ON
    EPD_WaitUntilIdle();

    EPD_Send_1(0x00, 0x8F);            // PANEL_SETTING
    EPD_Send_1(0x50, 0x37);            // VCOM_AND_DATA_INTERVAL_SETTING
    EPD_Send_3(0x61, 0x68, 0, 0xD4);   // TCON_RESOLUTION

    EPD_SendCommand(0x10);             // DATA_START_TRANSMISSION_1
    delay(2);
    return 0;
}

int EPD_2IN13B_V3_Init(void)
{
    EPD_Reset();
    delay(10);
    
    EPD_SendCommand(0x04);  
    EPD_WaitUntilIdle();//waiting for the electronic paper IC to release the idle signal

    EPD_Send_2(0x00, 0x0f, 0x89);//panel setting

    EPD_Send_3(0x61, 0x68, 0x00, 0xd4);//resolution setting

    EPD_Send_1(0X50, 0x77);//VCOM AND DATA INTERVAL SETTING

    EPD_SendCommand(0x10);             // DATA_START_TRANSMISSION_1
    delay(2);
    return 0;
}

void EPD_2IN13B_V3_Show()
{
    EPD_SendCommand(0x12);		 //DISPLAY REFRESH
    delay(2);
    EPD_WaitUntilIdle();
	
	EPD_Send_1(0X50, 0xf7);
    EPD_SendCommand(0X02); //power off
    EPD_WaitUntilIdle();          //waiting for the electronic paper IC to release the idle signal
    EPD_Send_1(0X07, 0xa5); //deep sleep
}

int EPD_2IN13B_V4_Init(void)
{
	EPD_Reset();
	delay(10);

	EPD_WaitUntilIdle_high();   
	EPD_SendCommand(0x12);  //SWRESET
	EPD_WaitUntilIdle_high();   

	EPD_Send_3(0x01, 0xf9, 0x00, 0x00); //Driver output control      

	EPD_Send_1(0x11, 0x03); //data entry mode       

	EPD_Send_2(0X44, 0X00, 0X0F);
	EPD_Send_4(0x45, 0x00, 0x00, 0x00, 0xF9);
	EPD_Send_1(0x4E, 0x00);
	EPD_Send_2(0x4F, 0X00, 0X00);

	EPD_Send_1(0x3C, 0x05); //BorderWavefrom
	EPD_Send_1(0x18, 0x80); //Read built-in temperature sensor
	EPD_Send_2(0x21, 0x80, 0x80); //  Display update control

	EPD_WaitUntilIdle_high();
	
	EPD_SendCommand(0x24);
	
	return 0;
}

void EPD_2IN13B_V4_Show()
{
    EPD_SendCommand(0x20);		 //DISPLAY REFRESH
    delay(2);
    EPD_WaitUntilIdle_high();
	
	EPD_Send_1(0X10, 0x01);
}

int EPD_Init_2in13d()
{
    EPD_Reset();

    EPD_Send_5(0x01, 0x03, 0x00, 0x2b, 0x2b, 0x03);//POWER SETTING
    EPD_Send_3(0x06, 0x17, 0x17, 0x17);            //BOOSTER_SOFT_START
    EPD_SendCommand(0x04);                         //POWER_ON
    EPD_WaitUntilIdle();
    EPD_Send_2(0x00, 0xbf, 0x0d);                  //PANEL_SETTINGS: LUT from OTP£¬128x296
    EPD_Send_1(0x30, 0x3a);                        //PLL_SETTINGS: 3a 100HZ, 29 150Hz, 39 200HZ, 31 171HZ, 3c 50hz
    EPD_Send_3(0x61, 0x68, 0x00, 0xD4);            //TCON_RESOLUTION
    EPD_Send_1(0x82, 0x28);                        //VCOM_DC_SETTINGS

    EPD_SendCommand(0x10);
    for (int j = 0; j < 212; j++) for (int i = 0; i < 13; i++) EPD_SendData(0);
    delay(10);

    EPD_SendCommand(0x13);
    return 0;
}
