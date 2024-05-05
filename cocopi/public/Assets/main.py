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
b_path = "Movies"
b_url = "http://127.0.0.1:3000/Assets/Movies/"
t_url = "http://127.0.0.1:3000/Assets/Movies/Thumbs"
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
    
    files = []
    f = [os.path.join(i,l) for i, j, k in os.walk(b_path) for l in k]
    for _ in f :
        if _.split('.')[-1] in valid_extensions:
            files.append(_)
    info(f'Found {len(files)} files in "{b_path}"', 'discreet')
    

    #getall(files, b_url, base_path)
    
    data = build_data('data.json')
    push_data(data, mongo_srv, mongo_usr, mongo_pwd)

    success("Done.")

def getall(files, b_url, base_path):

    data = loads('{"Movies" : []}')

    for file in files:


        #Sélection du film
        ia = imdb.IMDb()
        file_nme = os.path.basename(file)
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
            movie_list = questionary.select("Oh! there's alot. What did you mean? ", choices=choices_list).ask()
            movie_id = movie_list.split()[0]

            #Récupération des infos de l'API
            URL = 'https://api.themoviedb.org/3/find/tt{0}?api_key={1}&language=en-US&external_source=imdb_id'.format(movie_id, API_KEY)
            req = requests.get(URL).json()['movie_results'][0]

            #Récupération du thumbnail
            t_src = 'http://image.tmdb.org/t/p/w500/' + req['poster_path']
            t_path = base_path + "/Thumbs"
            s_path = t_path + req['poster_path']

            urlretrieve(t_src, s_path)


            #Définition des genres
            genres = GENRES["genres"]
            list = []
            for _ in req["genre_ids"]:
                for genre in genres:
                    if _ == genre["id"]:
                        if genre["name"] not in list:
                            list.append(genre["name"])
            genres = ";".join(list)

            json = {
                "title": req['original_title'],
                "description": req['overview'],
                "videoUrl": b_url + file_nme,
                "thumbUrl": t_url + req['poster_path'],
                "genre": genres,
                "duration": 0
            }

            data["Movies"].append(json)

    with open('data.json', 'w', encoding='utf-8') as f:
        dump(data, f, ensure_ascii=False, indent=4)

def build_data(file):
    with open(file, 'r', encoding='utf-8') as f:
        data = loads(f.read())
    return data

def push_data(data, m, u, p):
    client = MongoClient(f'mongodb://{u}:{p}@{m}/admin')
    db = client.test
    collection = db.Movie

    for d in data["Movies"] :
        collection.insert_one(d)
        info(f'Inserted {d["title"]}', 'discreet')

    return

if __name__ == "__main__":
    main()