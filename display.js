var gpio = require('rpi-gpio');
var async = require('async');

var LDC_RS = 7;
var LDC_E = 8;
var LDC_D4 = 25;
var LDC_D5 = 24;
var LDC_D6 = 23;
var LDC_D7 = 18;
var LDC_WIDTH = 16;
var LDC_CHR = 1;
var LDC_CMD = 0;

var LDC_LINE_1 = 0x80;
var LDC_LINE_2 = 0xC0;

lcdInit();

lcdString("Hello", LDC_LINE_1);
lcdString("Raspberry", LDC_LINE_2);

lcdDestroy();


////////////////////////////////////////

function lcdInit() {
  gpio.setMode(gpio.MODE_BCM);

  async.parallel([
    setupPort(LDC_RS, gpio.DIR_OUT),
    setupPort(LDC_E,  gpio.DIR_OUT),
    setupPort(LDC_D4, gpio.DIR_OUT),
    setupPort(LDC_D5, gpio.DIR_OUT),
    setupPort(LDC_D6, gpio.DIR_OUT),
    setupPort(LDC_D7, gpio.DIR_OUT)
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
    writeValue(LDC_RS, mode),
    writeValue(LDC_D4, (byte & 0x10) == 0x10 ? 1 : 0),
    writeValue(LDC_D5, (byte & 0x20) == 0x20 ? 1 : 0),
    writeValue(LDC_D6, (byte & 0x40) == 0x40 ? 1 : 0),
    writeValue(LDC_D7, (byte & 0x80) == 0x80 ? 1 : 0),
    //toggle enable pin
    writeDelayValue(LCD_E, 1),
    writeDelayValue(LCD_E, 0),
    writeValue(LDC_D4, (byte & 0x01) == 0x01 ? 1 : 0),
    writeValue(LDC_D5, (byte & 0x02) == 0x02 ? 1 : 0),
    writeValue(LDC_D6, (byte & 0x04) == 0x04 ? 1 : 0),
    writeValue(LDC_D7, (byte & 0x08) == 0x08 ? 1 : 0),
    //toggle enable pin
    writeDelayValue(LCD_E, 1),
    writeDelayValue(LCD_E, 0)
  ]);
}

function lcdString(str, line) {
  ldcByte(line, LDC_CMD);

  for (var i = 0, len = str.length; i < len; i++) {
    ldcByte(str[i], LDC_CHR);
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

