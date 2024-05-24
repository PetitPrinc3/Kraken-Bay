from .prints import *
import os
import imdb
import requests
from json import loads, dump
import questionary
from urllib.request import urlretrieve
from moviepy.editor import VideoFileClip
import mysql.connector
import uuid
import argparse
from random import randint

API_KEY = "9ecaae7c8902e24d2fdbe22076eeb79c"
GENRES = loads("""{"genres":[{"id":28,"name":"Action"},{"id":12,"name":"Adventure"},{"id":16,"name":"Animation"},{"id":35,"name":"Comedy"},{"id":80,"name":"Crime"},{"id":99,"name":"Documentary"},{"id":18,"name":"Drama"},{"id":10751,"name":"Family"},{"id":14,"name":"Fantasy"},{"id":36,"name":"History"},{"id":27,"name":"Horror"},{"id":10402,"name":"Music"},{"id":9648,"name":"Mystery"},{"id":10749,"name":"Romance"},{"id":878,"name":"Science Fiction"},{"id":10770,"name":"TV Movie"},{"id":53,"name":"Thriller"},{"id":10752,"name":"War"},{"id":37,"name":"Western"},{"id":10759,"name":"Action & Adventure"},{"id":16,"name":"Animation"},{"id":35,"name":"Comedy"},{"id":80,"name":"Crime"},{"id":99,"name":"Documentary"},{"id":18,"name":"Drama"},{"id":10751,"name":"Family"},{"id":10762,"name":"Kids"},{"id":9648,"name":"Mystery"},{"id":10763,"name":"News"},{"id":10764,"name":"Reality"},{"id":10765,"name":"Sci-Fi & Fantasy"},{"id":10766,"name":"Soap"},{"id":10767,"name":"Talk"},{"id":10768,"name":"War & Politics"},{"id":37,"name":"Western"}]}""")
g_list = loads("""{"genres": []}""")
b_path = "public/Assets/"
m_path = b_path + "Movies"
s_path = b_path + "Series"
i_path = b_path + "Images"
b_url = "/Assets/"
mysql_srv = "127.0.0.1"
mysql_usr = "kraken"
mysql_pwd = "kraken"
mysql_dbs = "kraken"
json_fold = b_path + "JSON_DMPS/"
valid_extensions = ["mp4", "mkv", "avi", "MKV"]

def banner():
    print("""
    ██╗  ██╗██████╗  █████╗ ██╗  ██╗███████╗███╗   ██╗
    ██║ ██╔╝██╔══██╗██╔══██╗██║ ██╔╝██╔════╝████╗  ██║
    █████╔╝ ██████╔╝███████║█████╔╝ █████╗  ██╔██╗ ██║
    ██╔═██╗ ██╔══██╗██╔══██║██╔═██╗ ██╔══╝  ██║╚██╗██║
    ██║  ██╗██║  ██║██║  ██║██║  ██╗███████╗██║ ╚████║
    ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝
                                        @PetitPrince
                                    """)

def prepare():
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

    if os.path.exists(f'{json_fold}/genres.json'):
        existing_genres = open(f'{json_fold}/genres.json', 'r', encoding='utf-8').read()
        g_list = loads(existing_genres)

    existing_movies_json = loads('{"Titles": []}')
    existing_movies = []
    if os.path.exists(f"{json_fold}/movies.json"):
        with open(f"{json_fold}/movies.json", 'r', encoding='utf-8') as old :
            existing_movies_json = loads(old.read())
            for movie in existing_movies_json["Titles"]:
                existing_movies.append(os.path.basename(movie["videoUrl"]))

    # Movie time
    movies = []
    for _ in os.listdir(m_path) :
        if _.split('.')[-1] in valid_extensions and _ not in existing_movies:
            movies.append(f'{m_path}/{_}')
    info(f'Found {len(movies)} files in "{m_path}"', 'discreet')

    res = getall_movies(movies)

    with open(f'{json_fold}/movies.json', 'w', encoding='utf-8') as new:
        for _ in res["Titles"]:
            existing_movies_json["Titles"].append(_)
        dump(existing_movies_json, new, ensure_ascii=False, indent=4)
    
    success("Done for movies.")

    # Series time
    existing_series_json = loads('{"Titles" : []}')
    existing_series = []
    if os.path.exists(f"{json_fold}/series.json"):
        with open(f"{json_fold}/series.json", 'r', encoding='utf-8') as old :
            existing_series_json = loads(old.read())
            for serie in existing_series_json["Titles"]:
                existing_series.append(os.path.basename(serie["videoUrl"]))

    series = []
    for _ in os.listdir(s_path) :
        if os.path.isdir(f'{s_path}/{_}') and _ not in existing_series:
            series.append(f'{s_path}/{_}')
    info(f'Found {len(series)} files in "{s_path}"', 'discreet')

    res = getall_series(series)

    with open(f'{json_fold}/series.json', 'w', encoding='utf-8') as new:
        for _ in res["Titles"]:
            existing_series_json["Titles"].append(_)
        dump(existing_series_json, new, ensure_ascii=False, indent=4)

    success("Done for series.")

    with open(json_fold + 'genres.json', 'w', encoding='utf-8') as f:
        dump(g_list, f, ensure_ascii=False, indent=4)

def upload():   

    data = build_data(f'{json_fold}/movies.json')
    push(data, mysql_srv, mysql_usr, mysql_pwd, mysql_dbs)
    data = build_data(f'{json_fold}/series.json')
    push(data, mysql_srv, mysql_usr, mysql_pwd, mysql_dbs)

    for json_file in os.listdir(json_fold):
        data = build_data(f'{json_fold}/{json_file}')
        if json_file == "genres.json" :
            push_genre(data, mysql_srv, mysql_usr, mysql_pwd, mysql_dbs)
        elif json_file not in ["movies.json", "series.json"] :
            push_ep(data, mysql_srv, mysql_usr, mysql_pwd, mysql_dbs)


def dummy(usr, pwd, dbs) :
    client = mysql.connector.connect(
        host=mysql_srv,
        user=usr,
        password=pwd,
        database=dbs,
    )

    cursor = client.cursor()

    for _ in GENRES["genres"]:
        g_list["genres"].append(_["name"])
    data = loads('{"Titles" : []}')

    for j in range (randint(10,40)):
        type = ["Movies", "Series"][randint(0,1)]
        seasons = list(set([str(randint(1,5)) for i in range(randint(1,5))]))
        json = {
            "title": "Big Buck Dummy",
            "altTitle": "",
            "type": type,
            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi auctor volutpat ipsum, at ultrices magna. Aliquam sed sem tempus, ullamcorper urna quis, hendrerit elit. Aliquam vestibulum ipsum accumsan, tempor magna faucibus, dignissim est. Morbi pharetra sodales consequat. Etiam lobortis elit sem, nec varius sapien fermentum nec. Duis maximus elit ut lorem porttitor aliquam. Nulla sed lectus ante. Maecenas ullamcorper, orci vitae convallis malesuada, nisl neque venenatis urna, et suscipit nunc leo non lorem. Aliquam erat volutpat. Aliquam feugiat bibendum gravida. Aliquam erat volutpat. Maecenas eu consectetur enim, non vestibulum enim. Etiam in mi vitae lacus maximus blandit eget ut ante. Interdum et malesuada fames ac ante ipsum primis in faucibus. Etiam luctus volutpat urna at tempor. Suspendisse vehicula, odio a scelerisque porttitor, urna dolor condimentum lectus, aliquet porttitor ex neque volutpat justo.",
            "videoUrl": "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
            "thumbUrl": "/Assets/Images/Dummy/Big Buck Dummy.jpg",
            "posterUrl": "/Assets/Images/Dummy/Big Buck Poster.png",
            "duration": "1 h 10 min",
            "seasons": ",".join(seasons),
            "genre": ", ".join([g_list["genres"][_] for _ in [randint(0, len(g_list["genres"]) - 1) for i in range(randint(0, 5))]])
        }

        sql = f"INSERT INTO Media (id, title, altTitle, type, description, videoUrl, thumbUrl, posterUrl, duration, seasons, genre) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"

        cursor.execute("SELECT UUID();")
        uuid = cursor.fetchall()[0][0]
        val = (uuid, json["title"], json["altTitle"], json["type"], json["description"], json["videoUrl"], json["thumbUrl"], json["posterUrl"], json["duration"], json["seasons"], json["genre"])
        cursor.execute(sql, val)
        info(f'Inserted {json["title"]}', 'discreet')
        client.commit()

        if type == "Series":

            for season in seasons:
                ep_data = loads('{"Titles" : [], "serieUrl": ""}')
                ep_data["serieId"] = uuid,
                episode_count = randint(2,10)
                for episode in range(episode_count):
                    e_json = {
                        "title": f"Dummy Serie : So {season}, Ep {episode +1}",
                        "season": str(season),
                        "episode": str(episode + 1),
                        "videoUrl": "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
                    }

                    ep_data["Titles"].append(e_json)

                sql = f"INSERT INTO Serie_EP (id, title, serieId, season, episode, videoUrl) VALUES (%s, %s, %s, %s, %s, %s);"

                for d in ep_data["Titles"] :
                    cursor.execute("SELECT UUID();")
                    c_uuid = cursor.fetchall()[0][0]
                    val = (c_uuid, d["title"], uuid, d["season"], d["episode"], d["videoUrl"])
                    cursor.execute(sql, val)
                    info(f'Inserted {d["title"]}', 'discreet')
                client.commit()
                



    for genre in g_list["genres"]:
        sql = cursor.execute(f"""SELECT genre FROM Genres WHERE genre = "{genre}";""")
        cursor.execute(sql)

        if len(cursor.fetchall()) == 0:
            cursor.execute("SELECT UUID();")
            uuid = cursor.fetchall()[0][0]
            sql = f"""INSERT INTO Genres (id, genre) VALUES ("{uuid}", "{genre}");"""
            cursor.execute(sql)
        client.commit()


    return
    


def build_data(file):
    with open(file, 'r', encoding='utf-8') as f:
        data = loads(f.read())
    return data


def getall_movies(files):

    data = loads('{"Titles" : []}')

    for file in files:
        try:
            file_id = uuid.uuid4()
            f_fold = f"{i_path}/{file_id}"
            os.makedirs(f_fold)
            file_nme = file
            search_name = os.path.basename(" ".join(file_nme.split(".")[:-1]))
            if len(search_name.split(" ")) > 4:
                search_name = " ".join(search_name.split(" ")[:5])
            #Sélection du film
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
                
                #Récupération des infos de l'API
                URL = 'https://api.themoviedb.org/3/find/tt{0}?api_key={1}&language=en-US&external_source=imdb_id'.format(movie_id, API_KEY)
                req = requests.get(URL).json()['movie_results'][0]

                #Récupération du thumbnail
                try:
                    t_src = 'http://image.tmdb.org/t/p/w500/' + req['poster_path']
                    d_path = f_fold + req['poster_path']
                    urlretrieve(t_src, d_path)
                    t_url = b_url + f_fold + req['poster_path']
                    p_src = 'http://image.tmdb.org/t/p/w500/' + req['backdrop_path']
                    p_path = f_fold + req['backdrop_path']
                    urlretrieve(p_src, p_path)
                    p_url = b_url + f_fold + req['backdrop_path']
                except:
                    warning("No poster")
                    t_src = 'http://image.tmdb.org/t/p/w500/' + req['backdrop_path']
                    d_path = f_fold + req['backdrop_path']
                    t_url = b_url + f_fold + req['backdrop_path']
                    urlretrieve(t_src, d_path)
                    p_url = ""


                #Définition des genres
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

                clip = VideoFileClip(f"""{file_nme}""")
                d_sec = clip.duration
                d_min = int(d_sec // 60)
                d_hours = int(d_min // 60)
                if d_hours > 0 :
                    duration = f'{d_hours} h {d_min - 60*d_hours} min'
                else:
                    duration = f'{d_min} min'

                json = {
                    "title": req['original_title'],
                    "altTitle": t,
                    "type": "Movies",
                    "description": ovw,
                    "videoUrl": b_url + file_nme,
                    "thumbUrl": t_url,
                    "posterUrl": p_url,
                    "duration": duration,
                    "seasons": "",
                    "genre": genres
                }

                data["Titles"].append(json)

        except: 
            warning(f"Something went wrong for {file}")

    return data


def push(data, m, u, p, d):
    client = mysql.connector.connect(
        host=m,
        user=u,
        password=p,
        database=d,
    )

    cursor = client.cursor()

    sql = f"INSERT INTO Media (id, title, altTitle, type, description, videoUrl, thumbUrl, posterUrl, duration, seasons, genre) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"

    for d in data["Titles"] :
        cursor.execute("SELECT UUID();")
        uuid = cursor.fetchall()[0][0]
        val = (uuid, d["title"], d["altTitle"], d["type"], d["description"], d["videoUrl"], d["thumbUrl"], d["posterUrl"], d["duration"], d["seasons"], d["genre"])
        cursor.execute(sql, val)
        info(f'Inserted {d["title"]}', 'discreet')
    client.commit()

    return

def push_genre(data, m, u, p, d):
    client = mysql.connector.connect(
        host=m,
        user=u,
        password=p,
        database=d,
    )

    cursor = client.cursor()

    for genre in data["genres"]:
        sql = cursor.execute(f"""SELECT genre FROM Genres WHERE genre = "{genre}";""")
        cursor.execute(sql)

        if len(cursor.fetchall()) == 0:
            cursor.execute("SELECT UUID();")
            uuid = cursor.fetchall()[0][0]
            sql = f"""INSERT INTO Genres (id, genre) VALUES ("{uuid}", "{genre}");"""
            cursor.execute(sql)
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

        try:
        
            file_id = uuid.uuid4()
            f_fold = f"{i_path}/{file_id}"
            os.makedirs(f_fold)

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
                    t_src = 'http://image.tmdb.org/t/p/w500/' + req['poster_path']
                    d_path = f_fold + req['poster_path']
                    urlretrieve(t_src, d_path)
                    t_url = b_url + f_fold + req['poster_path']
                    p_src = 'http://image.tmdb.org/t/p/w500/' + req['backdrop_path']
                    p_path = f_fold + req['backdrop_path']
                    urlretrieve(p_src, p_path)
                    p_url = b_url + f_fold + req['backdrop_path']
                except:
                    warning("No Poster")
                    t_src = 'http://image.tmdb.org/t/p/w500/' + req['backdrop_path']
                    d_path = f_fold + req['backdrop_path']
                    p_url = b_url + f_fold + "/" + req['backdrop_path']
                    urlretrieve(t_src, d_path)
                    t_url = p_url


                #Définition des genres
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
                seasons = [ _[2:] for _ in os.listdir(fold) if "SO" in _ ]



                first_ep_url = ""
                for season in seasons:
                    ep_data = loads('{"Titles" : [], "serieUrl": ""}')
                    ep_data["serieUrl"] = b_url + fold,
                    s_fold = fold + "/" + season
                    episodes = os.listdir(s_fold)
                    if len(season.split(" "))>1:
                        s_number = int(season.split(" ")[-1])
                    else:
                        s_number = int(season)
                    info(f'Found {len(episodes)} for season {s_number}')
                    for episode in episodes:
                        if first_ep_url == "" : first_ep_url = b_url + s_fold + "/" + episode
                        e_number = episodes.index(episode)
                        e_json = {
                            "title": f"{req['original_name']}: So {s_number}, Ep {e_number + 1}",
                            "season": str(s_number),
                            "episode": str(e_number + 1),
                            "videoUrl": b_url + s_fold + "/" + episode,
                        }

                        ep_data["Titles"].append(e_json)
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
                    "duration": "",
                    "seasons": ",".join(seasons),
                    "genre": genres
                }

                data["Titles"].append(json)
        
        except: 
            warning(f"Something wrong happend for {fold}")

    return data

if __name__ == "__main__":
    banner()

    parser = argparse.ArgumentParser(
                    prog='Media SETUP',
                    description='prepares your files and what not for cocopi and uploads to your mysql db',
                    epilog='')
    parser.add_argument('-d', '--dummy',action='store_true')      # option that takes a value
    parser.add_argument('-p', '--prepare',action='store_true')      # option that takes a value
    parser.add_argument('-u', '--upload',action='store_true')
    parser.add_argument('-a', '--all',action='store_true')

    args = parser.parse_args()

    if args.dummy:
        dummy(mysql_usr, mysql_pwd, mysql_dbs)
    if args.prepare :
        prepare()
    if args.upload :
        upload()
    if args.all :
        prepare()
        upload()
