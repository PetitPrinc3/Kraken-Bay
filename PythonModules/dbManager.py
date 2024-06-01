from .prints import *
from .krakenConf import *
from .movieFetcher import *
from .showFetcher import *
from .dbPusher import *
import os
from json import loads
import questionary
import mysql.connector
from random import randint

API_KEY = "9ecaae7c8902e24d2fdbe22076eeb79c"
GENRES = loads("""{"genres":[{"id":28,"name":"Action"},{"id":12,"name":"Adventure"},{"id":16,"name":"Animation"},{"id":35,"name":"Comedy"},{"id":80,"name":"Crime"},{"id":99,"name":"Documentary"},{"id":18,"name":"Drama"},{"id":10751,"name":"Family"},{"id":14,"name":"Fantasy"},{"id":36,"name":"History"},{"id":27,"name":"Horror"},{"id":10402,"name":"Music"},{"id":9648,"name":"Mystery"},{"id":10749,"name":"Romance"},{"id":878,"name":"Science Fiction"},{"id":10770,"name":"TV Movie"},{"id":53,"name":"Thriller"},{"id":10752,"name":"War"},{"id":37,"name":"Western"},{"id":10759,"name":"Action & Adventure"},{"id":16,"name":"Animation"},{"id":35,"name":"Comedy"},{"id":80,"name":"Crime"},{"id":99,"name":"Documentary"},{"id":18,"name":"Drama"},{"id":10751,"name":"Family"},{"id":10762,"name":"Kids"},{"id":9648,"name":"Mystery"},{"id":10763,"name":"News"},{"id":10764,"name":"Reality"},{"id":10765,"name":"Sci-Fi & Fantasy"},{"id":10766,"name":"Soap"},{"id":10767,"name":"Talk"},{"id":10768,"name":"War & Politics"},{"id":37,"name":"Western"}]}""")
g_list = loads("""{"genres": []}""")

try:
    client = mysql.connector.connect(host=hostname, user=username, password=password, database=password)
    cursor = client.cursor()
except:
    fail(f"Mysql DB connection failed on host {hostname} with credentials {username}:{password} for database {database}")
    exit(1)

def dbManager():
    actions = [
        "List Users",
        "Update existing User by ID",
        "Create new User",
        "List Media",
        "Update existing Media by ID",
        "Import new Media from JSON",
        "Fetch new medias with JSON comparison",
        "Setup dummy demo",
        "Purge User",
        "Purge Media",
        "Go back to main menu",
    ]

    choice = questionary.select("Select action : ", choices=actions).ask()

    match actions.index(choice):
        case 0 :
            userList()
            dbManager()
        case 1 :
            userUpdate()
            dbManager()
        case 2 :
            dbManager()
        case 3 :
            mediaList()
            dbManager()
        case 4 :
            mediaUpdate()
            dbManager()
        case 5 :
            try:
                warning("Reminder : The data should be arranged as follows.")
                print("""
    JSON_Folder
        ╚═ movies.json 
        ╚═ series.json 
        ╚═ genres.json 
        ╚═ SerieXSOXEPX.json
        ╚═ ...
    """)
                folder = question(f"Select JSON_folder path. (default : {json_fold}) ").strip()
                if folder.strip() == "": 
                    folder = json_fold
                upload_json(folder)
            except:
                fail("Something went wrong.")
            dbManager()
        case 6 :
            movieFetcher(API_KEY)
            showFetcher(API_KEY)
            upload_json()
        case 7 :
            dummy()
            dbManager()
        case 8 :
            userPurge()
            dbManager()
        case 9 :
            mediaPurge()
            dbManager()
        case 10 :
            return
    return


def mediaPurge():
    try:
        sql = 'DELETE FROM Media WHERE id LIKE("%");'
        cursor.execute(sql)
        sql = 'DELETE FROM Serie_EP WHERE id LIKE("%");'
        cursor.execute(sql)
        client.commit()
        success("Purged Media and Serie_EP tables.")
    except:
        fail("Something went wrong.")

def mediaList():
    try:
        sql = 'SELECT id, title FROM Media;'
        cursor.execute(sql)
        success("Found the following media :")
        for _ in cursor.fetchall():
            print(f'[>] id: {_[0]}; title: {_[1]} ')
    except:
        fail("Something went wrong.")

def mediaUpdate():
    try:
        media_id = question("Choose media uuid : ")
        sql = f'SELECT id, type, title, genre, videoUrl, thumbUrl, posterUrl FROM Media where id = "{media_id}";'
        cursor.execute(sql)
        user_data = cursor.fetchall()[0]
        info(f"User id : {user_data[0]}, type : {user_data[1]}, title : {user_data[2]}, genre : {user_data[3]}, video : {user_data[3]}, thumb : {user_data[3]}, poster : {user_data[3]}")
        fields = ["type", "title", "genre", "video", "thumb", "poster", "leave"]
        field = questionary.select("Select field to update : ", choices=fields).ask()
        if field == "leave": return
        value = question(f"What value do you want for media {user_data[0]} in field {field}")
        sql = f'UPDATE Media SET {field}="{value}" WHERE id="{user_data[0]}"'
        cursor.execute(sql)
        client.commit()
        success("Media updated.")
    except:
        fail("Something went wrong.")

def userPurge():
    try:
        sql = 'DELETE FROM User WHERE id LIKE("%");'
        cursor.execute(sql)
        client.commit()
        success("Purged User tables.")
    except:
        fail("Something went wrong.")

def userList():
    try:
        sql = 'SELECT id, email, roles FROM User;'
        cursor.execute(sql)
        success("Found the following users :")
        for _ in cursor.fetchall():
            print(f'[>] id: {_[0]}; email: {_[1]}; roles: {_[2]}; ')
    except:
        fail("Something went wrong.")

def userUpdate():
    try:
        user_id = question("Choose user uuid : ")
        sql = f'SELECT id, email, roles, image FROM User where id = "{user_id}";'
        cursor.execute(sql)
        user_data = cursor.fetchall()[0]
        info(f"User id : {user_data[0]}, email : {user_data[1]}, roles : {user_data[2]}, image : {user_data[3]}")
        fields = ["email", "roles", "image", "leave"]
        field = questionary.select("Select field to update : ", choices=fields).ask()
        if field == "leave": return
        value = question(f"What value do you want for user {user_data[0]} in field {field}")
        sql = f'UPDATE User SET {field}="{value}" WHERE id="{user_data[0]}"'
        cursor.execute(sql)
        client.commit()
        success("User updated.")
    except:
        fail("Something went wrong.")

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
    ╚═ JSON_DMPS
       ╚═ movies.json 
       ╚═ series.json 
       ╚═ genres.json 
          """, 'discreet')
  
    if (not os.path.exists(json_fold)):
        os.mkdir(json_fold)


def dummy(usr = username, pwd = password, dbs = database) :
    for _ in GENRES["genres"]:
        g_list["genres"].append(_["name"])

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