var gpio = require('rpi-gpio');
var async = require('async');

var LCD_RS = 26;
var LCD_E = 24;
var LCD_D4 = 22;
var LCD_D5 = 18;
var LCD_D6 = 16;
var LCD_D7 = 12;
var LCD_CHR = 1;
var LCD_CMD = 0;
       
var LCD_LINE_1 = 0x80;
var LCD_LINE_2 = 0xC0;

lcdInit();

lcdString("Hello", LCD_LINE_1);
lcdString("Raspberry", LCD_LINE_2);

lcdDestroy();


////////////////////////////////////////

function lcdInit() {
  gpio.setMode(gpio.MODE_BCM);

  async.parallel([
    setupPort(LCD_RS, gpio.DIR_OUT),
    setupPort(LCD_E,  gpio.DIR_OUT),
    setupPort(LCD_D4, gpio.DIR_OUT),
    setupPort(LCD_D5, gpio.DIR_OUT),
    setupPort(LCD_D6, gpio.DIR_OUT),
    setupPort(LCD_D7, gpio.DIR_OUT)
  ]);

  lcdByte(0x33, LCD_CMD);
  lcdByte(0x32, LCD_CMD);
  lcdByte(0x06, LCD_CMD);
  lcdByte(0x0D, LCD_CMD);
  lcdByte(0x28, LCD_CMD);
  lcdClear();
}

function lcdDestroy() {
  gpio.destroy();
}

function lcdClear() {
  lcdByte(0x01, LCD_CMD);
}

function lcdByte(byte, mode) {
  async.series([
    writeValue(LCD_RS, mode),
    writeValue(LCD_D4, (byte & 0x10) == 0x10 ? 1 : 0),
    writeValue(LCD_D5, (byte & 0x20) == 0x20 ? 1 : 0),
    writeValue(LCD_D6, (byte & 0x40) == 0x40 ? 1 : 0),
    writeValue(LCD_D7, (byte & 0x80) == 0x80 ? 1 : 0),
    //toggle enable pin
    writeDelayValue(LCD_E, 1, 10),
    writeDelayValue(LCD_E, 0, 10),
    writeValue(LCD_D4, (byte & 0x01) == 0x01 ? 1 : 0),
    writeValue(LCD_D5, (byte & 0x02) == 0x02 ? 1 : 0),
    writeValue(LCD_D6, (byte & 0x04) == 0x04 ? 1 : 0),
    writeValue(LCD_D7, (byte & 0x08) == 0x08 ? 1 : 0),
    //toggle enable pin
    writeDelayValue(LCD_E, 1, 10),
    writeDelayValue(LCD_E, 0, 10)
  ]);
}

function lcdString(str, line) {
  lcdByte(line, LCD_CMD);

  for (var i = 0, len = str.length; i < len; i++) {
    lcdByte(str[i], LCD_CHR);
  }
}

/////////////////////////////////

function setupPort(port, direction) {
  return function(cb) {
    gpio.setup(port, direction, cb);
  }
}

function writeValue(port, value) {
  return function(cb) {
    gpio.write(port, value, cb);
  }
}

function writeDelayValue(port, value, delay) {
  return function(cb) {
    setTimeout(function() {
      gpio.write(port, value, cb);
    }, delay);
  }
}

