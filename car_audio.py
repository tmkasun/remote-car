import time
import supervisor
import board
import audiobusio
from audiomp3 import MP3Decoder
import audiomixer
import digitalio


isDebug = False
GAIN = digitalio.DigitalInOut(board.D14)
GAIN.direction = digitalio.Direction.OUTPUT
LRC = board.D35
BCLK = board.D32
DIN = board.D33


def honk():
    audio = audiobusio.I2SOut(BCLK, LRC, DIN)
    with open("car-horn.mp3", "rb") as car_horn_file:
        try:
            car_horn = MP3Decoder(car_horn_file)
        except MemoryError:
            print("Not enough memory")
            audio.deinit()
            return
        audiomixer1 = audiomixer.Mixer(
            voice_count=1, sample_rate=24000, channel_count=1
        )
        print("Playing car horn")
        audio.play(audiomixer1)
        GAIN.value = True
        audiomixer1.voice[0].level = 0.1
        audiomixer1.voice[0].play(car_horn)
        while audiomixer1.voice[0].playing:
            pass
        audio.stop()
        audio.deinit()
        audiomixer1.deinit()
        car_horn.deinit()
        car_horn_file.close()