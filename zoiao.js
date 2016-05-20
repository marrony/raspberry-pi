var noble = require('noble');
var socket = require('socket.io-client')('http://10.73.126.59:3000/scanner');


socket.on('connect' , function() {
    console.log(' connected' );
});


noble.on('stateChange', function(state) {
  console.log('state:', state);

  if (state === 'poweredOn')
    noble.startScanning([], true);
  else
    noble.stopScanning();
});

noble.on('discover', function(peripheral) {

  var macAddress = peripheral.address;
  var services = peripheral.advertisement.serviceUuids;
  var localName = peripheral.advertisement.localName;
  var rssi = peripheral.rssi;
  socket.emit('clothe', {mac: peripheral.uuid, rssi: peripheral.rssi});
//  console.log('found device:', macAddress, ', rssi:', rssi, ', Local Name:', localName, ', Services:', services);
  //console.log(peripheral)

});

