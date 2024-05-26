from PythonModules.prints import *
import questionary
from PythonModules.cmd_run import cmd_run 
from PythonModules.spinner import *
import os
import shutil

def banner():
    print("""\033[91m
    ██╗  ██╗██████╗  █████╗ ██╗  ██╗███████╗███╗   ██╗
    ██║ ██╔╝██╔══██╗██╔══██╗██║ ██╔╝██╔════╝████╗  ██║
    █████╔╝ ██████╔╝███████║█████╔╝ █████╗  ██╔██╗ ██║
    ██╔═██╗ ██╔══██╗██╔══██║██╔═██╗ ██╔══╝  ██║╚██╗██║
    ██║  ██╗██║  ██║██║  ██║██║  ██╗███████╗██║ ╚████║
    ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝
          \033[0m
    ⚠️  This is the admin console. Use with caution. ⚠️
    """)

def menu():

    with open("Kraken - Web/.env", "r", encoding="utf-8") as inp :
        for line in inp.readlines():
            if 'DATABASE_URL="mysql://' in line:
                data = line.split('DATABASE_URL="mysql://')[1]
                username = data.split(":")[0]
                password = data.split(":")[1].split("@")[0]
                hostname = data.split(":")[1].split("@")[1]
                database = data.split("/")[-1].split('"')[0]
        inp.close()

    print()
    info(f"Found host : \033[91m{hostname}\033[0m , user : \033[91m{username}\033[0m , password : \033[91m{password}\033[0m, database : \033[91m{database}\033[0m ", "discreet")

    actions = [
        "Restart Web server.",
        "Restart SMB server.",
        "Toggle hotspot mode on/off.",
        "Clean upload folder.",
        "Import new files from storage.",
        "Setup dummy demo.",
        "Edit user profile.",
        "Full Media DB flush.",
        "Leave."
    ]
    choice = questionary.select("Select action : ", choices=actions).ask()

    match actions.index(choice):
        case 0 :
            return
        case 1 :
            return
        case 2 :
            return
        case 3 :
            with spinner("Cleaning empty folders ..."):
                for fold in os.listdir("Kraken - Web/public/Assets/PendingUploads"):
                    path = os.path.join("Kraken - Web/public/Assets/PendingUploads", fold)
                    if not os.listdir(path):
                        os.rmdir(path)
            success("Cleaned empty folders.", "discreet")
            if questionary.select("Do you wish to examine non-empty dirs as well ?", choices=["Yes", "No"]).ask() == "Yes":
                for fold in os.listdir("Kraken - Web/public/Assets/PendingUploads"):
                    path = os.path.join("Kraken - Web/public/Assets/PendingUploads", fold)
                    disp = f"{fold}\n"
                    for file in os.listdir(path):
                        if os.path.isfile(os.path.join(path, file)):
                            disp += f"└file : {file}\n"
                        else:
                            disp += f"└folder : {file}\n"
                    print(disp)
                    if question("Remove this folder and its content ? [y/N]", "discreet").lower() == "y":
                        shutil.rmtree(path, ignore_errors=True)
                        success(f'Removed "{path}"', "discreet")
        case 4 :
            return
        case 5 :
            from PythonModules.manager import dummy
            dummy(username, password, database)
            success("Dummy demo is up !")
        case 6 :
            return
        case 7 :
            import mysql.connector
            client = mysql.connector.connect(host=hostname, user=username, password=password, database=database)
            cursor = client.cursor()
            sql = 'DELETE FROM Media WHERE id LIKE("%");'
            cursor.execute(sql)
            sql = 'DELETE FROM Serie_EP WHERE id LIKE("%");'
            cursor.execute(sql)
            client.commit()
            success("Purged Media and Serie_EP tables.")
        case 8 :
            fail("Bye !")
            return
    menu()

if __name__ == "__main__":
    banner()
    menu()