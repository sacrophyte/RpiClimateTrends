#!/bin/sh

# set -x 

/home/pi/bin/collectReadings.py 2302 4 > /home/pi/logs/collectReadings.log 2>&1
/home/pi/bin/sendTemps.sh > /home/pi/logs/sendTemps.log 2>&1
