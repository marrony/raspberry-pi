var noble = require('noble');

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

  //console.log(peripheral);
  console.log('found device:', macAddress, ', rssi:', rssi, ', Local Name:', localName, ', Services:', services);

});


