from prints import *
import os
import cv2
import datetime 
import imdb
import requests
from json import loads, dump
import questionary
from pymongo import MongoClient
from urllib.request import urlretrieve

API_KEY = "9ecaae7c8902e24d2fdbe22076eeb79c"
GENRES = loads("""{"genres":[{"id":28,"name":"Action"},{"id":12,"name":"Adventure"},{"id":16,"name":"Animation"},{"id":35,"name":"Comedy"},{"id":80,"name":"Crime"},{"id":99,"name":"Documentary"},{"id":18,"name":"Drama"},{"id":10751,"name":"Family"},{"id":14,"name":"Fantasy"},{"id":36,"name":"History"},{"id":27,"name":"Horror"},{"id":10402,"name":"Music"},{"id":9648,"name":"Mystery"},{"id":10749,"name":"Romance"},{"id":878,"name":"Science Fiction"},{"id":10770,"name":"TV Movie"},{"id":53,"name":"Thriller"},{"id":10752,"name":"War"},{"id":37,"name":"Western"},{"id":10759,"name":"Action & Adventure"},{"id":16,"name":"Animation"},{"id":35,"name":"Comedy"},{"id":80,"name":"Crime"},{"id":99,"name":"Documentary"},{"id":18,"name":"Drama"},{"id":10751,"name":"Family"},{"id":10762,"name":"Kids"},{"id":9648,"name":"Mystery"},{"id":10763,"name":"News"},{"id":10764,"name":"Reality"},{"id":10765,"name":"Sci-Fi & Fantasy"},{"id":10766,"name":"Soap"},{"id":10767,"name":"Talk"},{"id":10768,"name":"War & Politics"},{"id":37,"name":"Western"}]}""")
b_path = ""
m_path = b_path + "Movies"
s_path = b_path + "Series"
b_url = "http://127.0.0.1:3000/Assets/"
mongo_srv = "127.0.0.1"
mongo_usr = "cocopi"
mongo_pwd = "cocopi"
valid_extensions = ["mp4", "mkv", "avi"]

print("""
 ██████╗ ██████╗  ██████╗ ██████╗ ██████╗ ██╗
██╔════╝██╔═══██╗██╔════╝██╔═══██╗██╔══██╗██║
██║     ██║   ██║██║     ██║   ██║██████╔╝██║
██║     ██║   ██║██║     ██║   ██║██╔═══╝ ██║
╚██████╗╚██████╔╝╚██████╗╚██████╔╝██║     ██║
 ╚═════╝ ╚═════╝  ╚═════╝ ╚═════╝ ╚═╝     ╚═╝
                                @PetitPrince
                                """)

def main():
    info("""Files should be organized as follows :

    <Path>
    ╚═ Movies
        ╚═ film1.mp4
           film2.mkv
           ...
    ╚═ Series
       ╚═ Serie1
          ╚═ SO1
             ╚═ EP1
             ╚═ EP2
             ╚═ ...
          ╚═ SO2
          ╚═ ...
          """, 'discreet')
  
    # Movie time
    movies = []
    for _ in os.listdir(m_path) :
        if _.split('.')[-1] in valid_extensions:
            movies.append(f'{m_path}/{_}')
    info(f'Found {len(movies)} files in "{m_path}"', 'discreet')

    getall_movies(movies)
    
    data = build_data('movies.json')
    push(data, mongo_srv, mongo_usr, mongo_pwd)

    success("Done for movies.")

    # Series time
    series = []
    for _ in os.listdir(s_path) :
        if os.path.isdir(f'{s_path}/{_}'):
            series.append(f'{s_path}/{_}')
    info(f'Found {len(series)} files in "{s_path}"', 'discreet')

    getall_series(series)
    data = build_data('series.json')
    push(data, mongo_srv, mongo_usr, mongo_pwd)

    success("Done for series.")

def getall_movies(files):

    data = loads('{"Titles" : []}')

    for file in files:
        
        fold = '.'.join(file.split('.')[:-1]) + '/'

        os.mkdir(fold)
        t_path = fold + "/thumb"
        os.mkdir(t_path)
        os.mkdir(fold + "/tracks")
        file_nme = os.path.basename(file)
        f_path = f'{fold}/{file_nme}'
        os.rename(file, f_path)

        #Sélection du film
        ia = imdb.IMDb()
        t = question(f"Search for a movie: (Default : {file_nme}, / to bypass this file)", 'discreet')        
        if t == "":
            t = file_nme
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
            
            #Récupération des infos de l'API
            URL = 'https://api.themoviedb.org/3/find/tt{0}?api_key={1}&language=en-US&external_source=imdb_id'.format(movie_id, API_KEY)
            req = requests.get(URL).json()['movie_results'][0]

            #Récupération du thumbnail
            try:
                t_src = 'http://image.tmdb.org/t/p/w500/' + req['backdrop_path']
                d_path = t_path + req['poster_path']
                urlretrieve(t_src, d_path)
            except:
                t_src = 'http://image.tmdb.org/t/p/w500/' + req['poster_path']
                d_path = t_path + req['poster_path']
                urlretrieve(t_src, d_path)


            #Définition des genres
            genres = GENRES["genres"]
            list = []
            for _ in req["genre_ids"]:
                for genre in genres:
                    if _ == genre["id"]:
                        if genre["name"] not in list:
                            list.append(genre["name"])
            genres = ", ".join(list)

            ovw = req['overview']
            if len(ovw) > 400:
                while len(ovw) > 400:
                    ovw = ".".join(ovw.split(".").pop())
                ovw += "..."
                if ovw == "...":
                    ovw = req['overview'][:400] + "..."

            json = {
                "title": req['original_title'],
                "type": "Movies",
                "description": ovw,
                "videoUrl": b_url + fold + file_nme,
                "thumbUrl": b_url + fold + "thumb/" + os.path.basename(d_path),
                "duration": "0 minutes",
                "genre": genres
            }

            data["Titles"].append(json)

    with open('movies.json', 'w', encoding='utf-8') as f:
        dump(data, f, ensure_ascii=False, indent=4)

def build_data(file):
    with open(file, 'r', encoding='utf-8') as f:
        data = loads(f.read())
    return data

def push(data, m, u, p):
    client = MongoClient(f'mongodb://{u}:{p}@{m}/admin')
    db = client.test
    collection = db.Media

    for d in data["Titles"] :
        collection.insert_one(d)
        info(f'Inserted {d["title"]}', 'discreet')

    return

def getall_series(folders):

    data = loads('{"Titles" : []}')

    for fold in folders:
        
        t_path = fold + "/thumb"
        try:
            os.mkdir(t_path)
        except:
            pass

        #Sélection du film
        ia = imdb.IMDb()
        t = question(f"Search for a movie: (Default : {os.path.basename(fold)}, / to bypass this file)", 'discreet')        
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

            #Récupération des infos de l'API
            URL = 'https://api.themoviedb.org/3/find/tt{0}?api_key={1}&language=en-US&external_source=imdb_id'.format(serie_id, API_KEY)
            req = requests.get(URL).json()['tv_results'][0]
            
            #Récupération du thumbnail
            try:
                t_src = 'http://image.tmdb.org/t/p/w500/' + req['backdrop_path']
                d_path = t_path + req['poster_path']
                urlretrieve(t_src, d_path)
            except:
                t_src = 'http://image.tmdb.org/t/p/w500/' + req['poster_path']
                d_path = t_path + req['poster_path']
                urlretrieve(t_src, d_path)


            #Définition des genres
            genres = GENRES["genres"]
            list = []
            for _ in req["genre_ids"]:
                for genre in genres:
                    if _ == genre["id"]:
                        if genre["name"] not in list:
                            list.append(genre["name"])
            genres = ", ".join(list)

            ovw = req['overview']
            if len(ovw) > 400:
                while len(ovw) > 400:
                    ovw = ".".join(ovw.split(".").pop())
                ovw += "..."

            json = {
                "title": req['original_name'],
                "type": "Series",
                "description": ovw,
                "videoUrl": b_url + fold,
                "thumbUrl": b_url + fold + "/thumb/" + os.path.basename(d_path),
                "seasonCount": str(len(os.listdir(fold))-1) + " Seasons",
                "genre": genres
            }

            data["Titles"].append(json)

    with open('series.json', 'w', encoding='utf-8') as f:
        dump(data, f, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    main()