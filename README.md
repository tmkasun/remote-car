# How to

This project uses [Circuitpython](https://learn.adafruit.com/welcome-to-circuitpython/what-is-circuitpython). And the ESP board is NodeMCU ESP32 WROOM32. Web UI is a React app.
Basic idea is to control toy car motor using ESP32 board over the wifi connection. L298N motor controller is used.

Note: This project doesn't use `platformio` (Because of [this](https://github.com/platformio/platformio-core/issues/728)) nor `MicroPython`
# Steps to build from scratch

- [Install esptool.py / idf.py](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/get-started/linux-macos-setup.html)
- run 
```
esptool.py write_flash -z 0x0 ../cirpyfirmware/adafruit-circuitpython-doit_esp32_devkit_v1-en_US-8.2.7.bin
``` 
to install the firmware

- use Circuitpython vscode extension with `Adafruit: Adafruit feather ESP32S2` board type to get more similar auto correction and python code intellisense support.
- Check [sync.sh](web-ui/sync.sh) file to see how the [ampy] and [rshell] has been used for uploading the files to ESP32 and monitoring the serial console
- [This is the example](https://github.com/adafruit/Adafruit_CircuitPython_HTTPServer/blob/main/examples/httpserver_websocket.py) HTTP websocket code this project is based on

- Download the [libraries](https://circuitpython.org/libraries) and copy only the libraries used in the program, Since the firmware is of version 8.2.7 use 8.x community or official libraries


# More related helpful articles 

- https://github.com/adafruit/Adafruit_Learning_System_Guides/tree/main/CircuitPython_Essentials
- [Adafruit: Adafruit feather ESP32S2](https://learn.adafruit.com/adafruit-esp32-s2-feather/blink) tutorials this board's pin somewhat matches with the ESP32 board used in this project
- circuitpython [Serving static files](https://docs.circuitpython.org/projects/httpserver/en/latest/examples.html#serving-static-files)
- circuitpython [Request object documentation](https://docs.circuitpython.org/projects/httpserver/en/latest/api.html#adafruit_httpserver.request.Request)
- [adafruit_motor](https://learn.adafruit.com/adafruit-tb6612-h-bridge-dc-stepper-motor-driver-breakout/python-circuitpython#circuitpython-and-python-usage-3070892) usage
- [Adafruit motor example code](https://github.dev/adafruit/Adafruit_CircuitPython_Motor/tree/main)
- [l298n wiring with ESP32 board](https://microcontrollerslab.com/l298n-dc-motor-driver-module-esp32-tutorial/)