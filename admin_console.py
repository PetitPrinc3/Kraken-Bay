from PythonModules.spinner import *
with spinner("Importing admin modules..."):
    from PythonModules.krakenConf import *
    from PythonModules.prints import *
    from PythonModules.cmd_run import cmd_run 
    from PythonModules.dbManager import *
    import questionary
    import os
    import sys
    import shutil
    from time import sleep
    ptfrm = (sys.platform == 'linux')
    if ptfrm : import netifaces

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

def getIface():
    interfaces  = netifaces.interfaces()
    interface = ""
    for i in interfaces:
        if "wlp" in i or "wlan" in i:
            interface = i
            break
    if interface == "" : return
    strength = os.popen(f'iwconfig {interface} | grep "Link Quality"').read().strip()
    if strength == "": return
    strength = eval(strength.split("=")[1].split(" ")[0])
    if strength < 0.25:
        return("\033[0m[\033[91m\033[1m▂\033[0m▄▆█]")
    elif strength < 0.5:
        return("\033[0m[\033[93m\033[1m▂▄\033[0m▆█]")
    elif strength < 0.75:
        return("\033[0m[\033[94m\033[1m▂▄▆\033[0m█]")
    else:
        return("\033[0m[\033[92m\033[1m▂▄▆█\033[0m]")

def menu():
    print()
    info(f"Found host : \033[91m{hostname}\033[0m , user : \033[91m{username}\033[0m , password : \033[91m{password}\033[0m, database : \033[91m{database}\033[0m ", "discreet")
    if ptfrm :
        netw = getIface()
        if netw :
            info(f"We are online : {netw}", "discreet")
        else :
            warning("We are offline")
    actions = [
        "Restart Web server.",
        "Restart SMB server.",
        "DB Management",
        "Toggle hotspot mode on/off.",
        "Clean upload folder.",
        "Import new files from storage.",
        "Setup dummy demo.",
        "Edit user profile.",
        "Leave."
    ]
    choice = questionary.select("Select action : ", choices=actions).ask()

    match actions.index(choice):
        case 0 :
            return
        case 1 :
            return
        case 2 :
            dbManager()
        case 3 :
            if netw :
                cmd_run("sudo systemctl start create_ap")
                with spinner("Starting hotspot ..."):
                    sleep(5)
            else:
                cmd_run("sudo systemctl stop create_ap")
                cmd_run("sudo nmcli radio wifi on")
                with spinner("Stopping hotspot ..."):
                    sleep(5)
        case 4 :
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
        case 5 :
            return
        case 6 :
            from PythonModules.dbManager import dummy
            dummy(username, password, database)
            success("Dummy demo is up !")
        case 7 :
            return
        case 8 :
            fail("Bye !")
            return
    menu()

if __name__ == "__main__":
    banner()
    menu()