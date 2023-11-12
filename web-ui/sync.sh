#!/usr/bin/env bash

echo "Syncing with ESP32 . . ."

echo "Uploading main.py . . ."
ampy --port /dev/ttyUSB0 put ../main.py
echo "main.py uploaded!"

rshell --port /dev/ttyUSB0 repl

exit 0

echo "Removing www . . ."
ampy --port /dev/ttyUSB0 rmdir www
echo "www removed"

echo "uploading www . . ."
ampy --port /dev/ttyUSB0 put www
echo "www uploaded!"

echo "Performing a soft reset . . ."
ampy --port /dev/ttyUSB0 reset
echo "Completed a soft reset"