var gpio = require('rpi-gpio');
var async = require('async');
var sleep = require('sleep');
var Gpio = require('onoff').Gpio;

var LCD_RS = '7';
var LCD_E = '8';
var LCD_D4 = '25';
var LCD_D5 = '24';
var LCD_D6 = '23';
var LCD_D7 = '18';

var LCD_CHR = true;
var LCD_CMD = false;
       
var LCD_LINE_1 = 0x80;
var LCD_LINE_2 = 0xC0;

lcdInit();

var pin = 2;

gpio.setup(pin, gpio.DIR_OUT, function() {
  console.log('blah');
sleep.sleep(1);
gpio.write(pin, 1);
sleep.sleep(1);
gpio.write(pin, 0);
sleep.sleep(1);
gpio.write(pin, 1);
sleep.usleep(1);
gpio.write(pin, 0);
sleep.sleep(1);
  console.log('blah2');
});

//lcdString("A", LCD_LINE_1);
//lcdString("Raspberry", LCD_LINE_2);

//lcdDestroy();


////////////////////////////////////////

function lcdInit() {
  //gpio.setMode(gpio.MODE_BCM);

  async.parallel([
    setupPort(LCD_RS, gpio.DIR_OUT),
    setupPort(LCD_E,  gpio.DIR_OUT),
    setupPort(LCD_D4, gpio.DIR_OUT),
    setupPort(LCD_D5, gpio.DIR_OUT),
    setupPort(LCD_D6, gpio.DIR_OUT),
    setupPort(LCD_D7, gpio.DIR_OUT),
    setupPort(2, gpio.DIR_OUT)
  ]);

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
  gpio.destroy();
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

function setupPort(port, direction) {
  return function(cb) {
    gpio.setup(port, direction, cb);
  }
}

function writeValue(port, value) {
  return function(cb) {
    console.log('write', port, value);
    gpio.write(port, value);
  }
}

function writeValueCB(port, value) {
  var fn = writeValue(port, value);
  fn(function() {});
}

function writeDelayValue(port, value, delay) {
  console.log('writeDelay', port, value);
  return function(cb) {
    setTimeout(function() {
      gpio.write(port, value, function() { cb(null); });
    }, delay);
  }
}

