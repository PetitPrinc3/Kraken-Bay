################################################################################


# Based on a StackOverflow thread :
# https://stackoverflow.com/questions/22029562/python-how-to-make-simple-animated-loading-while-process-is-running


################################################################################


from threading import Thread
from time import sleep, time
from itertools import cycle
from .prints import *


################################################################################


class spinner:
    def __init__(self, desc='Processing...', timeout=0.1, old=False):
        self.desc = desc
        self.timeout = timeout
        self._thread = Thread(target=self._animate, daemon=True)
        self.steps = ["[⢿]", "[⣻]", "[⣽]", "[⣾]", "[⣷]", "[⣯]", "[⣟]", "[⡿]"]
        if old: self.steps = ["[-]", "[\]", "[|]", "[/]"]
        self.done = False

    def start(self):
        self._thread.start()
        return self

    def _animate(self):
        for _ in cycle(self.steps):
            if self.done:
                break
            print(f"\r{_} {self.desc}", flush=True, end="\r")
            sleep(self.timeout)

    def __enter__(self):
        self.start()

    def stop(self):
        print(' '*(len(self.desc) + 5), end="\r")
        self.done = True

    def __exit__(self, exc_type, exc_value, tb):
        self.stop()


################################################################################


class progress_bar:
    def __init__(self, size = 10, symbol = "#", desc = "", elapsed = False, percent=False):
        self.size = size
        self.desc = desc
        self.symbol = symbol
        self.percent = percent
        self.elapsed = elapsed
        self.step = 0
        self.progress = 0
        self.begin = time()
        self._thread = Thread(target=self.set_progress(self.step), daemon=True)
        self.disp = ""
        self.done = False

    def start(self):
        self._thread.start()
        return self

    def set_progress(self, progress):

        self.step = int(progress*self.size)
        
        if self.elapsed:
            elapsed = time()-self.begin
            
            try:
                _ = int(elapsed/progress - elapsed)
                eta = f'{_//3600}:{(_%3600)//60}:{_%60}'
                self.disp = f'[{int(elapsed)}s] [ETA {eta}s] ' + self.desc
            except ZeroDivisionError:
                self.disp = f'[{int(elapsed)}s] [ETA ∞]' + self.desc

        elif self.percent: 
            self.disp = f'{self.desc + " (About " + str(int(progress*100))}% done.)'

        else: 
            self.disp = self.desc

        print(f'[{self.symbol*self.step + " "*(self.size-self.step)}] {self.disp}', flush=True, end='\r')

    def set_desc(self, desc):
        self.desc = desc


################################################################################


if __name__ == "__main__":

    with spinner("Spinning demo..."):
        for i in range(10):
            sleep(0.25)

    with spinner("Spinning demo...", 0.1, True):
        for i in range(10):
            sleep(0.25)

    p_bar = progress_bar(20, "#", "Progress bar demo ...")
    for i in range(21):
        p_bar.set_progress(i/20)
        sleep(0.10)

    p_bar = progress_bar(20, "=", "Progress bar demo ...", False, True)
    for i in range(21):
        p_bar.set_progress(i/20)
        sleep(0.10)

    p_bar = progress_bar(20, "*", "Progress bar demo ...", True, False)
    for i in range(21):
        p_bar.set_progress(i/20)
        sleep(0.2)

    success('Did you enjoy the demo ? (c) PetitPrinc3' + ' '*(len(p_bar.disp) - 10))