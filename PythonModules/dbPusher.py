from .prints import *
from .krakenConf import *
from json import loads
import mysql.connector
import os

def upload_json(folder = json_fold):   

    data = build_data(f'{folder}/movies.json')
    push(data, mysql_srv, mysql_usr, mysql_pwd, mysql_dbs)
    data = build_data(f'{folder}/series.json')
    push(data, mysql_srv, mysql_usr, mysql_pwd, mysql_dbs)

    for json_file in os.listdir(folder):
        data = build_data(f'{folder}/{json_file}')
        if json_file == "genres.json" :
            push_genre(data, mysql_srv, mysql_usr, mysql_pwd, mysql_dbs)
        elif json_file not in ["movies.json", "series.json"] :
            push_ep(data, mysql_srv, mysql_usr, mysql_pwd, mysql_dbs)

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