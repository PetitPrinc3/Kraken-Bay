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
        if old: self.steps = ["[-]", "[\]", "[|]", "[/]"]
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
        if show_outp :
            outp = subprocess.STDOUT
        else :
            outp = subprocess.PIPE
        if subprocess.Popen(cmd, shell=True, stdout=outp, stderr=subprocess.PIPE).wait(timeout=300) != 0:
            warning('Process failed once. Trying again.')
            try:
                if subprocess.Popen(cmd, shell=True, stdout=outp, stderr=subprocess.PIPE).wait(timeout=300) != 0:
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
            if subprocess.Popen(cmd, shell=True, stdout=outp, stderr=subprocess.PIPE).wait(timeout=300) != 0:
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

info(f"Using hostname : {hostname}")
info(f"Using username : {username}")
info(f"Using password : {password}")
info(f"Using database : {database}")

replace_field("Docker/docker-compose.yml", ["MYSQL_ROOT_PASSWORD: ", "MYSQL_DATABASE: ", "MYSQL_USER: ", "MYSQL_PASSWORD: "], [str(uuid.uuid4()), database, username, password])
replace_line("KrakenWeb/.env", "DATABASE_URL=", f'DATABASE_URL="mysql://{username}:{password}@localhost:3306/{database}"')
replace_line("KrakenWeb/.env", "NEXTAUTH_JWT_SECRET=", f'NEXTAUTH_JWT_SECRET="{str(uuid.uuid4())}"')
replace_line("KrakenWeb/.env", "NEXTAUTH_SECRET=", f'NEXTAUTH_SECRET="{str(uuid.uuid4())}"')
replace_line("KrakenWeb/.env", "NEXTAUTH_URL=", f'NEXTAUTH_URL="http://{hostname}"')

info("Installing npm...")
if ptfrm == "linux" : cmd_run("sudo DEBIAN_FRONTEND=noninteractive apt install -y npm", show_outp=True)
else : warning("Make sure you installed npm.")

info("Installing mysql-client...")
if ptfrm == "linux" : cmd_run("sudo DEBIAN_FRONTEND=noninteractive apt install -y mysql-client", show_outp=True)
else : warning("Make sure you installed mysql-client.")

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

cryptsalt = bcrypt.gensalt() 

info("Generating SSL certificates")
cmd_run('/usr/bin/openssl req -x509 -newkey rsa:4096 -keyout Docker/nginx/ssl/kraken_key.pem -out Docker/nginx/ssl/kraken_cert.pem -sha256 -days 3650 -nodes -subj "/C=XX/ST=neverland/L=krakenbay/O=kraken/OU=kraken/CN=kraken"', show_outp=True)
with spinner("Creating mysql db and nginx containers..."):
    cmd_run("cd Docker && sudo docker compose up -d", "Crated mysql server container.", "Did you install docker ?", critical=True)
with spinner("Installing node packages."):
    cmd_run('cd "KrakenWeb" && npm i', "Node packages installed.", 'Failed to install node packages. Please cd into "KrakenWeb" and run > npm i', critical=True)
with spinner("Pushing prisma db schema."):
    cmd_run('cd "KrakenWeb" && npx prisma db push', "Prisma db schema pushed.", "Prisma db application failed. Please check your mysql server and retry.", critical=True)
with spinner("Building app..."):
    cmd_run('cd "KrakenWeb" && npm run build')

install_path = os.getcwd()

if question("Are files on an external drive ? [y/n]").lower() == "y":
    install_path = question("Choose mount point.")
    if not os.path.exists(install_path) :
        os.makedirs(install_path)
    drives = [_.strip() for _ in os.popen("ls /dev/disk/by-label").read().split(" ") if _ != ""]
    drive = questionary.select("Select drive : ", drives).ask()
    device = os.popen(f"ls -al /dev/disk/by-label/{drive}").read().split("->")[0].strip().split(" ")[-1]
    user_uid = question("Select user uid. (default : 1000)")
    if user_uid.strip() == "":
        user_uid = str(1000)
    group_uid = question("Select group uid. (default : 1000)")
    if group_uid.strip() == "":
        group_uid = str(1000)
    auto_params = f'/dev/{device} {install_path} ext4 uid={user_uid},gid={group_uid},umask=0022,sync,auto,rw 0 0'

    cmd_run("cp /etc/fstab fstab.old")

    with open("/etc/fstab", "r+", encoding="utf-8") as fstab:
        conf = fstab.readlines()
        write = True
        for line in conf:
            if device in line:
                fail("Drive already fstabbed.")
                write = False
        if write :
            conf.append(auto_params)
            fstab.writelines(conf)
            success("Drive fstabbed.")
    install_path = os.path.join(install_path, "Kraken-Bay")


service_conf = f"""[Unit]
Description=Web Service

[Service]
ExecStart=/usr/bin/npm --prefix "{os.path.join(install_path, "KrakenWeb")}" start
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
    path = "{os.path.join(install_path, "KrakenWeb/public/Assets/Movies")}"
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
    path = "{os.path.join(install_path, "KrakenWeb/public/Assets/Series")}"
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
    for i in range(len(old_conf)):
        if "WORKGROUP" in old_conf[i]:
            if old_conf[i + 1] != "   disable netbios = yes\n":
                old_conf.insert(i + 1, "   multicast dns register = yes\n")
                old_conf.insert(i + 1, "   disable netbios = yes\n")
        if old_conf[i].startswith("[print"):
            for _ in range(6):
                old_conf.pop(i)
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
    hot = question("Do you wish to setup hostspot mode ? [Y/n]")
    if hot.lower() == "y" or hot.strip() == "":
        import netifaces
        interface = questionary("Choose interface for hotspot : ", netifaces.interfaces())
        info("Cloning create_ap from @oblique...")
        cmd_run("cd /tmp && git clone https://github.com/oblique/create_ap")
        success("Done.")

        with spinner("Installing create_ap..."):
            cmd_run("cd /tmp/create_ap && sudo make install")


        createap_conf = f"""CHANNEL=default
GATEWAY=192.168.1.1
WPA_VERSION=2
ETC_HOSTS=0
DHCP_DNS=gateway
NO_DNS=0
NO_DNSMASQ=0
HIDDEN=0
MAC_FILTER=0
MAC_FILTER_ACCEPT=/etc/hostapd/hostapd.accept
ISOLATE_CLIENTS=0
SHARE_METHOD=none
IEEE80211N=0
IEEE80211AC=0
HT_CAPAB=[HT40+]
VHT_CAPAB=
DRIVER=nl80211
NO_VIRT=0
COUNTRY=
FREQ_BAND=2.4
NEW_MACADDR=
DAEMONIZE=0
NO_HAVEGED=0
WIFI_IFACE={interface}
INTERNET_IFACE=
SSID=Kraken Bay
PASSPHRASE=
USE_PSK=0
"""
        with open("/etc/create_ap.conf", "w", encoding="utf-8") as createap_file:
                createap_file.write(createap_conf)
                createap_file.close()
        with open("/usr/bin/create_ap_start", "w", encoding="utf-8") as createap_start:
                createap_start.write("""#!/bin/bash
                                     
nmcli radio wifi off

rfkill unblock wlan

if test -f "/tmp/create_ap.all.lock"; then
    rm /tmp/create_ap.all.lock
fi
                                     
/usr/bin/create_ap --config /etc/create_ap.conf
                                     
nmcli radio wifi on

""")
        with open("/usr/bin/create_ap_stop", "w", encoding="utf-8") as createap_stop:
                createap_stop.write(f"""#!/bin/bash
                                     
cp /etc/NetworkManager/NetworkManager.conf /etc/NetworkManager/NetworkManager.conf.old
cat /etc/NetworkManager/NetworkManager.conf | grep -v {interface} > /etc/NetworkManager/NetworkManager.conf
nmcli radio wifi on
systemctl restart NetworkManager

""")


        cmd_run("chmod u=rwx /usr/bin/create_ap_start")
        cmd_run("chmod u=rwx /usr/bin/create_ap_stop")

        with open("/usr/lib/systemd/system/create_ap.service", "w", encoding="utf-8") as createap_service:
                createap_service.write("""[Unit]
Description=Create AP Service
After=network.target

[Service]
Type=simple
ExecStart=/usr/bin/create_ap_start
ExecStop=/usr/bin/create_ap_stop
User=root
KillSignal=SIGINT
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
""")
                createap_service.close()

        info("Setting up hot spot ...")
        cmd_run("sudo systemctl daemon-reload")
        cmd_run("sudo systemctl enable create_ap")
        cmd_run("sudo systemctl start create_ap")
        cmd_run("sudo rm -r /tmp/create_ap")
        success("We are now in hotspot mode !")

if question("Setup complete. Do you wish to reboot now ? [Y/n]").lower() == "y":
    if ptfrm == "linux" : cmd_run("systemctl reboot")
    if ptfrm == "win" : cmd_run("shutdown /r /t 0")
