from time import sleep
import RPi.GPIO as GPIO
import sys 

#Retrieve parameters from the calling system
rotations = sys.argv[1]
rotationDirection = sys.argv[2]

DIR = 20   # Direction GPIO Pin
STEP = 21  # Step GPIO Pin
CW = 1     # Clockwise Rotation
CCW = 0    # Counterclockwise Rotation
SPR = 200 * int(rotations)   # Steps per Revolution (360 / 7.5)

GPIO.setmode(GPIO.BCM)
GPIO.setup(DIR, GPIO.OUT)
GPIO.setup(STEP, GPIO.OUT)

if rotationDirection == 'up':
    GPIO.output(DIR, CW)
else:
    GPIO.output(DIR, CCW)

step_count = SPR
delay = .005

#run the loop and turn the motor
for x in range(step_count):
    GPIO.output(STEP, GPIO.HIGH)
    sleep(delay)
    GPIO.output(STEP, GPIO.LOW)
    sleep(delay)

GPIO.cleanup()
