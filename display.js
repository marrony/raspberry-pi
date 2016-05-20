var Gpio = require('onoff').Gpio;
var sleep = require('sleep');

var LCD_RS = new Gpio(7, 'out');
var LCD_E = new Gpio(8, 'out');
var LCD_D4 = new Gpio(25, 'out');
var LCD_D5 = new Gpio(24, 'out');
var LCD_D6 = new Gpio(23, 'out');
var LCD_D7 = new Gpio(18, 'out');

var LCD_CHR = true;
var LCD_CMD = false;
       
var LCD_LINE_1 = 0x80;
var LCD_LINE_2 = 0xC0;

lcdInit();

var pin = new Gpio(2, 'out');

  console.log('blah');
	sleep.sleep(1);
	pin.writeSync(1);
	sleep.sleep(1);
	pin.writeSync(0);
	sleep.sleep(1);
	pin.writeSync(1);
	sleep.usleep(1);
	pin.writeSync(0);
	sleep.sleep(1);
  console.log('blah2');

//lcdString("A", LCD_LINE_1);
//lcdString("Raspberry", LCD_LINE_2);

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

  sleep.usleep(1000);
}

function lcdClear() {
  lcdByte(0x01, LCD_CMD);
}

function lcdDestroy() {
}

function lcdByte(byte, mode) {
  console.log('lcdByte1', byte, mode);
    writeValueCB(LCD_RS, mode);
    writeValueCB(LCD_D4, (byte & 0x10) === 0x10 ? true : false);
    writeValueCB(LCD_D5, (byte & 0x20) === 0x20 ? true : false);
    writeValueCB(LCD_D6, (byte & 0x40) === 0x40 ? true : false);
    writeValueCB(LCD_D7, (byte & 0x80) === 0x80 ? true : false);
    //toggle enable pin
    sleep.usleep(100);
    writeValueCB(LCD_E, 1, 100);
    sleep.usleep(100);
    writeValueCB(LCD_E, 0, 100);
    sleep.usleep(100);
    writeValueCB(LCD_D4, (byte & 0x01) === 0x01 ? true : false);
    writeValueCB(LCD_D5, (byte & 0x02) === 0x02 ? true : false);
    writeValueCB(LCD_D6, (byte & 0x04) === 0x04 ? true : false);
    writeValueCB(LCD_D7, (byte & 0x08) === 0x08 ? true : false);
    //toggle enable pin
    sleep.usleep(100);
    writeValueCB(LCD_E, 1, 100);
    sleep.usleep(100);
    writeValueCB(LCD_E, 0, 100);
    sleep.usleep(100);
  console.log('lcdByte2', byte, mode);
}

function lcdString(str, line) {
  console.log('lcdString', str, line);

  lcdByte(line, LCD_CMD);

  for (var i = 0, len = str.length; i < len; i++) {
    lcdByte(str.charCodeAt(i), LCD_CHR);
  }
}

/////////////////////////////////

function writeValueCB(port, value) {
	port.writeSync(value);
}

