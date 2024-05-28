from .krakenConf import *
from .prints import *
from .mkvInfo import *
from json import loads, dump
from moviepy.editor import VideoFileClip
from urllib.request import urlretrieve
import requests
import imdb
import uuid
import questionary

GENRES = loads("""{"genres":[{"id":28,"name":"Action"},{"id":12,"name":"Adventure"},{"id":16,"name":"Animation"},{"id":35,"name":"Comedy"},{"id":80,"name":"Crime"},{"id":99,"name":"Documentary"},{"id":18,"name":"Drama"},{"id":10751,"name":"Family"},{"id":14,"name":"Fantasy"},{"id":36,"name":"History"},{"id":27,"name":"Horror"},{"id":10402,"name":"Music"},{"id":9648,"name":"Mystery"},{"id":10749,"name":"Romance"},{"id":878,"name":"Science Fiction"},{"id":10770,"name":"TV Movie"},{"id":53,"name":"Thriller"},{"id":10752,"name":"War"},{"id":37,"name":"Western"},{"id":10759,"name":"Action & Adventure"},{"id":16,"name":"Animation"},{"id":35,"name":"Comedy"},{"id":80,"name":"Crime"},{"id":99,"name":"Documentary"},{"id":18,"name":"Drama"},{"id":10751,"name":"Family"},{"id":10762,"name":"Kids"},{"id":9648,"name":"Mystery"},{"id":10763,"name":"News"},{"id":10764,"name":"Reality"},{"id":10765,"name":"Sci-Fi & Fantasy"},{"id":10766,"name":"Soap"},{"id":10767,"name":"Talk"},{"id":10768,"name":"War & Politics"},{"id":37,"name":"Western"}]}""")

import os

def movieFetcher(API_KEY) :
    g_list = loads("""{"genres": []}""")
    if os.path.exists(f'{json_fold}genres.json'):
        existing_genres = open(f'{json_fold}genres.json', 'r', encoding='utf-8').read()
        g_list = loads(existing_genres)

    valid_extensions = ["mp4", "mkv", "avi", "MKV"]

    existing_movies_json = loads('{"Titles": []}')
    existing_movies = []
    if os.path.exists(f"{json_fold}movies.json"):
        with open(f"{json_fold}movies.json", 'r', encoding='utf-8') as old :
            existing_movies_json = loads(old.read())
            for movie in existing_movies_json["Titles"]:
                existing_movies.append(os.path.basename(movie["videoUrl"]))
    movies = []

    for _ in os.listdir(b_path + m_path) :
        if _.split('.')[-1] in valid_extensions and _ not in existing_movies:
            movies.append(f'{b_path + m_path}/{_}')
    info(f'Found {len(movies)} files in "{b_path + m_path}"', 'discreet')

    data = loads('{"Titles" : []}')

    for file in movies:

        try:
            file_id = uuid.uuid4()
            f_fold = f"{b_path}{i_path}/{file_id}"
            os.makedirs(f_fold)
            file_nme = file
            search_name = os.path.basename(" ".join(file_nme.split(".")[:-1]))
            if len(search_name.split(" ")) > 4:
                search_name = " ".join(search_name.split(" ")[:5])

            #Choosing film data source
            ia = imdb.IMDb()
            t = question(f"Search for a movie: (Default : {search_name}, / to bypass this file) file name : {file_nme}", 'discreet')        
            if t == "":
                t = search_name
            if t != "/":    
                movies = ia.search_movie(t)
                choices_list = []
                for i in movies:
                    get_title = i['title']
                    get_id = i.movieID
                    try:
                        get_year = i['year']
                    except KeyError:
                        pass
                    p = ("{: <10}".format(str(get_id))+ get_title + " " + "(" + str(get_year) + ")")
                    choices_list.append(p)
                if choices_list == [] : return 
                try:
                    movie_list = questionary.select("Oh! there's alot. What did you mean? ", choices=choices_list).ask()
                    movie_id = movie_list.split()[0]
                except :
                    return
                
                #API data fetch
                URL = 'https://api.themoviedb.org/3/find/tt{0}?api_key={1}&language=en-US&external_source=imdb_id'.format(movie_id, API_KEY)
                req = requests.get(URL).json()['movie_results'][0]

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

                #Duration recovery
                clip = VideoFileClip(f"""{file_nme}""")
                d_sec = clip.duration
                d_min = int(d_sec // 60)
                d_hours = int(d_min // 60)
                if d_hours > 0 :
                    duration = f'{d_hours} h {d_min - 60*d_hours} min'
                else:
                    duration = f'{d_min} min'

                #Languages recovery
                languages = getAudioLanguages(file_nme)
                subtitles = getSubLanguages(file_nme)

                json = {
                    "title": req['original_title'],
                    "altTitle": t,
                    "type": "Movies",
                    "description": ovw,
                    "videoUrl": b_url + m_path + os.path.basename(file_nme),
                    "thumbUrl": t_url,
                    "posterUrl": p_url,
                    "duration": duration,
                    "languages": ", ".join(languages),
                    "subtitles": ", ".join(subtitles),
                    "seasons": "",
                    "genre": genres
                }

                data["Titles"].append(json)

        except:
            warning(f'Something went wrong for {movie}')

    with open(f'{json_fold}movies.json', 'w', encoding='utf-8') as new:
        for _ in data["Titles"]:
            existing_movies_json["Titles"].append(_)
        dump(existing_movies_json, new, ensure_ascii=False, indent=4)
    
    success("Done for movies.")

    with open(json_fold + 'genres.json', 'w', encoding='utf-8') as f:
        dump(g_list, f, ensure_ascii=False, indent=4)