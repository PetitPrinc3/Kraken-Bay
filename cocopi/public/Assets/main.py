from prints import *
import os
import imdb
import requests
from json import loads, dump
import questionary
from urllib.request import urlretrieve
import mysql.connector

API_KEY = "9ecaae7c8902e24d2fdbe22076eeb79c"
GENRES = loads("""{"genres":[{"id":28,"name":"Action"},{"id":12,"name":"Adventure"},{"id":16,"name":"Animation"},{"id":35,"name":"Comedy"},{"id":80,"name":"Crime"},{"id":99,"name":"Documentary"},{"id":18,"name":"Drama"},{"id":10751,"name":"Family"},{"id":14,"name":"Fantasy"},{"id":36,"name":"History"},{"id":27,"name":"Horror"},{"id":10402,"name":"Music"},{"id":9648,"name":"Mystery"},{"id":10749,"name":"Romance"},{"id":878,"name":"Science Fiction"},{"id":10770,"name":"TV Movie"},{"id":53,"name":"Thriller"},{"id":10752,"name":"War"},{"id":37,"name":"Western"},{"id":10759,"name":"Action & Adventure"},{"id":16,"name":"Animation"},{"id":35,"name":"Comedy"},{"id":80,"name":"Crime"},{"id":99,"name":"Documentary"},{"id":18,"name":"Drama"},{"id":10751,"name":"Family"},{"id":10762,"name":"Kids"},{"id":9648,"name":"Mystery"},{"id":10763,"name":"News"},{"id":10764,"name":"Reality"},{"id":10765,"name":"Sci-Fi & Fantasy"},{"id":10766,"name":"Soap"},{"id":10767,"name":"Talk"},{"id":10768,"name":"War & Politics"},{"id":37,"name":"Western"}]}""")
b_path = ""
m_path = b_path + "Movies"
s_path = b_path + "Series"
b_url = "http://127.0.0.1:3000/Assets/"
mysql_srv = "127.0.0.1"
mysql_usr = "cocopi"
mysql_pwd = "cocopi"
mysql_dbs = "cocopi"
json_fold = "JSON_DMPS/"
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
  
    if (not os.path.exists(json_fold)):
        os.mkdir(json_fold)

    # Movie time
    movies = []
    for _ in os.listdir(m_path) :
        if _.split('.')[-1] in valid_extensions:
            movies.append(f'{m_path}/{_}')
    info(f'Found {len(movies)} files in "{m_path}"', 'discreet')

    getall_movies(movies)
    
    success("Done for movies.")

    # Series time
    series = []
    for _ in os.listdir(s_path) :
        if os.path.isdir(f'{s_path}/{_}'):
            series.append(f'{s_path}/{_}')
    info(f'Found {len(series)} files in "{s_path}"', 'discreet')

    getall_series(series)

    data = build_data(json_fold + "movies.json")
    push(data, mysql_srv, mysql_usr, mysql_pwd, mysql_dbs)
    data = build_data(json_fold + "series.json")
    push(data, mysql_srv, mysql_usr, mysql_pwd, mysql_dbs)
    
    for dmp in os.listdir(json_fold):
        if dmp != "movies.json" and dmp != "series.json":
            if "SO0" in dmp:
                data = build_data(json_fold + dmp)
                push_so(data, mysql_srv, mysql_usr, mysql_pwd, mysql_dbs)
            else:
                data = build_data(json_fold + dmp)
                push_ep(data, mysql_srv, mysql_usr, mysql_pwd, mysql_dbs)
        
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
                "seasonCount": "",
                "genre": genres
            }

            data["Titles"].append(json)

    with open(json_fold + 'movies.json', 'w', encoding='utf-8') as f:
        dump(data, f, ensure_ascii=False, indent=4)

def build_data(file):
    with open(file, 'r', encoding='utf-8') as f:
        data = loads(f.read())
    return data

def push(data, m, u, p, d):
    client = mysql.connector.connect(
        host=m,
        user=u,
        password=p,
        database=d,
    )

    cursor = client.cursor()

    sql = f"INSERT INTO Media (id, title, type, description, videoUrl, thumbUrl, duration, seasonCount, genre) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"

    for d in data["Titles"] :
        cursor.execute("SELECT UUID();")
        uuid = cursor.fetchall()[0][0]
        val = (uuid, d["title"], d["type"], d["description"], d["videoUrl"], d["thumbUrl"], d["duration"], d["seasonCount"], d["genre"])
        cursor.execute(sql, val)
        info(f'Inserted {d["title"]}', 'discreet')
    client.commit()

    return

def push_ep(data, m, u, p, d):
    client = mysql.connector.connect(
        host=m,
        user=u,
        password=p,
        database=d,
    )

    if data["Titles"] == []:
        return

    cursor = client.cursor()

    sql = cursor.execute(f"""SELECT id FROM Media WHERE videoUrl = "{data["serieUrl"][0]}";""")
    cursor.execute(sql)
    serieId = cursor.fetchall()[0][0]

    sql = f"INSERT INTO Serie_EP (id, title, serieId, season, episode, videoUrl) VALUES (%s, %s, %s, %s, %s, %s);"

    for d in data["Titles"] :
        cursor.execute("SELECT UUID();")
        uuid = cursor.fetchall()[0][0]
        val = (uuid, d["title"], serieId, d["season"], d["episode"], d["videoUrl"])
        cursor.execute(sql, val)
        info(f'Inserted {d["title"]}', 'discreet')
    client.commit()

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
                "duration": "",
                "seasonCount": str(len(os.listdir(fold))-1),
                "genre": genres
            }

            data["Titles"].append(json)

            seasons = [ _ for _ in os.listdir(fold) if _ != "thumb" ]

            for season in seasons:
                ep_data = loads('{"Titles" : [], "serieUrl": ""}')
                ep_data["serieUrl"] = b_url + fold,
                s_fold = fold + "/" + season
                episodes = os.listdir(s_fold)
                s_number = seasons.index(season)
                info(f'Found {len(episodes)} for season {s_number}')
                for episode in episodes:
                    e_number = episodes.index(episode)
                    e_json = {
                        "title": f"{req['original_name']}: So {s_number+1}, Ep {e_number+1}",
                        "season": str(s_number+1),
                        "episode": str(e_number+1),
                        "videoUrl": b_url + s_fold + "/" + episode,
                    }

                    ep_data["Titles"].append(e_json)
                with open(json_fold + req['original_name'] + 'SO' + str(s_number+1) + '.json', 'w', encoding='utf-8') as f:
                    dump(ep_data, f, ensure_ascii=False, indent=4)

    with open(json_fold + 'series.json', 'w', encoding='utf-8') as f:
        dump(data, f, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    main()