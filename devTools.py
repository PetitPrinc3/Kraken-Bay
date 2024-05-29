import os 
from json import loads, dump
from urllib.request import urlretrieve
from PythonModules.krakenConf import *
from PythonModules.mkvInfo import *
import mysql.connector

ASSETS_PATH = "Kraken - Web/public/Assets/"
JSON_PATH = ASSETS_PATH + "JSON_DMPS/"
MOVIES_PATH = ASSETS_PATH + "Movies/"
SERIES_PATH = ASSETS_PATH + "Movies/"
IMAGE_PATH = ASSETS_PATH + "Images/"

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
        movies = loads(old.read())["Titles"]

    newTitles = loads('{ "Titles": [] }')

    for movie in movies :
        if os.path.basename(movie["videoUrl"]).split(".")[-1].lower() == "mkv":
            languages = getAudioLanguages("Kraken - Web/public" + movie["videoUrl"])
            subtitles = getSubLanguages("Kraken - Web/public" + movie["videoUrl"])
        else:
            languages = ""
            subtitles = ""

        newJson ={
                "title": movie["title"],
                "altTitle": movie["altTitle"],
                "type": movie["type"],
                "description": movie["description"],
                "videoUrl": movie["videoUrl"],
                "thumbUrl": movie["thumbUrl"],
                "posterUrl": movie["posterUrl"],
                "seasons": movie["seasons"],
                "duration": movie["duration"],
                "languages": ", ".join(languages),
                "subtitles": ", ".join(subtitles),
                "genre": movie["genre"]
            }

        newTitles["Titles"].append(newJson)

    with open(f"{JSON_PATH}movies.json", "w", encoding="utf-8") as new:
        dump(newTitles, new, ensure_ascii=False, indent=4)

    with open(f"{JSON_PATH}series.json", "r", encoding="utf-8") as old:
        movies = loads(old.read())["Titles"]

    newTitles = loads('{ "Titles": [] }')

    for movie in movies :
        if os.path.basename(movie["videoUrl"]).split(".")[-1].lower() == "mkv":
            languages = getAudioLanguages("Kraken - Web/public" + movie["videoUrl"])
            subtitles = getSubLanguages("Kraken - Web/public" + movie["videoUrl"])
        else:
            languages = ""
            subtitles = ""

        newJson ={
                "title": movie["title"],
                "altTitle": movie["altTitle"],
                "type": movie["type"],
                "description": movie["description"],
                "videoUrl": movie["videoUrl"],
                "thumbUrl": movie["thumbUrl"],
                "posterUrl": movie["posterUrl"],
                "seasons": movie["seasons"],
                "duration": movie["duration"],
                "languages": ", ".join(languages),
                "subtitles": ", ".join(subtitles),
                "genre": movie["genre"]
            }

        newTitles["Titles"].append(newJson)

    with open(f"{JSON_PATH}series.json", "w", encoding="utf-8") as new:
        dump(newTitles, new, ensure_ascii=False, indent=4)

def remakeSeasons():
    with open(f"{JSON_PATH}series.json", "r", encoding="utf-8") as old:
        movies = loads(old.read())["Titles"]

    newTitles = loads('{ "Titles": [] }')

    for movie in movies :

        client = mysql.connector.connect(host = hostname, user=username, passwd = password, database = database)
        cursor = client.cursor()
        cursor.execute(f"""SELECT id FROM Media WHERE videoUrl="{movie["videoUrl"]}" """)
        serieId = cursor.fetchall()[0][0]
        sql = f"""select season from Serie_EP where serieId="{serieId}" group by season order by season"""
        cursor.execute(sql)
        seasons = ",".join([_[0] for _ in cursor.fetchall()])

        newJson ={
                "title": movie["title"],
                "altTitle": movie["altTitle"],
                "type": movie["type"],
                "description": movie["description"],
                "videoUrl": movie["videoUrl"],
                "thumbUrl": movie["thumbUrl"],
                "posterUrl": movie["posterUrl"],
                "seasons": seasons,
                "duration": movie["duration"],
                "languages": movie["languages"],
                "subtitles": movie["subtitles"],
                "genre": movie["genre"]
            }

        newTitles["Titles"].append(newJson)

    with open(f"{JSON_PATH}series.json", "w", encoding="utf-8") as new:
        dump(newTitles, new, ensure_ascii=False, indent=4)

def remakeVideo():
    with open(f"{JSON_PATH}series.json", "r", encoding="utf-8") as old:
        movies = loads(old.read())["Titles"]

    newTitles = loads('{ "Titles": [] }')

    for movie in movies :

        client = mysql.connector.connect(host = hostname, user=username, passwd = password, database = database)
        cursor = client.cursor()
        cursor.execute(f"""SELECT id, seasons FROM Media WHERE videoUrl="{movie["videoUrl"]}" """)
        res = cursor.fetchall()
        serieId = res[0][0]
        seasons = res[0][1].split(",")[0]
        sql = f"""select videoUrl from Serie_EP where serieId="{serieId}" and season="{seasons}" order by episode"""
        cursor.execute(sql)
        res = cursor.fetchall()
        if len(res) == 0:
            print(sql)
        else:
            video = res[0][0]

        newJson ={
                "title": movie["title"],
                "altTitle": movie["altTitle"],
                "type": movie["type"],
                "description": movie["description"],
                "videoUrl": video,
                "thumbUrl": movie["thumbUrl"],
                "posterUrl": movie["posterUrl"],
                "seasons": movie["seasons"],
                "duration": movie["duration"],
                "languages": movie["languages"],
                "subtitles": movie["subtitles"],
                "genre": movie["genre"]
            }

        newTitles["Titles"].append(newJson)

    with open(f"{JSON_PATH}series.json", "w", encoding="utf-8") as new:
        dump(newTitles, new, ensure_ascii=False, indent=4)

def renameEps():
    dmps = os.listdir(JSON_PATH)
    dmps.pop(dmps.index("movies.json"))
    dmps.pop(dmps.index("series.json"))
    dmps.pop(dmps.index("genres.json"))
    for seso in dmps:
        with open(f'{JSON_PATH}{seso}', 'r', encoding='utf-8') as old:
            eps = loads(old.read())
        new = loads('{"Titles": []}')
        for ep in eps["Titles"]:
            old_t = ep["title"]
            ep_n = str(int(old_t.split(",")[-1].split(" ")[-1]) + 1)
            new_t = ",".join(old_t.split(",")[:-1]) + f", Ep {ep_n}"
            new["Titles"].append({
            "title": new_t,
            "season": ep["season"],
            "episode": ep_n,
            "videoUrl": ep["videoUrl"]
        })
        with open(f'{JSON_PATH}{seso}', 'w', encoding='utf-8') as old:
            dump(new, old, ensure_ascii=False, indent=4)

def checkFolders():
    list = [_ for _ in os.walk(IMAGE_PATH)][0][1]

    used = []
    imgs = []

    try:
        with open(f"{JSON_PATH}movies.json", 'r', encoding='utf-8') as f:
            d = loads(f.read())["Titles"]
            for _ in d:
                used.append(_['thumbUrl'].split("/")[-2])
                imgs.append((_['thumbUrl'], _['posterUrl']))
    except :
        pass

    try:
        with open(f"{JSON_PATH}series.json", 'r', encoding='utf-8') as f:
            d = loads(f.read())["Titles"]
            for _ in d:
                used.append(_['thumbUrl'].split("/")[-2])
                imgs.append((_['thumbUrl'], _['posterUrl']))
    except :
        pass

    for _ in list :
        if _ not in used:
            info(f"Removing {_}")
            for i in os.listdir(os.path.join(IMAGE_PATH, _)):
                os.remove(os.path.join(IMAGE_PATH, _, i))
            os.rmdir(os.path.join(IMAGE_PATH, _))
        if len(os.listdir(os.path.join(IMAGE_PATH, _))) == 0:
            os.rmdir(os.path.join(IMAGE_PATH, _))
            info(f"Dir {_} was empty.")
            list.pop(list.index(_))
    
    for _ in used :
        if _ not in list:
            warning(f"Missing {_}")
            info("Missing imaages :")
            i_ = imgs[used.index(_)]
            os.makedirs(os.path.join(IMAGE_PATH, _))
            t_src = 'http://image.tmdb.org/t/p/w500/' + os.path.basename(i_[0])
            urlretrieve(t_src, os.path.join(IMAGE_PATH, _, os.path.basename(i_[0])))
            info(f"Fetched {os.path.basename(i_[0])}")
            p_src = 'http://image.tmdb.org/t/p/w500/' + os.path.basename(i_[1])
            urlretrieve(p_src, os.path.join(IMAGE_PATH, _, os.path.basename(i_[1])))
            info(f"Fetched {os.path.basename(i_[1])}")

if __name__ == "__main__":
    print(f'$$ DEV $$\n')
    print(f'JSON PATH : {JSON_PATH}')
    print("""
Options :
1) checkImages
2) resetGenres
3) addSubTracks
4) remakeSeasons
5) remakeVideo
6) renameEps
7) checkFolders
          """)
    choice = input(">>>")
    match choice:
        case "1" :
            pass
        case "2" :
            resetGenres()
        case "3" :
            addSubTrack()
        case "4" :
            remakeSeasons()
        case "5":
            remakeVideo()
        case "6":
            renameEps()
        case "7" :
            checkFolders()
    exit()