#### NOTE #####
## This is an example only. Do not use this file "as is", since it is generated dynamically by collectReadings.py
###############

## set $myuser and $myhost in collectReadings.py
## I use ssh keypairs to avoid using a password

ssh $myuser@$myhost "echo \"insert into temps values (1497545101, '28-0316842113ff', 24.20, 40.50);\"|sqlite3 piTemps.db"; exit 0
