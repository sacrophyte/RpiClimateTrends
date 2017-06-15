# RpiClimateTrends
Utilizing a raspberry pi to collect temperature and humidity readings, which are stored in a database and displayed via Highcharts JS framework.


## Keywords
sqlite3, raspberry pi, json, javascript, bash, sql, highcharts, dual axis angular guage, temperature, humidity, sensor, node.js

## Overview
I wanted a way to measure and track the temperature changes in my office, and I had an older raspberry pi sitting around that I wanted to use to learn about the GPIO pins, so I thought to put these ideas together. I have used the Highcharts library in the past and wanted to use it again. After a bit of googling, I landed on Tom Holderness's example using the D18b20 sensor, so that formed the basis of wherer I started. Eventually I upgraded to an AM2302 sensor.

### Setup the sensors
Initially I purchased a small bundle of D18b20 sensors rated for outdoor/in-ground use, 4.7k ohm resistors and patch wires. I manually connected a resistor to two terminals of the thermsitor (which I learned later is called a "pull-up" resitor), and sloppily connected patch wires to the three terminal wires, and the other ends to the GPIO pins on my raspberry pi. I suffered from loose connections quite often. Using the AM2302 sensor was much easier to connect, but collecting data via the software was more of a challenge.

### Setup the Pi
First I decided to harden Raspbian a little bit (I do not recall which documents I used, but there are several on google). Getting my pi on a wireless network at work was a little tricky, but after diagnosing that my pi was sending two different DHCP requests (one from the hardware, one from wpa_supplicant), I was fine and finally established several ssh key-pairs (between my workstation, the pi, and my host webserver). I also installed several layers of dependencies, first as Tom Holderness (talltom) laid out, then the Adafruit Python DHT example. When I started with the D18b20 sensor, I used a shell script to probe and transform the output. When I switched to the AM2302, I modified an example of the Adafruit DHT python script. In both cases, I wrapped up the output to insert into a sqlite3 database on my webserver.

### Setup the webserver
I already had a mysql database running, but I did not want to mess with security, and all I really needed was a light, simple database platform. So sqlite3 seemed like the best fit. Again, using the example from Holderness, I modified a node.js server script to accept incoming requests on a custom port, query the database and spit out data in json format. I update server.js several times as I changed sensors and added features on the outward-facing chart.

### Setup the Highcharts chart
This step probably took me the longest time, tweaking the json over and over until I was pleased with the end result. I started with an angular guage (using an online example), then stepped up to a dual-axis angular guage for both Fahrenheit and Celsius (using yet a different example). Color-coding the bands was also very tricky. And then later I added the Highstock navigator chart to display time-aggregated views of all the collected data.

## Hardware
- Raspberry Pi (any model will work)
- 5v 1A micro-usb power adapter
- AM2302 temperature+humidity sensor (I highly recommend one that has the pull-up resistor included, and the solderless patch wires are a nice touch: www.amazon.com/dp/B01LXJALVW)

## Optional hardware (to set up your raspberry pi)
- keyboard/mouse/display (+ usb hub if you are short on usb ports)
- USB wireless adapter (https://www.canakit.com/raspberry-pi-wifi.html) (only needed if wireless not already included in your RPi or wired is not a possibility)
- if using a pi zero, I recommend a pin header (either hammer-in or solder)

## Other resources
- an online host for your webpage (I am pushing data out from a private firewall, so cannot host on the pi itself)
- highcharts js framework (https://www.highcharts.com)
- raspberry pi pinout chart (https://pinout.xyz)
- source: https://github.com/talltom/PiThermServer
- source: https://github.com/adafruit/Adafruit_Python_DHT
- source: http://jsfiddle.net/gh/get/jquery/3.1.1/highslide-software/highcharts.com/tree/master/samples/stock/demo/compare/
- source: http://jsfiddle.net/g8gzh96n/
- source: http://jsfiddle.net/highcharts/EjRLw/



## Example
http://onyx.csit.parkland.edu:35008
<img src="rpi_climate_trends_example.JPG">
