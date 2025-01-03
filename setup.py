from threading import Thread
from time import sleep, time
from itertools import cycle
import subprocess

class spinner:
    def __init__(self, desc='Processing...', timeout=0.1, old=False):
        self.desc = desc
        self.timeout = timeout
        self._thread = Thread(target=self._animate, daemon=True)
        self.steps = ["[⢿]", "[⣻]", "[⣽]", "[⣾]", "[⣷]", "[⣯]", "[⣟]", "[⡿]"]
        if old: self.steps = ["[-]", "[\\]", "[|]", "[/]"]
        self.done = False

    def start(self):
        self._thread.start()
        return self

    def _animate(self):
        for _ in cycle(self.steps):
            if self.done:
                break
            print(f"\r{_} {self.desc}", flush=True, end="\r")
            sleep(self.timeout)

    def __enter__(self):
        self.start()

    def stop(self):
        print(' '*(len(self.desc) + 5), end="\r")
        self.done = True

    def __exit__(self, exc_type, exc_value, tb):
        self.stop()


try:
    with spinner("Importing python libraries..."):
        import os
        import sys
        import bcrypt
        import uuid
        import mysql.connector
        from datetime import datetime
        import questionary

except:
    print("Library import failed.")
    print("Please install required libraries running 'pip install -r requirements.txt'.")
    exit()

print("""\033[91m
    ██╗  ██╗██████╗  █████╗ ██╗  ██╗███████╗███╗   ██╗
    ██║ ██╔╝██╔══██╗██╔══██╗██║ ██╔╝██╔════╝████╗  ██║
    █████╔╝ ██████╔╝███████║█████╔╝ █████╗  ██╔██╗ ██║
    ██╔═██╗ ██╔══██╗██╔══██║██╔═██╗ ██╔══╝  ██║╚██╗██║
    ██║  ██╗██║  ██║██║  ██║██║  ██╗███████╗██║ ╚████║
    ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝
          \033[0m                Kraken setup by @PetitPrinc3
    """)

# Print green
def success(text, style = "classic", time = False):  
    
    if time: time = "[" + str(datetime.now().strftime("%H:%M:%S")) + "]"
    else: time = ''
    if style == 'classic': text = '[+]' + time + ' \033[92m' + str(text) + '\033[0m'
    if style == 'discreet': text = '[\033[92m\033[1m+\033[0m]' + time + ' ' + str(text)
    
    print(text)

# Print blue
def info(text, style = "classic", time = False):  
    if time: time = "[" + str(datetime.now().strftime("%H:%M:%S")) + "]"
    else: time = ''
    if style == 'classic': text = '[*]' + time + ' \033[94m' + str(text) + '\033[0m'
    if style == 'discreet': text = '[\033[94m\033[1m*\033[0m]' + time + ' ' + str(text)
    
    print(text)

# Print blue updating current row
def infor(text, style = "classic", time = False):  
    if time: time = "[" + str(datetime.now().strftime("%H:%M:%S")) + "]"
    else: time = ''
    if style == 'classic': text = '[*]' + time + ' \033[94m' + str(text) + '\033[0m'
    if style == 'discreet': text = '[\033[94m\033[1m*\033[0m]' + time + ' ' + str(text)
    
    print(text, end = '\r')

# Print orange
def warning(text, style = "classic", time = False):  
    if time: time = "[" + str(datetime.now().strftime("%H:%M:%S")) + "]"
    else: time = ''
    if style == 'classic': text = '[!]' + time + ' \033[93m' + str(text) + '\033[0m'
    elif style == 'discreet': text = '[\033[93m\033[1m!\033[0m]' + time + ' ' + str(text)

    print(text)

# Print red
def fail(text, style = "classic", time = False):  
    if time: time = "[" + str(datetime.now().strftime("%H:%M:%S")) + "]"
    else: time = ''
    if style == 'classic': text = '[-]' + time + ' \033[91m' + text + '\033[0m'
    elif style == 'discreet': text = '[\033[91m\033[1m-\033[0m]' + time + ' ' + str(text)

    print(text)

# Print ?
def question(text, style = "classic", time = False):
    if time: time = "[" + str(datetime.now().strftime("%H:%M:%S")) + "]"
    else: time = ''
    if style == 'classic': text = '[?]' + time + ' \033[94m' + str(text) + '\033[0m'
    if style == 'discreet': text = '[\033[94m\033[1m?\033[0m]' + time + ' ' + str(text)

    print(text)
    return input("[\033[94m\033[1m>\033[0m] ")

def cmd_run(cmd, succ = "", err = "", critical = False, show_outp = False):
    try:
        if show_outp:
            if subprocess.Popen(cmd, shell=True, stderr=subprocess.PIPE).wait(timeout=300) != 0:
                warning('Process failed once. Trying again.')
                try:
                    if subprocess.Popen(cmd, shell=True, stderr=subprocess.PIPE).wait(timeout=300) != 0:
                        fail('Process failed. This is critical.                                                  ')
                        if err != "" : warning(err)
                        if critical: exit()
                        return 1
                except subprocess.TimeoutExpired:
                        fail('Command timed out. This is critical.                                               ')
                        if err != "" : warning(err)
                        if critical: exit()
                        return 1
        else:
            if subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE).wait(timeout=300) != 0:
                warning('Process failed once. Trying again.')
                try:
                    if subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE).wait(timeout=300) != 0:
                        fail('Process failed. This is critical.                                                  ')
                        if err != "" : warning(err)
                        if critical: exit()
                        return 1
                except subprocess.TimeoutExpired:
                        fail('Command timed out. This is critical.                                               ')
                        if err != "" : warning(err)
                        if critical: exit()
                        return 1
    except subprocess.TimeoutExpired:
        warning('Command timed out. Trying again.')
        try:
            if show_outp:
                if subprocess.Popen(cmd, shell=True, stderr=subprocess.PIPE).wait(timeout=300) != 0:
                    fail('Process failed. This is critical.')
                    if err != "" : warning(err)
                    if critical: exit()
                    return 1
            else:
                if subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE).wait(timeout=300) != 0:
                    fail('Process failed. This is critical.')
                    if err != "" : warning(err)
                    if critical: exit()
                    return 1
        except subprocess.TimeoutExpired:
                fail('Command timed out twice. This is critical.')
                if err != "" : warning(err)
                if critical: exit()
                return 1
    if succ != "" : success(succ)
    return 0

def replace_line(file, line, value):
    with open(file, "r") as inp :
        filedata = inp.readlines()
        inp.close()
    if type(line) == list:
        for _ in range(len(line)):
            for l in range(len(filedata)):
                if filedata[l].startswith(line[_]):
                    filedata[l] = value[_] + "\n"
    else:
        for l in range(len(filedata)):
            if filedata[l].startswith(line):
                    filedata[l] = value + "\n"
    with open(file, "w") as out :
        out.writelines(filedata)
        out.close()

def replace_field(file, field, value):
    with open(file, "r") as inp :
        filedata = inp.readlines()
        inp.close()
    if type(field) == list:
        for _ in range(len(field)):
            for l in range(len(filedata)):
                if field[_] in filedata[l]:
                    line = filedata[l].split(field[_])
                    line.pop()
                    line.append(value[_] + "\n")
                    filedata[l] = field[_].join(line)
    else:
        for l in range(len(filedata)):
            if field in filedata[l]:
                line = filedata[l].split(field)
                line.pop()
                line.append(value + "\n")
                filedata[l] = field.join(line)
    with open(file, "w") as out :
        out.writelines(filedata)
        out.close()

ptfrm = sys.platform

if not hasattr(os, "geteuid"):
    warning("This program was meant to be run as r00t on a unix system.")
    if 'win' in ptfrm:
        warning("Switching to windows installation.")
        ptfrm = "win"
        if question("Are you running this as administrator ? [Y/n]").strip().lower() != "y":
            fail("Please restart the software as administrator.")
            exit(1)
elif (ptfrm == 'linux') and (os.geteuid() != 0):
    fail("This program must be run as r00t !")
    exit(1) 
elif (ptfrm == 'linux') and (os.geteuid() == 0):
    success("Running as r00t on linux, let's go !")
else:
    warning("This program should be run as r00t on a unix system.")
    fail("Could not determine your platform.")
    exit()

hostname = "kraken.local"
username = "kraken"
password = "kraken"
database = "kraken"
file_path = "/mnt/Kraken/Assets"
srv_port = "8080"

info(f"Using hostname      : {hostname}")
info(f"Using username      : {username}")
info(f"Using password      : {password}")
info(f"Using database      : {database}")
info(f"Using assets from   : {file_path}")
info(f"Using File srv port : {srv_port}")
info(f"Using Web srv path  : {os.path.join(os.getcwd(), "KrakenWeb")}")

replace_field("Docker/docker-compose.yml", ["MYSQL_ROOT_PASSWORD: ", "MYSQL_DATABASE: ", "MYSQL_USER: ", "MYSQL_PASSWORD: "], [str(uuid.uuid4()), database, username, password])
replace_line("Docker/docker-compose.yml", "      - /mnt/Kraken/Assets:/media/Assets:ro", f'      - {file_path}:/media/Assets:ro')
replace_line("Docker/docker-compose.yml", "      - '8080:8080'", f"      - '{srv_port}:{srv_port}'")
replace_field("Docker/nginx/nginx.conf", "listen ", f"{srv_port};")
replace_line("KrakenWeb/.env", "DATABASE_URL=", f'DATABASE_URL="mysql://{username}:{password}@localhost:3306/{database}"')
replace_line("KrakenWeb/.env", "NEXTAUTH_JWT_SECRET=", f'NEXTAUTH_JWT_SECRET="{str(uuid.uuid4())}"')
replace_line("KrakenWeb/.env", "NEXTAUTH_SECRET=", f'NEXTAUTH_SECRET="{str(uuid.uuid4())}"')
replace_line("KrakenWeb/.env", "NEXTAUTH_URL=", f'NEXTAUTH_URL="http://{hostname}"')
replace_line("KrakenWeb/.env", "MEDIA_STORE_PATH=", f'MEDIA_STORE_PATH="{file_path}"')
replace_line("KrakenWeb/.env", "MEDIA_SRV_URL=", f'MEDIA_SRV_URL="http://{hostname}:{srv_port}"')

info("Installing npm...")
if ptfrm == "linux" : cmd_run("sudo DEBIAN_FRONTEND=noninteractive apt install -y npm", show_outp=True)
else : warning("Make sure you installed npm.")

info("Installing mysql-client...")
if ptfrm == "linux" : cmd_run("sudo DEBIAN_FRONTEND=noninteractive apt install -y mysql-client", show_outp=True)
else : warning("Make sure you installed mysql-client.")

info("Installing docker-compose...")
with spinner("Installing docker-compose..."):
    if ptfrm != "linux" : 
        warning("Make sure you installed docker-compse.")
        quit
    cmd_run("sudo DEBIAN_FRONTEND=noninteractive apt install -y ca-certificates curl", "Step 1/8 Ok.                                               ")
    cmd_run("sudo install -m 0755 -d /etc/apt/keyrings", "Step 2/8 Ok.                                               ")
    cmd_run("sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc", "Step 3/8 Ok.                                               ")
    cmd_run("sudo chmod a+r /etc/apt/keyrings/docker.asc", "Step 4/8 Ok.                                               ")
    cmd_run('echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null', "Step 5/8 Ok.                                               ")    
    cmd_run("sudo DEBIAN_FRONTEND=noninteractive apt update -y", "Step 6/8 Ok.                                               ")
    cmd_run("sudo DEBIAN_FRONTEND=noninteractive apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin", "Step 7/8 Ok.                                               ")
    cmd_run("sudo service docker start", "Step 8/8 Ok.                                               ")

success("Installed npm, docker and mysql.")

with spinner("Ensuring hostname..."):
    cmd_run(f"hostnamectl set-hostname {hostname}", f"Hostname registered as {hostname}.")

info("Creating mysql & nginx containers...")
cmd_run("cd Docker && sudo docker compose up -d", "Created mysql & nginx containers.", "Did you install docker ?", critical=True, show_outp=True)
with spinner("Installing node packages."):
    cmd_run('cd "KrakenWeb" && npm i', "Node packages installed.  ", 'Failed to install node packages. Please cd into "KrakenWeb" and run > npm i', critical=True)
with spinner("Pushing prisma db schema."):
    cmd_run('cd "KrakenWeb" && npx prisma db push', "Prisma db schema pushed.  ", "Prisma db application failed. Please check your mysql server and retry.", critical=True)
with spinner("Building app..."):
    cmd_run('cd "KrakenWeb" && sudo -u $USER npm run build')
    cmd_run('chown -R $USER:$USER .')

info("Disabling system sleep...")
cmd_run("systemctl mask sleep.target suspend.target hibernate.target hybrid-sleep.target", "Disabled system sleep.      ")

if question("Are files on an external drive ? [y/n]").lower() == "y":
    drives = [_.strip() for _ in os.popen("ls /dev/disk/by-label").read().split(" ") if _ != ""]
    drive = questionary.select("Select drive : ", drives).ask()
    device = os.popen(f"ls -al /dev/disk/by-label/{drive}").read().split("->")[0].strip().split(" ")[-1]

    auto_params = f'{device} {file_path} ext4 nosuid,nodev,nofail,x-gvfs-show 0 0'

    cmd_run("cp /etc/fstab fstab.old")

    with open("/etc/fstab", "r", encoding="utf-8") as fstab:
        conf = fstab.readlines()
    write = True
    for line in conf:
        if device in line:
            fail("Drive already fstabbed.")
            write = False
    if write :
        with open("/etc/fstab", "w", encoding="utf-8") as fstab:
            conf.append(auto_params)
            fstab.writelines(conf)
            success("Drive fstabbed.")
        with spinner("Testing mount -a"):
            cmd_run("mount -a", "Mount successfull !", "Ooops, something went wrong mounting the drive. This is critical. Check /etc/fstab", critical=True)

user_uid = question("Select user uid. (default : 1000)")
if user_uid.strip() == "":
    user_uid = str(1000)
group_uid = question("Select group uid. (default : 1000)")
if group_uid.strip() == "":
    group_uid = str(1000)
with spinner("Setting permissions..."):
    cmd_run(f"chown -R {user_uid}:{group_uid} {file_path}")
    cmd_run(f"chmod -R a=rx {file_path}")


service_conf = f"""[Unit]
Description=Web Service

[Service]
ExecStart=/usr/bin/npm --prefix "{os.path.join(os.getcwd(), "KrakenWeb")}" start
Restart=always
User=root
Group=root
Environment=PATH=/usr/bin:/usr/local/bin:/usr/sbin
Environment=NODE_ENV=production
WorkingDirectory=/

[Install]
WantedBy=multi-user.target"""

info("Creating service")
with open("/etc/systemd/system/krakenWeb.service", "w", encoding="utf-8") as service:
    service.write(service_conf)
    service.close()
cmd_run("sudo systemctl daemon-reload")
cmd_run("sudo systemctl enable krakenWeb")
info("Starting web server <3")
cmd_run("sudo systemctl start krakenWeb", "Service created successfully.", "Starting the service failed. Please try manually.")

info("Adding selected user to database...")

cryptsalt = bcrypt.gensalt() 
client = mysql.connector.connect(
        host="localhost",
        user=username,
        password=password,
        database=database,
    )
cursor = client.cursor()
cursor.execute(f'SELECT id FROM User WHERE email="{username.lower()}@{hostname}";')
if len(cursor.fetchall()) > 0:
    warning(f"Another user with email {username}@{hostname} was found. No new user will be created.")
else:
    dbpass = bcrypt.hashpw(password.encode("utf-8"), cryptsalt).decode("utf-8")
    cursor.execute(f"INSERT INTO User (id, name, email, hashedPassword, roles, updatedAt) VALUES (UUID(), '{username}', '{username.lower()}@{hostname}', '{dbpass}', 'admin', NOW());")
    client.commit()
    success("Admin user added to web DB.")

info("Setting up Samba")
with spinner("Downloading packages..."):
    cmd_run("sudo apt install -y samba")



info("Creating shares.")
movies_share = [_ + "\n" for _ in (f"""
[Movies]
    comment = Kraken Bay - Movies <3
    path = "{os.path.join(file_path, "Movies")}"
    available = yes
    read only = yes
    create mask = 666
    directory mask = 777
    browsable = yes
    public = yes
    guest only = yes
    force user = kraken
    force group = kraken
""").split("\n")]
shows_share = [_ + "\n" for _ in (f"""
[TVShows]
    comment = Kraken Bay - TV Shows <3
    path = "{os.path.join(file_path, "Series")}"
    available = yes
    read only = yes
    create mask = 666
    directory mask = 777
    browsable = yes
    public = yes
    guest only = yes
    force user = kraken
    force group = kraken
""").split("\n")]

mov, ser = True, True

with open("/etc/samba/smb.conf", "r", encoding="utf-8") as smbconf:
    old_conf = smbconf.readlines()
    if "[Movies]\n" in old_conf:
        warning("Oops, Movies share already exists !")
        mov = False
    if "[TVShows]\n" in old_conf:
        warning("Oops, TVShows share already exists !")
        ser = False
    for i in range(len(old_conf) - 1):
        if "WORKGROUP" in old_conf[i]:
            if old_conf[i + 1] != "   disable netbios = yes\n":
                old_conf.insert(i + 1, "   multicast dns register = yes\n")
                old_conf.insert(i + 1, "   disable netbios = yes\n")
    i = 0
    while i < len(old_conf) - 6:
        if old_conf[i].startswith("[print"):
            for _ in range(6):
                old_conf.pop(i)
        i+=1
    if mov : old_conf += movies_share
    if ser : old_conf += shows_share
    smbconf.close()

with open("/etc/samba/smb.conf", "w", encoding="utf-8") as smbconf:
    smbconf.writelines(old_conf)
    smbconf.close()

with spinner("Starting Samba..."):
    cmd_run("sudo service smbd restart")
success("Samba is up !")

if ptfrm == "linux":
    if "ssh" in os.popen("pstree -s $$").read(): warning("You seem to be connected through ssh. Setting up h0tsp0t will most likely fail.")
    hot = question("Do you wish to setup hostspot mode ? [Y/n]")
    if hot.lower() == "y" or hot.strip() == "":
        import netifaces # type: ignore
        interface = questionary.select("Choose interface for hotspot : ", netifaces.interfaces()).ask()

        with spinner("Installing hostapd and dnsmasq"):
            cmd_run("sudo DEBIAN_FRONTEND=noninteractive apt install -y hostapd dnsmasq")

        info("Cloning linux-router from @garywill...")
        cmd_run("cd /tmp && git clone https://github.com/garywill/linux-router/", show_outp=True)
        cmd_run("mv /tmp/linux-router/lnxrouter /usr/bin/lnxrouter")
        cmd_run("chown 0:0 /usr/bin/lnxrouter")
        cmd_run("chmod 744 /usr/bin/lnxrouter")
        success("Done.")

        with open("/usr/bin/linux-router_start.sh", "w", encoding="utf-8") as starter :
            starter.write(f"""#!/bin/bash

if [[ ! -z `nmcli con show --active | grep {interface}` ]]
    then nmcli dev disconnect {interface}
fi

if [[ ! -z `lnxrouter -l | grep {interface}` ]]
    then lnxrouter --stop `lnxrouter -l | grep {interface} | cut -d " " -f 2`
fi

lnxrouter --ap {interface} KrakenBay --hostname {hostname} -g 192.168.1.1
""")
        cmd_run("chown 0:0 /usr/bin/linux-router_start.sh")
        cmd_run("chmod 744 /usr/bin/linux-router_start.sh")

        with open("/usr/lib/systemd/system/linux-router.service", "w", encoding="utf-8") as router_service:
                router_service.write(f"""[Unit]
Description=Create AP Service
After=network.target

[Service]
Type=simple
ExecStart=/usr/bin/linux-router_start.sh
User=root
KillSignal=SIGINT
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
""")
                router_service.close()

        with spinner("Setting up hot spot ..."):
            cmd_run("sudo systemctl daemon-reload")
            cmd_run("sudo systemctl enable linux-router")
            cmd_run("sudo systemctl start linux-router")
            cmd_run("sudo rm -r /tmp/linux-router")
        success("We are now in hotspot mode !")

cmd_run("chown -R $USER:$USER .")

if question("Setup complete. Do you wish to reboot now ? [Y/n]").lower() == "y":
    if ptfrm == "linux" : cmd_run("systemctl reboot")
    if ptfrm == "win" : cmd_run("shutdown /r /t 0")
