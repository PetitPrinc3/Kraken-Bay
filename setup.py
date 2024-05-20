import bcrypt
import uuid
from prints import *
from spinner import *
from manager import *

import subprocess
from time import sleep
import os

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
                filedata[l] = filedata[l].replace(field[_], value[_])
    else:
        for l in range(len(filedata)):
            filedata[l] = filedata[l].replace(field, value)
    with open(file, "w") as out :
        out.writelines(filedata)
        out.close()

def cmd_run(cmd):
    try:
        if subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE).wait(timeout=600) != 0:
            warning('Process failed once. Trying again.')
            try:
                if subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE).wait(timeout=600) != 0:
                    fail('Process failed. This is critical.                                                  ')
                    print(cmd)
            except subprocess.TimeoutExpired:
                    fail('Command timed out. This is critical.                                               ')
                    print(cmd)
    except subprocess.TimeoutExpired:
        warning('Command timed out. Trying again.')
        try:
            if subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE).wait(timeout=600) != 0:
                fail('Process failed. This is critical.')
                print(cmd)
        except subprocess.TimeoutExpired:
                fail('Command timed out. This is critical.')
                print(cmd)


hostname = question("Choose your hostname.")
username = question("Choose your admin username for DB and Web management.")
password = question("Choose your admin password for DB and Web management.")
database = question("Choose the name of the database.")

with spinner("Installing npm, mysql-shell and docker..."):
    cmd_run("apt install npm mysql-shell docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y")

replace_field("Docker/docker-compose.yml", ["$ROOT", "$DATABASE", "$USERNAME", "$PASSWORD"], [str(uuid.uuid4()), database, username, password])
replace_line("Cocopi - Web/.env", "DATABASE_URL=", f'DATABASE_URL="mysql://{username}:{password}@localhost:3306/{database}"')
replace_line("Cocopi - Web/.env", "NEXTAUTH_JWT_SECRET=", f'NEXTAUTH_JWT_SECRET="{str(uuid.uuid4())}"')
replace_line("Cocopi - Web/.env", "NEXTAUTH_SECRET=", f'NEXTAUTH_SECRET="{str(uuid.uuid4())}"')

dhcpcd_conf = f"""
interface wlan0
    static ip_address=192.168.1.1/24
    nohook wpa_supplicant
"""
dnsmasq_conf = f"""
interface=wlan0
dhcp-range=192.168.1.2,192.168.1.20,255.255.255.0,24h
domain=wlan
address=/cocopi/192.168.1.1
"""
hostapd_conf = f"""country_code=US
interface=wlan0
ssid={hostname}
hw_mode=g
channel=7
macaddr_acl=0
auth_algs=1
ignore_broadcast_ssid=0
wpa=2
wpa_passphrase={password}
wpa_key_mgmt=WPA-PSK
wpa_pairwise=TKIP
rsn_pairwise=CCMP"""

cryptsalt = bcrypt.gensalt() 

with spinner("Creating mysql db container..."):
    cmd_run("cd Docker && docker-compose up -d")
success("Crated mysql server container.")
with spinner("Installing node packages."):
    cmd_run('cd "Cocopi - Web" && npm i')
success("Node packages installed.")
with spinner("Pushing prisma db schema."):
    cmd_run('cd "Cocopi - Web" && npx prisma db push')
success("Prisma db schema pushed.")

info("Adding selected user to database...")
cmd_run(f"""mysqlsh mysql://{username}:{password}@localhost:3306/{database} --sql -e "INSERT INTO User (id, name, email, hashedPassword, roles, updatedAt) VALUES (UUID(), '{username}', '{username.lower()}@local', '{bcrypt.hashpw(password.encode("utf-8"), cryptsalt).decode("utf-8")}', 'admin', NOW());" """)
        

dum = question("Do you wish to setup the demo with dummy data ? [Y/n]")
if dum == "Y" or dum.strip() == "":
    dummy()


service_conf = f"""
[Unit]
Description=My app

[Service]
ExecStart="npm --prefix {os.path.join(os.getcwd(), "Cocopi - Web")} run dev"
Restart=always
User=nobody
Group=nogroup
Environment=PATH=/usr/bin:/usr/local/bin
Environment=NODE_ENV=production
WorkingDirectory={os.path.join(os.getcwd(), "Cocopi - Web")}

[Install]
WantedBy=multi-user.target
"""

info("Creating service")
cmd_run(f"echo {service_conf} > /etc/systemd/system/cocopi.service")
cmd_run("systemctl enable cocopi")
info("Starting web server <3")
cmd_run("systemctl start cocopi")