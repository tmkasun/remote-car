#!/usr/bin/env bash

echo "Syncing with ESP32 . . ."

echo "Uploading main.py . . ."
ampy --port /dev/ttyUSB0 put ../main.py
echo "main.py uploaded!"

# rshell --port /dev/ttyUSB0 repl


echo "Removing www . . ."
# ampy --port /dev/ttyUSB0 rmdir www
echo "www removed"

echo "uploading www . . ."
ampy --port /dev/ttyUSB0 put www
echo "www uploaded!"

ampy --port /dev/ttyUSB0 put ../boot.py
echo "boot.py uploaded!"

ampy --port /dev/ttyUSB0 put ../settings.toml
echo "settings.toml uploaded!"

ampy --port /dev/ttyUSB0 put ../tls_utils.py
echo "tls_utils.py uploaded!"

ampy --port /dev/ttyUSB0 put ../certificates
echo "certificates uploaded!"


echo "Performing a soft reset . . ."
ampy --port /dev/ttyUSB0 reset
echo "Completed a soft reset"