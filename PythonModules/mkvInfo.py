from .prints import *
import os

def getAudioLanguages(path):
    cmd = os.popen(f'ffprobe.exe -loglevel quiet -show_entries stream=index:stream_tags=language -select_streams a -of compact=p=0:nk=1 "{path}"').read()
    res = []
    for _ in cmd.split("\n"):
        l = _.split("|")[-1]
        if "fre" in l or "fra" in l:
            language = "french"
        if "en" in l or "ang" in l :
            language = "english"
        else:
            language = question(f'Please select language for {l}')
        if language not in res:
            res.append(language)
    return res

def getSubLanguages(path):
    cmd = os.popen(f'ffprobe.exe -loglevel quiet -show_entries stream=index:stream_tags=language -select_streams s -of compact=p=0:nk=1 "{path}"').read()
    res = []
    for _ in cmd.split("\n"):
        l = _.split("|")[-1]
        if "fre" in l or "fra" in l:
            language = "french"
        if "en" in l or "ang" in l :
            language = "english"
        else:
            language = question(f'Please select language for {l}')
        if language not in res:
            res.append(language)
    return res

