# SPDX-FileCopyrightText: 2021 ladyada for Adafruit Industries
# SPDX-License-Identifier: MIT

# This example uses an L9110 H-bridge driver to run a DC Motor using two PWM pins.
#  https://www.adafruit.com/product/4489

# Hardware setup:
#   DC motor via L9110 H-bridge driver on two PWM pins that are on their own channels
#   e.g., RP2040 Pico pins GP28, GP27

import time
import board
import pwmio
from adafruit_motor import motor

pwm_a = pwmio.PWMOut(board.D4, frequency=50)
pwm_b = pwmio.PWMOut(board.D2, frequency=50)
driveWheel = motor.DCMotor(pwm_a, pwm_b)
driveWheel.throttle = 0

pwm_c = pwmio.PWMOut(board.D17, frequency=50)
pwm_d = pwmio.PWMOut(board.D16, frequency=50)
frontSteer = motor.DCMotor(pwm_c, pwm_d)
frontSteer.throttle = 0

assert False
print("***DC motor test***")

print("\nForwards slow")
driveWheel.throttle = 0.3
print("  throttle:", driveWheel.throttle)
time.sleep(5)

print("\nStop")
driveWheel.throttle = 0
print("  throttle:", driveWheel.throttle)
time.sleep(5)

print("\nForwards")
driveWheel.throttle = 0.3
print("  throttle:", driveWheel.throttle)
time.sleep(5)

print("\nStop")
driveWheel.throttle = 0
print("throttle:", driveWheel.throttle)
time.sleep(5)

print("\nBackwards")
driveWheel.throttle = -0.3
print("  throttle:", driveWheel.throttle)
time.sleep(5)

print("\nStop")
driveWheel.throttle = 0
print("throttle:", driveWheel.throttle)
time.sleep(5)

print("\nBackwards slow")
driveWheel.throttle = -0.5
print("  throttle:", driveWheel.throttle)
time.sleep(5)

print("\nStop")
driveWheel.throttle = 0
print("  throttle:", driveWheel.throttle)
time.sleep(5)

# print("\nSpin freely")
# driveWheel.throttle = None
# print("  throttle:", driveWheel.throttle)

print("\n***Motor test is complete***")
