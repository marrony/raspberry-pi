sudo echo 2 > /sys/class/gpio/export > /dev/null
sudo echo out > /sys/class/gpio/gpio2/direction > /dev/null

echo 1 > /sys/class/gpio/gpio2/value
sleep 1
echo 0 > /sys/class/gpio/gpio2/value
sleep 1
echo 1 > /sys/class/gpio/gpio2/value
sleep 1
echo 0 > /sys/class/gpio/gpio2/value
sleep 1
echo 1 > /sys/class/gpio/gpio2/value
sleep 1
echo 0 > /sys/class/gpio/gpio2/value
