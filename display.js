var Gpio = require('onoff').Gpio;
var sleep = require('sleep');

var LCD_RS = new Gpio(7, 'out');
var LCD_E = new Gpio(8, 'out');
var LCD_D4 = new Gpio(25, 'out');
var LCD_D5 = new Gpio(24, 'out');
var LCD_D6 = new Gpio(23, 'out');
var LCD_D7 = new Gpio(18, 'out');

var LCD_CHR = 1;
var LCD_CMD = 0;
       
var LCD_LINE_1 = 0x80;
var LCD_LINE_2 = 0xC0;

lcdInit();

lcdString("Hello", LCD_LINE_1);
lcdString("Raspberry", LCD_LINE_2);

//lcdDestroy();


////////////////////////////////////////

function lcdInit() {
  console.log('lcdInit');
  lcdByte(0x33, LCD_CMD);
  lcdByte(0x32, LCD_CMD);
  lcdByte(0x06, LCD_CMD);
  lcdByte(0x0C, LCD_CMD);
  lcdByte(0x28, LCD_CMD);
  lcdClear();
}

function lcdClear() {
  lcdByte(0x01, LCD_CMD);
}

function lcdDestroy() {
  LCD_RS.unexport();
  LCD_E.unexport();
  LCD_D4.unexport();
  LCD_D5.unexport();
  LCD_D6.unexport();
  LCD_D7.unexport();
}

function lcdByte(byte, mode) {
	LCD_RS.writeAsync(mode);

	LCD_D4.writeAsync((byte & 0x10) === 0x10 ? 1 : 0);
	LCD_D5.writeAsync((byte & 0x20) === 0x20 ? 1 : 0);
	LCD_D6.writeAsync((byte & 0x40) === 0x40 ? 1 : 0);
	LCD_D7.writeAsync((byte & 0x80) === 0x80 ? 1 : 0);

	//toggle enable pin
	sleep.usleep(100);
	LCD_E.writeAsync(10);
	sleep.usleep(100);
	LCD_E.writeAsync(0);
	sleep.usleep(100);

	LCD_D4.writeAsync((byte & 0x01) === 0x01 ? 1 : 0);
	LCD_D5.writeAsync((byte & 0x02) === 0x02 ? 1 : 0);
	LCD_D6.writeAsync((byte & 0x04) === 0x04 ? 1 : 0);
	LCD_D7.writeAsync((byte & 0x08) === 0x08 ? 1 : 0);

	//toggle enable pin
	sleep.usleep(100);
	LCD_E.writeAsync(, 1, 100);
	sleep.usleep(100);
	LCD_E.writeAsync(, 0, 100);
	sleep.usleep(100);
}

function lcdString(str, line) {
  lcdByte(line, LCD_CMD);

  for (var i = 0, len = str.length; i < len; i++)
    lcdByte(str.charCodeAt(i), LCD_CHR);
}

