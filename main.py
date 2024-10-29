# SPDX-FileCopyrightText: 2023 Michał Pokusa
#
# SPDX-License-Identifier: Unlicense

# NodeMCU ESP32 https://joy-it.net/files/files/Produkte/SBC-NodeMCU-ESP32/SBC-NodeMCU-ESP32-Manual-2021-06-29.pdf
# https://joy-it.net/en/products/SBC-NodeMCU-ESP32

import asyncio
import board
import digitalio
import microcontroller
import gc
import socketpool
import wifi
import pwmio
import ipaddress
import json
import time
from adafruit_motor import motor
import countio

from adafruit_httpserver import Server, Request, MIMETypes, Websocket, GET, FileResponse

isDebug = False

# async def main():
#     pass


# asyncio.run(main())
# assert False

AP_SSID = "GamikaCar"
AP_PASSWORD = "kasun1234"

print("Creating access point...")
wifi.radio.start_ap(ssid=AP_SSID, password=AP_PASSWORD)

print(f"Created access point {AP_SSID}")


def getConfigs():
    with open("konfig.json", "a") as f:
        configJson = json.load(f)
        print(configJson)
        if "wifiMode" not in configJson:
            configJson.wifiMode = "ap"
            f.write(json.dumps(configJson))
        return configJson


# getConfigs()

pwm_a = pwmio.PWMOut(board.D4, frequency=50)
pwm_b = pwmio.PWMOut(board.D2, frequency=50)
driveWheel = motor.DCMotor(pwm_a, pwm_b)
driveWheel.throttle = 0

pwm_c = pwmio.PWMOut(board.D17, frequency=50)
pwm_d = pwmio.PWMOut(board.D16, frequency=50)
frontSteer = motor.DCMotor(pwm_c, pwm_d)
frontSteer.throttle = 0


# https://docs.circuitpython.org/projects/httpserver/en/latest/examples.html#serving-static-files
MIMETypes.configure(
    default_to="text/html",
    # Unregistering unnecessary MIME types can save memory
    keep_for=[".css", ".js", ".png", ".jpg", ".jpeg"],
)

pool = socketpool.SocketPool(wifi.radio)
server = Server(pool, root_path="/www", debug=True)


# led = digitalio.DigitalInOut(board.LED)
# led.direction = digitalio.Direction.OUTPUT

websocket: Websocket = None

# https://docs.circuitpython.org/projects/httpserver/en/latest/api.html#adafruit_httpserver.response.FileResponse


@server.route("/client", GET)
def client(request: Request):
    # https://docs.circuitpython.org/projects/httpserver/en/latest/api.html#adafruit_httpserver.request.Request
    print(request.path)
    return FileResponse(
        request, filename="index.html", root_path="/www", content_type="text/html"
    )


@server.route("/connect-websocket", GET)
def connect_client(request: Request):
    global websocket  # pylint: disable=global-statement

    if websocket is not None:
        websocket.close()  # Close any existing connection

    websocket = Websocket(request)

    return websocket


server.start(str(wifi.radio.ipv4_address_ap))


async def handle_http_requests():
    while True:
        server.poll()
        await asyncio.sleep(0)


async def handle_websocket_requests(context):
    while True:
        if websocket is not None:
            if (data := websocket.receive(fail_silently=True)) is not None:
                params = data.split("#")
                if isDebug:
                    print(data)
                if params[0] == 'parent_control':
                    context.parentControl = params[1] == 'true'
                    if isDebug:
                        print("Parent Control: ", context.parentControl)
                    continue
                driveWheelSpeed = float(params[0])
                frontSteerSpeed = float(params[1])
                
                if driveWheelSpeed or driveWheelSpeed == 0:
                    if driveWheelSpeed >= -1 and driveWheelSpeed <= 1:
                        driveWheel.throttle = driveWheelSpeed
                if frontSteerSpeed or frontSteerSpeed == 0:
                    frontSteer.throttle = frontSteerSpeed
                websocket.send_message("Ack " + data, fail_silently=True)

        await asyncio.sleep(0)


async def send_websocket_messages():
    while True:
        if websocket is not None:
            # cpu_temp = round(microcontroller.cpu.temperature, 2)
            # https://learn.adafruit.com/Memory-saving-tips-for-CircuitPython?view=all
            gc.collect()
            start_mem = gc.mem_free()
            print("Point 1 Available memory: {} bytes".format(start_mem))
            websocket.send_message("Keep-Alive", fail_silently=True)
        await asyncio.sleep(15)


# Deprecated use only for testing and as a reference to using interrupts
async def catch_acceleration():
    hasAccelerated = False
    with countio.Counter(board.D19) as interrupt:
        while True:
            if interrupt.count > 0:
                interrupt.count = 0
                if hasAccelerated:
                    print("Stopped")
                    hasAccelerated = False
                    driveWheel.throttle = 0
                    if websocket is not None:
                        websocket.send_message("MOTOR#STOPPED", fail_silently=True)
            else:
                print("Running")
                hasAccelerated = True
                driveWheel.throttle = 1
                if websocket is not None:
                    websocket.send_message("MOTOR#RUNNING", fail_silently=True)
            await asyncio.sleep(0.1)


class SharedContext:
    # https://learn.adafruit.com/cooperative-multitasking-in-circuitpython-with-asyncio/communicating-between-tasks
    def __init__(self):
        self.direction = 0
        self.parentControl = False


async def monitor_inputs(pins, context):
    [reverse, speed1, speed2, accelerator] = pins
    
    hasAccelerated = False
    while True:
        if isDebug:
            print("Timestamp: ", time.time())
        isReverse = reverse.value
        isSpeed1 = speed1.value
        isSpeed2 = speed2.value
        isAccelerator = accelerator.value
        if isDebug:
            print("Reverse: ", isReverse)
            print("Speed1: ", isSpeed1)
            print("Speed2: ", isSpeed2)
            print("Accelerator: ", isAccelerator)
        if isAccelerator:
            hasAccelerated = True
            revFactor = -1 if isReverse else 1
            acceleratorFactor = 0.7 if isSpeed1 else 1 if isSpeed2 else 0
            if revFactor is -1:
                acceleratorFactor = 1
            if isDebug:
                print("Accelerator Factor: ", acceleratorFactor)
                print("Reverse Factor: ", revFactor)
                print("Parent Control: ", context.parentControl)
            if context.parentControl != True:
                driveWheel.throttle = acceleratorFactor * revFactor
            if websocket is not None:
                websocket.send_message(
                    "MOTOR#RUNNING/" + str(acceleratorFactor * revFactor),
                    fail_silently=True,
                )
        elif hasAccelerated:
            if isDebug:
                print("Stopped")
            hasAccelerated = False
            driveWheel.throttle = 0
            if websocket is not None:
                websocket.send_message("MOTOR#STOPPED", fail_silently=True)
        if isDebug:
            await asyncio.sleep(1)
        else:
            await asyncio.sleep(0.05)


async def main():
    context = SharedContext()
    reverse = digitalio.DigitalInOut(board.D25)
    reverse.direction = digitalio.Direction.INPUT
    reverse.pull = digitalio.Pull.DOWN
    speed1 = digitalio.DigitalInOut(board.D27)
    speed1.direction = digitalio.Direction.INPUT
    speed1.pull = digitalio.Pull.DOWN
    speed2 = digitalio.DigitalInOut(board.D26)
    speed2.direction = digitalio.Direction.INPUT
    speed2.pull = digitalio.Pull.DOWN
    accelerator = digitalio.DigitalInOut(board.D19)
    accelerator.direction = digitalio.Direction.INPUT
    accelerator.pull = digitalio.Pull.DOWN

    await asyncio.gather(
        asyncio.create_task(handle_http_requests()),
        asyncio.create_task(handle_websocket_requests(context)),
        asyncio.create_task(send_websocket_messages()),
        # asyncio.create_task(catch_acceleration()),
        asyncio.create_task(monitor_inputs([reverse, speed1, speed2, accelerator], context)),
    )


asyncio.run(main())
