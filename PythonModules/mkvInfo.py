from .prints import *
from .krakenConf import *
import os

def getAudioLanguages(path, ffprobe = ffprobe_bin):
    cmd = os.popen(f'{ffprobe} -loglevel quiet -show_entries stream=index:stream_tags=language -select_streams a -of compact=p=0:nk=1 "{path}"').read()
    res = []
    for _ in cmd.split("\n"):
        l = _.split("|")[-1]
        if "fre" in l or "fra" in l:
            language = "french"
        elif "en" in l or "ang" in l :
            language = "english"
        elif l.strip() != "":
            language = question(f'Please select language for {l}')
        else :
            language = ""
        if language not in res and language != "":
            res.append(language)
    return res

def getSubLanguages(path, ffprobe = ffprobe_bin):
    cmd = os.popen(f'{ffprobe} -loglevel quiet -show_entries stream=index:stream_tags=language -select_streams s -of compact=p=0:nk=1 "{path}"').read()
    res = []
    for _ in cmd.split("\n"):
        l = _.split("|")[-1]
        if "fre" in l or "fra" in l:
            language = "french"
        elif "en" in l or "ang" in l :
            language = "english"
        elif l.strip() != "":
            language = question(f'Please select language for {l}')
        else :
            language = ""
        if language not in res and language != "":
            res.append(language)
    return res

