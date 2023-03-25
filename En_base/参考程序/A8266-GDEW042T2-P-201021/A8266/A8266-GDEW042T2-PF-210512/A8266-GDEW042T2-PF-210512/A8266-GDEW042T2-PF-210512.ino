#include"Ap_29demo.h"
//IO settings
int BUSY_Pin = 5; 
int RES_Pin = 2; 
int DC_Pin = 4; 
int CS_Pin = 15; 
int SCK_Pin = 14; 
int SDI_Pin = 13;

#define EPD_W21_MOSI_0  digitalWrite(SDI_Pin,LOW)
#define EPD_W21_MOSI_1  digitalWrite(SDI_Pin,HIGH) 

#define EPD_W21_CLK_0 digitalWrite(SCK_Pin,LOW)
#define EPD_W21_CLK_1 digitalWrite(SCK_Pin,HIGH)

#define EPD_W21_CS_0 digitalWrite(CS_Pin,LOW)
#define EPD_W21_CS_1 digitalWrite(CS_Pin,HIGH) 

#define EPD_W21_DC_0  digitalWrite(DC_Pin,LOW)
#define EPD_W21_DC_1  digitalWrite(DC_Pin,HIGH)

#define EPD_W21_RST_0 digitalWrite(RES_Pin,LOW)
#define EPD_W21_RST_1 digitalWrite(RES_Pin,HIGH)
#define isEPD_W21_BUSY digitalRead(BUSY_Pin)
////////FUNCTION//////
void driver_delay_us(unsigned int xus);
void driver_delay(unsigned long xms);
void DELAY_S(unsigned int delaytime);     
void SPI_Delay(unsigned char xrate);
void SPI_Write(unsigned char value);
void EPD_W21_WriteDATA(unsigned char command);
void EPD_W21_WriteCMD(unsigned char command);
//EPD
void EPD_init(void);
void PIC_display(const unsigned char* picData_old,const unsigned char* picData_new);
void EPD_sleep(void);
void EPD_refresh(void);
void lcd_chkstatus(void);
void PIC_display_Clean(void);
void EPD_partial_display_Full(u16 x_start,u16 y_start,const unsigned char *new_data,unsigned int PART_COLUMN,unsigned int PART_LINE,unsigned char mode); //partial display 
//LUT
void EPD_init_data(void);


void Sys_run(void)
{
   ESP.wdtFeed(); //Feed dog to prevent system reset
  }

void LED_run(void)
{
  digitalWrite(LED_BUILTIN, LOW);   // Turn the LED on (Note that LOW is the voltage level
  delay(500);
  digitalWrite(LED_BUILTIN, HIGH);   // Turn the LED on (Note that LOW is the voltage level
  delay(500);
  }
void setup() {
  
   pinMode(BUSY_Pin, INPUT); 
   pinMode(RES_Pin, OUTPUT);  
   pinMode(DC_Pin, OUTPUT);    
   pinMode(CS_Pin, OUTPUT);    
   pinMode(SCK_Pin, OUTPUT);    
   pinMode(SDI_Pin, OUTPUT);    

   pinMode(LED_BUILTIN, OUTPUT); //ESP8266 Status light 
   ESP.wdtDisable();//Turn off the software watchdog
  
}
//Tips//
/*
1.When the e-paper is refreshed in full screen, the picture flicker is a normal phenomenon, and the main function is to clear the display afterimage in the previous picture.
2.When the partial refresh is performed, the screen does not flash.
3.After the e-paper is refreshed, you need to put it into sleep mode, please do not delete the sleep command.
4.Please do not take out the electronic paper when power is on.
5.Wake up from sleep, need to re-initialize the e-paper.
6.When you need to transplant the driver, you only need to change the corresponding IO. The BUSY pin is the input mode and the others are the output mode.
*/
//Special Note//
/*
After 5 full brushes of DES products, you need to refresh the all white screen once to reduce the accumulation of residual images.
The full brushing time interval is 180 seconds.
*/
void loop() {
  ///////////////////////////Normal picture display/////////////////////////////////////////////////////////////////
      //Partial _Full screen refresh
    //Partial _Full screen refresh
    //EPD_Clean
    EPD_init(); //EPD init
    PIC_display_Clean();//EPD_Clean
    EPD_sleep();//EPD_sleep,Sleep instruction is necessary, please do not delete!!!

    EPD_partial_display_Full(0,0,gImage_num[0],32,32,0);  //x,y,old_data,new_data,W,L,mode 
    EPD_partial_display_Full(0,32,gImage_num[1],32,32,0);  //x,y,old_data,new_data,W,L,mode     
    EPD_partial_display_Full(0,64,gImage_num[2],32,32,0);  //x,y,old_data,new_data,W,L,mode   
    EPD_partial_display_Full(0,96,gImage_num[3],32,32,0);  //x,y,old_data,new_data,W,L,mode 
    EPD_sleep();//EPD_sleep,Sleep instruction is necessary, please do not delete!!!

    EPD_partial_display_Full(0,0,gImage_num[0],32,32,1);  //x,y,old_data,new_data,W,L,mode 
    EPD_partial_display_Full(0,32,gImage_num[1],32,32,1);  //x,y,old_data,new_data,W,L,mode     
    EPD_partial_display_Full(0,64,gImage_num[2],32,32,1);  //x,y,old_data,new_data,W,L,mode   
    EPD_partial_display_Full(0,96,gImage_num[3],32,32,1);  //x,y,old_data,new_data,W,L,mode 
    EPD_sleep();//EPD_sleep,Sleep instruction is necessary, please do not delete!!!


    //EPD_Clean
    EPD_init(); //EPD init
    PIC_display_Clean();//EPD_Clean
    EPD_sleep();//EPD_sleep,Sleep instruction is necessary, please do not delete!!!
    delay(2000); //2s   
  while(1) 
  {
   Sys_run();//System run
   LED_run();//Breathing lamp
  }
}




//////////////////////SPI///////////////////////////////////

void SPI_Write(unsigned char value)                                    
{                                                           
    unsigned char i;  
    for(i=0; i<8; i++)   
    {
        EPD_W21_CLK_0;
       if(value & 0x80)
          EPD_W21_MOSI_1;
        else
          EPD_W21_MOSI_0;   
        value = (value << 1); 
        EPD_W21_CLK_1; 
    }
}

void EPD_W21_WriteCMD(unsigned char command)
{
  EPD_W21_CS_0;                   
  EPD_W21_DC_0;   // command write
  SPI_Write(command);
  EPD_W21_CS_1;
}
void EPD_W21_WriteDATA(unsigned char command)
{
  EPD_W21_CS_0;                   
  EPD_W21_DC_1;   // command write
  SPI_Write(command);
  EPD_W21_CS_1;
}



/////////////////EPD settings Functions/////////////////////
void EPD_W21_Init(void)
{
  EPD_W21_RST_0;    // Module reset
  delay(10);//At least 10ms delay 
  EPD_W21_RST_1;
  delay(10);//At least 10ms delay 

  EPD_W21_RST_0;    // Module reset
  delay(10);//At least 10ms delay 
  EPD_W21_RST_1;
  delay(10);//At least 10ms delay 

  EPD_W21_RST_0;    // Module reset
  delay(10);//At least 10ms delay 
  EPD_W21_RST_1;
  delay(10);//At least 10ms delay 
  
  
}
//UC8151D
void EPD_init(void)
{  
    EPD_W21_Init(); //Electronic paper IC reset
    
    EPD_W21_WriteCMD(0x04);  
    lcd_chkstatus();//waiting for the electronic paper IC to release the idle signal

    EPD_W21_WriteCMD(0x00);     //panel setting
    EPD_W21_WriteDATA(0x1f);    //LUT from OTP£¬KW-BF   KWR-AF  BWROTP 0f BWOTP 1f
    
    EPD_W21_WriteCMD(0X50);     //VCOM AND DATA INTERVAL SETTING      
    EPD_W21_WriteDATA(0x97);    //WBmode:VBDF 17|D7 VBDW 97 VBDB 57   WBRmode:VBDF F7 VBDW 77 VBDB 37  VBDR B7
}
void EPD_init_data(void)
{  
    EPD_W21_WriteCMD(0x04);  
    lcd_chkstatus();

    EPD_W21_WriteCMD(0x00);     //panel setting
    EPD_W21_WriteDATA(0x1f);    //LUT from OTP£¬128x296

    EPD_W21_WriteCMD(0X50);     //VCOM AND DATA INTERVAL SETTING      
    EPD_W21_WriteDATA(0x97);    //WBmode:VBDF 17|D7 VBDW 97 VBDB 57   WBRmode:VBDF F7 VBDW 77 VBDB 37  VBDR B7
}

void EPD_refresh(void)
{
    EPD_W21_WriteCMD(0x12);     //DISPLAY REFRESH   
    delay(10);          //!!!The delay here is necessary, 200uS at least!!!     
    lcd_chkstatus();
} 
void EPD_sleep(void)
{
    EPD_W21_WriteCMD(0X50);
    EPD_W21_WriteDATA(0xf7);  
    EPD_W21_WriteCMD(0X02);   //power off
    lcd_chkstatus();
    EPD_W21_WriteCMD(0X07);   //deep sleep
    EPD_W21_WriteDATA(0xA5); 
}


void PIC_display(const unsigned char* picData_old,const unsigned char* picData_new)
{
    unsigned int i;
    EPD_W21_WriteCMD(0x10);        //Transfer old data
    for(i=0;i<15000;i++)      
  {
    EPD_W21_WriteDATA(pgm_read_byte(&picData_old[i]));
  }
    EPD_W21_WriteCMD(0x13);        //Transfer new data
    for(i=0;i<15000;i++)      
  {
    EPD_W21_WriteDATA(pgm_read_byte(&picData_new[i]));
  }
  
       //Refresh
    EPD_W21_WriteCMD(0x12);   //DISPLAY REFRESH   
    delay(1);   //!!!The delay here is necessary, 200uS at least!!!     
    lcd_chkstatus();          //waiting for the electronic paper IC to release the idle signal

}

void PIC_display_Clean(void)
{
    unsigned int i;
    EPD_W21_WriteCMD(0x10);        //Transfer old data
    for(i=0;i<15000;i++)       
  {
    EPD_W21_WriteDATA(0xff);
  }
  
    EPD_W21_WriteCMD(0x13);        //Transfer new data
    for(i=0;i<15000;i++)       
  {
    EPD_W21_WriteDATA(0xff);
  }

     //Refresh
    EPD_W21_WriteCMD(0x12);   //DISPLAY REFRESH   
    delay(1);   //!!!The delay here is necessary, 200uS at least!!!     
    lcd_chkstatus();          //waiting for the electronic paper IC to release the idle signal
}
void lcd_chkstatus(void)
{
    EPD_W21_WriteCMD(0x71);
  while(!isEPD_W21_BUSY)//0 is busy
  {
    ESP.wdtFeed(); //Feed dog to prevent system reset
    }                      
}
void EPD_partial_display_Full(u16 x_start,u16 y_start,const unsigned char *new_data,unsigned int PART_COLUMN,unsigned int PART_LINE,unsigned char mode) //partial display 
{
  unsigned int i,count;  
  unsigned int x_end,y_start1,y_start2,y_end1,y_end2;
  x_start=x_start;
  x_end=x_start+PART_LINE-1; 
  
  y_start1=0;
  y_start2=y_start;
  if(y_start>=256)
  {
    y_start1=y_start2/256;
    y_start2=y_start2%256;
  }
  y_end1=0;
  y_end2=y_start+PART_COLUMN-1;
  if(y_end2>=256)
  {
    y_end1=y_end2/256;
    y_end2=y_end2%256;    
  }   
  
  count=PART_COLUMN*PART_LINE/8;

    EPD_init();
    EPD_W21_WriteCMD(0x91);   //This command makes the display enter partial mode
    EPD_W21_WriteCMD(0x90);   //resolution setting
    EPD_W21_WriteDATA ((400-x_end)/256);
    EPD_W21_WriteDATA ((400-x_end)%256);   //x-start    
    
    EPD_W21_WriteDATA ((400-x_start)/256);    
    EPD_W21_WriteDATA ((400-x_start)%256-1);  //x-end

    EPD_W21_WriteDATA (y_start1);
    EPD_W21_WriteDATA (y_start2);   //y-start    
    
    EPD_W21_WriteDATA (y_end1);   
    EPD_W21_WriteDATA (y_end2);  //y-end
    EPD_W21_WriteDATA (0x28); 
  
  EPD_W21_WriteCMD(0x10);        //Transfer old data
  for(i=0;i<count;i++)       
  {
   EPD_W21_WriteDATA(0x00);  
  }
  
  if(mode==0)
  {
  EPD_W21_WriteCMD(0x13);        //writes New data to SRAM.
    for(i=0;i<count;i++)       
   {
    EPD_W21_WriteDATA(pgm_read_byte(&new_data[i])); //New picture
   }
 }
  else if(mode==1)
  {
  EPD_W21_WriteCMD(0x13);        //writes New data to SRAM.
    for(i=0;i<count;i++)       
   {
    EPD_W21_WriteDATA(0xff);  //All  white
   }
 }    
  else if(mode==2)
  {
  EPD_W21_WriteCMD(0x13);        //writes New data to SRAM.
    for(i=0;i<count;i++)       
   {
    EPD_W21_WriteDATA(0x00);  //All Black
   }
 }   
  

   EPD_init_data();//
       
    EPD_W21_WriteCMD(0x12);    //DISPLAY REFRESH                 
     delay(1);   //!!!The delay here is necessary, 200uS at least!!!     
    lcd_chkstatus();
    
}
