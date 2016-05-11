var gpio = require('rpi-gpio');
var async = require('async');

gpio.setMode(gpio.MODE_BCM);

async.parallel([
  function(cb) {
    gpio.setup(3, gpio.DIR_OUT, cb);
  }], function() {
    write();
  });

function write() {
  async.series([
      writeValue(0),
      writeValue(1),
      writeValue(0),
      writeValue(1),
      writeValue(0),
  ], function() {
    gpio.destroy();
  });
}

function writeValue(value) {
  return function(cb) {
    setTimeout(function() {
      gpio.write(3, value, cb);
    }, 1000);
  };
}
