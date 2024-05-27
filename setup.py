try:
    from PythonModules.spinner import *
    with spinner("Importing python libraries..."):
        from PythonModules.prints import *
        import subprocess
        import os
        import sys
        import bcrypt
        import uuid
        import mysql.connector
        from PythonModules.manager import *
    banner()
except:
    fail("Library import failed.")
    warning("Please install required libraries running 'pip install -r requirements.txt'.")
    exit()


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

def cmd_run(cmd, succ = "", err = "", critical = False):
    try:
        if subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE).wait(timeout=600) != 0:
            warning('Process failed once. Trying again.')
            try:
                if subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE).wait(timeout=600) != 0:
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
            if subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE).wait(timeout=600) != 0:
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

hostname = question("Choose your hostname.")
username = question("Choose your admin username for DB and Web management.")
password = question("Choose your admin password for DB and Web management.")
database = question("Choose the name of the database.")

replace_field("Docker/Mysql/docker-compose.yml", ["MYSQL_ROOT_PASSWORD: ", "MYSQL_DATABASE: ", "MYSQL_USER: ", "MYSQL_PASSWORD: "], [str(uuid.uuid4()), database, username, password])
replace_line("Kraken - Web/.env", "DATABASE_URL=", f'DATABASE_URL="mysql://{username}:{password}@localhost:3306/{database}"')
replace_line("Kraken - Web/.env", "NEXTAUTH_JWT_SECRET=", f'NEXTAUTH_JWT_SECRET="{str(uuid.uuid4())}"')
replace_line("Kraken - Web/.env", "NEXTAUTH_SECRET=", f'NEXTAUTH_SECRET="{str(uuid.uuid4())}"')
replace_line("Kraken - Web/.env", "NEXTAUTH_URL=", f'NEXTAUTH_URL="http://{hostname}"')

with spinner("Installing npm..."):
    if ptfrm == "linux" : cmd_run("sudo DEBIAN_FRONTEND=noninteractive apt install -y npm")
    else : warning("Make sure you installed npm.")

with spinner("Installing mysql-client..."):
    if ptfrm == "linux" : cmd_run("sudo DEBIAN_FRONTEND=noninteractive apt install -y mysql-client")
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

with spinner("Creating mysql db container..."):
    cmd_run("cd Docker/Mysql && sudo docker compose up -d", "Crated mysql server container.", "Did you install docker ?", critical=True)
with spinner("Installing node packages."):
    cmd_run('cd "Kraken - Web" && npm i', "Node packages installed.", 'Failed to install node packages. Please cd into "Kraken - Web" and run > npm i', critical=True)
with spinner("Pushing prisma db schema."):
    cmd_run('cd "Kraken - Web" && npx prisma db push', "Prisma db schema pushed.", "Prisma db application failed. Please check your mysql server and retry.", critical=True)
with spinner("Building app..."):
    cmd_run('cd "Kraken - Web" && npm run build')
    
service_conf = f"""[Unit]
Description=Web Service

[Service]
ExecStart=/usr/bin/npm --prefix "{os.path.join(os.getcwd(), "Kraken - Web")}" start
Restart=always
User=root
Group=root
Environment=PATH=/usr/bin:/usr/local/bin
Environment=NODE_ENV=production
WorkingDirectory={os.path.join(os.getcwd(), "Kraken - Web")}

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

dum = question("Do you wish to setup the demo with dummy data ? [Y/n]")
if dum.lower() == "y" or dum.strip() == "":
    dummy(username, password, database)

info("Setting up Samba")
with spinner("Downloading packages..."):
    cmd_run("sudo apt install samba")

info("Creating share.")
smbshare = [_ + "\n" for _ in (f"""
[KrakenMovies]
    comment = Kraken Bay - Movies <3
    path = "{os.path.join(os.getcwd(), "/Kraken - Web/public/Assets/Movies")}"
    available = yes
    read only = yes
    create mask = 666
    directory mask = 777
    browsable = yes
    public = yes
    guest only = yes
    force user = kraken
    force group = kraken

[KrakenShows]
    comment = Kraken Bay - Movies <3
    path = "{os.path.join(os.getcwd(), "/Kraken - Web/public/Assets/Series")}"
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

with open("/etc/samba/smb.conf", "r", encoding="utf-8") as smbconf:
    old_conf = smbconf.readlines()
    for l in old_conf:
        if "WORKGROUP" in l:
            old_conf.insert(old_conf.index(l) + 1, "   multicast dns register = yes\n")
            old_conf.insert(old_conf.index(l) + 1, "   disable netbios = yes\n")
        if l.startswith("[print"):
            ind = old_conf.index(l)
            for _ in range(6):
                old_conf.pop(ind)
    old_conf += smbshare
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
        info("The following interfaces are available :")
        for intf in netifaces.interfaces() :
            print(f'[>] {intf}')
        interface = question("Which interface do you wish to use for hotspot ?")

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

""")
                createap_start.close()

        cmd_run("chmod u=rwx /usr/bin/create_ap_start")

        with open("/usr/lib/systemd/system/create_ap.service", "w", encoding="utf-8") as createap_service:
                createap_service.write("""[Unit]
Description=Create AP Service
After=network.target

[Service]
Type=simple
ExecStart=/usr/bin/create_ap_start
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
