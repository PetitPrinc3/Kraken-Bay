import os 
from json import loads, dump
from urllib.request import urlretrieve
from PythonModules.krakenConf import *
from PythonModules.mkvInfo import *

JSON_PATH = "public/Assets/JSON_DMPS/"

def checkImages() :
    existing_file = []
    existing_path = []

    list = [_ for _ in os.walk("Images")]
    list.pop(0)

    used = []
    images = []

    with open(f"{JSON_PATH}movies.json", 'r', encoding='utf-8') as f:
        d = loads(f.read())["Titles"]
        for _ in d:
            used.append(_['thumbUrl'].split("/")[3])
            used.append(_["posterUrl"].split("/")[3])
            images.append(_['thumbUrl'])
            images.append(_["posterUrl"])

    with open(f"{JSON_PATH}series.json", 'r', encoding='utf-8') as f:
        d = loads(f.read())["Titles"]
        for _ in d:
            used.append(_['thumbUrl'].split("/")[3])
            used.append(_["posterUrl"].split("/")[3])
            images.append(_['thumbUrl'])
            images.append(_["posterUrl"])

    for f in list:
        if len(f[2]) == 0:
            os.rmdir(f[0])
        else :
            for _ in f[2]:
                if _ in existing_file:
                    if f[0] not in used :
                        os.remove(os.path.join(f[0], _))
                    elif existing_path[existing_file.index(_)] not in used:
                        os.remove(os.path.join(existing_path[existing_file.index(_)], _))                                   
                else :
                    existing_file.append(_)
                    existing_path.append(f[0])


    for _ in images:
        pth = _.split("/Assets/")[1]
        if not os.path.exists(pth):
            p_src = 'http://image.tmdb.org/t/p/w500/' + pth.split("/")[-1]
            if not os.path.exists(os.path.join("Images", pth.split("/")[-2])):
                os.mkdir(os.path.join("Images", pth.split("/")[-2]))
            urlretrieve(p_src, os.path.join("Images", pth.split("/")[-2], pth.split("/")[-1]))

def resetGenres() :
    genres = []

    with open(f"{JSON_PATH}movies.json", 'r', encoding='utf-8') as f:
        d = loads(f.read())["Titles"]
        for _ in d:
            for g in _["genre"].split(", "):
                if g not in genres:
                    genres.append(g)

    with open(f"{JSON_PATH}series.json", 'r', encoding='utf-8') as f:
        d = loads(f.read())["Titles"]
        for _ in d:
            for g in _["genre"].split(", "):
                if g not in genres:
                    genres.append(g)

    with open(f"{JSON_PATH}genres.json", "w", encoding='UTF-8') as f:
        d = loads('{"genres": []}')
        d["genres"] = genres
        dump(d, f, ensure_ascii=False, indent=4)

def addSubTrack():
    with open(f"{JSON_PATH}movies.json", "r", encoding="utf-8") as old:
        movies = loads(old)["Titles"]

    newTitles = loads({ "Titles": [] })

    for movie in movies :

        languages = getAudioLanguages(movie)
        subtitles = getSubLanguages(movie)

        newJson ={
                "title": movie["title"],
                "altTitle": movie["altTitle"],
                "type": movie["type"],
                "description": movie["descritpion"],
                "videoUrl": movie["videoUrl"],
                "thumbUrl": movie["thumbUrl"],
                "posterUrl": movie["posterUrl"],
                "duration": movie["duration"],
                "languages": ", ".join(languages),
                "subtitles": ", ".join(subtitles),
                "seasons":movie["seasons"],
                "genre": movie["genre"]
            }

        newTitles["Titles"].append(newJson)

    with open(f"{JSON_PATH}movies.json", "w", encoding="utf-8") as new:
        dump(newTitles, new, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    print(f'$$ DEV $$\n')
    print(f'JSON PATH : {JSON_PATH}')
    print("""
Options :
1) checkImages
2) resetGenres
3) addSubTracks""")
    choice = input(">>>")
    match choice:
        case "1" :
            checkImages()
        case "2" :
            resetGenres()
        case "3" :
            addSubTrack()
    exit()