#!/usr/bin/python
# Copyright (c) 2014 Adafruit Industries
# Author: Tony DiCola

# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:

# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.

# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.

## Modified by Charles Schultz (14-Apr-2017)
## after running the python code to read the sensor, I also insert it into a sqlite database on a different host

import sys
import Adafruit_DHT
import time
# import subprocess
import os
import stat

epoch_time = int(time.time())
host=$myhost
login=$mylogin
creds=login + "@" + host
id="28-0316842113ff"
sensor=Adafruit_DHT.AM2302
pin=4

# Try to grab a sensor reading.  Use the read_retry method which will retry up
# to 15 times to get a sensor reading (waiting 2 seconds between each retry).
humidity, temperature = Adafruit_DHT.read_retry(sensor, pin)

# Un-comment the line below to convert the temperature to Fahrenheit.
# temperature = temperature * 9/5.0 + 32

if humidity is not None and temperature is not None:
    print('Time:{0} Temp:{1:0.1f}* Humidity:{2:0.1f}%'.format(epoch_time, temperature, humidity))

    query="insert into temps values (%d, '%s', %.2f, %.2f);" % (epoch_time, id, temperature, humidity)
    db_com='echo \\"%s\\"|sqlite3 piTemps.db' % (query)
    ssh_com='ssh %s "%s"; exit 0' % (creds,db_com)
    print ('query: ' + query)
    # print ('db_com: ' + db_com)
    # print ('ssh_com: ' + ssh_com)

    # subprocess.check_output(ssh_com,stderr=subprocess.STDOUT)
    file="/home/pi/bin/sendTemps.sh"
    ssh = open(file, "w")
    print >>ssh, ssh_com
    ssh.close()
    os.chmod(file, stat.S_IRWXU)

else:
    print('Time:{0}  Failed to get reading'.format(epoch_time))
    sys.exit(1)
