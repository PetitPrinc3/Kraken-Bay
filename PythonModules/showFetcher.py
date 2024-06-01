from .krakenConf import *
from .prints import *
from .mkvInfo import *
from json import loads, dump
from urllib.request import urlretrieve
import requests
import imdb
import uuid
import questionary

GENRES = loads("""{"genres":[{"id":28,"name":"Action"},{"id":12,"name":"Adventure"},{"id":16,"name":"Animation"},{"id":35,"name":"Comedy"},{"id":80,"name":"Crime"},{"id":99,"name":"Documentary"},{"id":18,"name":"Drama"},{"id":10751,"name":"Family"},{"id":14,"name":"Fantasy"},{"id":36,"name":"History"},{"id":27,"name":"Horror"},{"id":10402,"name":"Music"},{"id":9648,"name":"Mystery"},{"id":10749,"name":"Romance"},{"id":878,"name":"Science Fiction"},{"id":10770,"name":"TV Movie"},{"id":53,"name":"Thriller"},{"id":10752,"name":"War"},{"id":37,"name":"Western"},{"id":10759,"name":"Action & Adventure"},{"id":16,"name":"Animation"},{"id":35,"name":"Comedy"},{"id":80,"name":"Crime"},{"id":99,"name":"Documentary"},{"id":18,"name":"Drama"},{"id":10751,"name":"Family"},{"id":10762,"name":"Kids"},{"id":9648,"name":"Mystery"},{"id":10763,"name":"News"},{"id":10764,"name":"Reality"},{"id":10765,"name":"Sci-Fi & Fantasy"},{"id":10766,"name":"Soap"},{"id":10767,"name":"Talk"},{"id":10768,"name":"War & Politics"},{"id":37,"name":"Western"}]}""")

def showFetcher(API_KEY) :
    g_list = loads("""{"genres": []}""")
    if os.path.exists(f'{json_fold}genres.json'):
        existing_genres = open(f'{json_fold}genres.json', 'r', encoding='utf-8').read()
        g_list = loads(existing_genres)

    valid_extensions = ["mp4", "mkv", "avi", "MKV"]

    existing_titles_json = loads('{"Titles" : []}')
    existing_titles = []
    existing_series = []
    if os.path.exists(f"{json_fold}series.json"):
        with open(f"{json_fold}series.json", 'r', encoding='utf-8') as old :
            existing_titles_json = loads(old.read())
            for serie in existing_titles_json["Titles"]:
                existing_titles.append(serie["videoUrl"].split("/")[3])
                existing_series.append({
                    "title": serie["title"],
                    "path": serie["videoUrl"].split("/")[3],
                    "seasons": serie["seasons"].split(",")
                })

    for serie in existing_series:
        seasons = os.listdir(b_path + s_path + serie["path"])
        seasons.sort()
        existing_seasons_path = [b_path + s_path + serie["path"] + "/" + _ for _ in seasons if str(_.split("SO")[-1]).strip() in serie["seasons"]]
        for existing_season in existing_seasons_path:
            exisisting_eps = []
            with open(f"{json_fold}{serie["title"]}SO{os.path.basename(existing_season).split("SO")[-1].strip()}.json", "r", encoding="utf-8") as eps:
                for _ in loads(eps.read())["Titles"] :
                    exisisting_eps.append(os.path.basename(_["videoUrl"]))
            present_eps = os.listdir(existing_season)
            present_eps.sort()
            if len(present_eps) > len(exisisting_eps):
                info(f"Found {len(present_eps) - len(exisisting_eps)} new episodes for {serie["title"]} SO {os.path.basename(existing_season).split("SO")[-1]}")
                ep_data = [] 
                for episode in present_eps:
                    if episode not in exisisting_eps and episode.split('.')[-1] in valid_extensions :
                        ep_url = f"{b_url}{s_path}{os.path.basename(serie["path"])}/{os.path.basename(existing_season)}/{episode}"
                        e_number = present_eps.index(episode)
                        e_json = {
                            "title": f"{serie["title"]}: So {os.path.basename(existing_season).split("SO")[-1]}, Ep {e_number + 1}",
                            "season": str(os.path.basename(existing_season).split("SO")[-1]),
                            "episode": str(e_number + 1),
                            "videoUrl": ep_url,
                        }
                        ep_data.append(e_json)
                with open(f"{json_fold}{serie["title"]}SO{os.path.basename(existing_season).split("SO")[-1].strip()}.json", "r+", encoding="utf-8") as eps:
                    data = loads(eps.read())
                    for _ in ep_data:
                        data["Titles"].append(_)
                with open(f"{json_fold}{serie["title"]}SO{os.path.basename(existing_season).split("SO")[-1].strip()}.json", "w", encoding="utf-8") as eps:
                    dump(data, eps, ensure_ascii=False, indent=4)

        if len(seasons) > len(serie["seasons"]):
            info(f'Found {len(seasons) - len(serie["seasons"])} new seasons for {serie["title"]}')
            for season in seasons:
                s_number = season.split("SO")[-1].strip()
                if s_number not in serie["seasons"]:
                    serie["seasons"].append(s_number)
                    s_fold = b_path + s_path + serie["path"] + "/" + season
                    
                    episodes = os.listdir(s_fold)
                    episodes.sort()
                    ep_data = loads('{"Titles" : [], "serieUrl": ""}')
                    info(f'Found {len(episodes)} for season {s_number}')
                    for episode in episodes:
                        if episode.split('.')[-1] in valid_extensions :
                            ep_url = f"{b_url}{s_path}{os.path.basename(serie["path"])}/{season}/{episode}"
                            e_number = episodes.index(episode)
                            e_json = {
                                "title": f"{serie["title"]}: So {s_number}, Ep {e_number + 1}",
                                "season": str(s_number),
                                "episode": str(e_number + 1),
                                "videoUrl": ep_url,
                            }
                            ep_data["Titles"].append(e_json)
                    ep_data["serieUrl"] = loads(open(f"{json_fold}{serie["title"]}SO{serie["seasons"][0]}.json", "r", encoding="utf-8").read())["serieUrl"]
                    with open(json_fold + serie["title"] + 'SO' + str(s_number) + '.json', 'w', encoding='utf-8') as f:
                        dump(ep_data, f, ensure_ascii=False, indent=4)
            
            serie["seasons"].sort()

    new_series = []
    seasons = os.listdir(b_path + s_path)
    seasons.sort()
    for _ in seasons :
        if os.path.isdir(f'{b_path + s_path}/{_}') and _ not in existing_titles:
            new_series.append(f'{b_path + s_path}/{_}')
    info(f'Found {len(new_series)} files in "{b_path + s_path}"', 'discreet')

    data = loads('{"Titles" : []}')

    for fold in new_series:

            file_id = uuid.uuid4()
            f_fold = f"{b_path}{i_path}/{file_id}"
            os.makedirs(f_fold)

            #Choosing TV Show source
            ia = imdb.IMDb()
            t = question(f"Search for a show: (Default : {os.path.basename(fold)}, / to bypass this file)", 'discreet')        
            if t == "":
                t = os.path.basename(fold)
            if t != "/":    
                series = ia.search_movie(t)
                choices_list = []
                for i in series:
                    get_title = i['title']
                    get_id = i.movieID
                    try:
                        get_year = i['year']
                    except KeyError:
                        pass
                    p = ("{: <10}".format(str(get_id))+ get_title + " " + "(" + str(get_year) + ")")
                    choices_list.append(p)
                if choices_list == [] : return 
            
                serie_list = questionary.select("Oh! there's alot. What did you mean? ", choices=choices_list).ask()
                serie_id = serie_list.split()[0]

                #API data fetch
                URL = 'https://api.themoviedb.org/3/find/tt{0}?api_key={1}&language=en-US&external_source=imdb_id'.format(serie_id, API_KEY)
                req = requests.get(URL).json()['tv_results'][0]
                
                #Thumbnail / Poster data
                try:
                    t_src = 'http://image.tmdb.org/t/p/w500' + req['poster_path']
                    d_path = f_fold + req['poster_path']
                    urlretrieve(t_src, d_path)
                    t_url = f"{b_url}{i_path}{file_id}{req['poster_path']}"
                    p_src = 'http://image.tmdb.org/t/p/w500' + req['backdrop_path']
                    p_path = f_fold + req['backdrop_path']
                    urlretrieve(p_src, p_path)
                    p_url = f"{b_url}{i_path}{file_id}{req['backdrop_path']}"
                except:
                    warning("No poster")
                    t_src = 'http://image.tmdb.org/t/p/w500' + req['backdrop_path']
                    d_path = f_fold + req['backdrop_path']
                    t_url = f"{b_url}{i_path}{file_id}{req['poster_path']}"
                    urlretrieve(t_src, d_path)
                    p_url = ""


                #Genre
                genres = GENRES["genres"]
                list = []
                for _ in req["genre_ids"]:
                    for genre in genres:
                        if _ == genre["id"]:
                            if genre["name"] not in list:
                                list.append(genre["name"])
                                if genre["name"] not in g_list["genres"] : g_list["genres"].append(genre["name"])
                genres = ", ".join(list)

                ovw = req['overview']
                seasons = [ _ for _ in os.listdir(fold) if "SO" in _ ]
                seasons.sort()
                first_ep_url = ""
                subtitles = []
                languages = []
                for season in seasons:
                    ep_data = loads('{"Titles" : [], "serieUrl": ""}')
                    s_fold = fold + "/" + season
                    episodes = os.listdir(s_fold)
                    episodes.sort()
                    s_number = int(season.split("SO")[-1])
                    info(f'Found {len(episodes)} for season {s_number}')
                    for episode in episodes:
                        if episode.split('.')[-1] in valid_extensions :
                            ep_url = f"{b_url}{s_path}{os.path.basename(fold)}/{season}/{episode}"
                            if first_ep_url == "" : 
                                first_ep_url = ep_url
                                #Languages recovery
                                languages = getAudioLanguages(s_fold + "/" + episode)
                                subtitles = getSubLanguages(s_fold + "/" + episode)
                            e_number = episodes.index(episode)
                            e_json = {
                                "title": f"{req['original_name']}: So {s_number}, Ep {e_number + 1}",
                                "season": str(s_number),
                                "episode": str(e_number + 1),
                                "videoUrl": ep_url,
                            }

                            ep_data["Titles"].append(e_json)
                    ep_data["serieUrl"] = first_ep_url,
                    with open(json_fold + req['original_name'] + 'SO' + str(s_number) + '.json', 'w', encoding='utf-8') as f:
                        dump(ep_data, f, ensure_ascii=False, indent=4)
                
                json = {
                    "title": req['original_name'],
                    "altTitle": t,
                    "type": "Series",
                    "description": ovw,
                    "videoUrl": first_ep_url,
                    "thumbUrl": t_url,
                    "posterUrl": p_url,
                    "languages": ", ".join(languages),
                    "subtitles": ", ".join(subtitles),
                    "duration": "",
                    "seasons": ",".join([str(int(_.split("SO")[-1])) for _ in seasons]),
                    "genre": genres
                }

                data["Titles"].append(json)
        
    with open(f'{json_fold}series.json', 'w', encoding='utf-8') as new:
        for _ in data["Titles"]:
            existing_titles_json["Titles"].append(_)
        dump(existing_titles_json, new, ensure_ascii=False, indent=4)

    success("Done for series.")

    with open(json_fold + 'genres.json', 'w', encoding='utf-8') as f:
        dump(g_list, f, ensure_ascii=False, indent=4)