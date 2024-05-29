from .prints import *
from .krakenConf import *
import os

def getLanguage(abr, path):
    match abr.strip().lower():
        case "":
            return ""
        case "fre":
            language = "french"
        case "fra":
            language = "french"
        case "eng":
            language = "english"
        case "ang":
            language = "english"
        case "spa":
            language = "spanish"
        case "por":
            language = "portuguese"
        case "srp":
            language = "serbian"
        case "jpn":
            language = "japanese"
        case "ara":
            language = "arabic"
        case "dan":
            language = "danish"
        case "dut":
            language = "dutch"
        case "est":
            language = "estonian"
        case "fin":
            language = "finnish"
        case "ger":
            language = "german"
        case "hun":
            language = "hungarian"
        case "ita":
            language = "italian"
        case "rum":
            language = "romanian"
        case "nor":
            language = "norwegian"
        case "rus":
            language = "russian"
        case "swe":
            language = "swedish"
        case "tur":
            language = "turkish"
        case _:
            try:
                int(abr)
                return ""
            except:
                language = question(f'Please select language for {path} with language {abr}').strip()

    return language

def getAudioLanguages(path, ffprobe = ffprobe_bin):
    cmd = os.popen(f'{ffprobe} -loglevel quiet -show_entries stream=index:stream_tags=language -select_streams a -of compact=p=0:nk=1 "{path}"').read()
    res = []
    for _ in cmd.split("\n"):
        l = _.split("|")[-1]
        language = getLanguage(l, path)
        if language not in res and language != "":
            res.append(language)
    return res

def getSubLanguages(path, ffprobe = ffprobe_bin):
    cmd = os.popen(f'{ffprobe} -loglevel quiet -show_entries stream=index:stream_tags=language -select_streams s -of compact=p=0:nk=1 "{path}"').read()
    res = []
    for _ in cmd.split("\n"):
        l = _.split("|")[-1]
        language = getLanguage(l, path)
        if language not in res and language != "":
            res.append(language)
    return res

