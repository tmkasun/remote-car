# SPDX-FileCopyrightText: 2023 Michał Pokusa
#
# SPDX-License-Identifier: Unlicense

#NodeMCU ESP32 https://joy-it.net/files/files/Produkte/SBC-NodeMCU-ESP32/SBC-NodeMCU-ESP32-Manual-2021-06-29.pdf
# https://joy-it.net/en/products/SBC-NodeMCU-ESP32

from asyncio import create_task, gather, run, sleep as async_sleep
import board
import digitalio
import microcontroller
import gc
import socketpool
import wifi
import pwmio
from adafruit_motor import motor

from adafruit_httpserver import Server, Request, MIMETypes, Websocket, GET, FileResponse


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
server = Server(pool,root_path='/www', debug=True)


# led = digitalio.DigitalInOut(board.LED)
# led.direction = digitalio.Direction.OUTPUT

websocket: Websocket = None

# https://docs.circuitpython.org/projects/httpserver/en/latest/api.html#adafruit_httpserver.response.FileResponse

@server.route("/client", GET)
def client(request: Request):
    # https://docs.circuitpython.org/projects/httpserver/en/latest/api.html#adafruit_httpserver.request.Request
    print(request.path)
    return FileResponse(request, filename='index.html',root_path='/www', content_type="text/html")


@server.route("/connect-websocket", GET)
def connect_client(request: Request):
    global websocket  # pylint: disable=global-statement

    if websocket is not None:
        websocket.close()  # Close any existing connection

    websocket = Websocket(request)

    return websocket


server.start(str(wifi.radio.ipv4_address))


async def handle_http_requests():
    while True:
        server.poll()
        await async_sleep(0)


async def handle_websocket_requests():
    while True:
        if websocket is not None:
            if (data := websocket.receive(fail_silently=True)) is not None:
                params = data.split('#')
                print(data)
                driveWheelSpeed = float(params[0])
                frontSteerSpeed = float(params[1])
                if driveWheelSpeed or driveWheelSpeed == 0:
                    driveWheel.throttle = driveWheelSpeed
                
                if frontSteerSpeed or frontSteerSpeed == 0:
                    frontSteer.throttle = frontSteerSpeed
                websocket.send_message("Ack " + data, fail_silently=True)

        await async_sleep(0)


async def send_websocket_messages():
    while True:
        if websocket is not None:
            # cpu_temp = round(microcontroller.cpu.temperature, 2)
            # https://learn.adafruit.com/Memory-saving-tips-for-CircuitPython?view=all
            gc.collect()
            start_mem = gc.mem_free()
            print( "Point 1 Available memory: {} bytes".format(start_mem) )
            websocket.send_message("Keep-Alive", fail_silently=True)
        await async_sleep(15)


async def main():
    await gather(
        create_task(handle_http_requests()),
        create_task(handle_websocket_requests()),
        create_task(send_websocket_messages()),
    )


run(main())