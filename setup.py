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
    cmd_run("sudo DEBIAN_FRONTEND=noninteractive apt install -y docker docker-compose")
    cmd_run("sudo DEBIAN_FRONTEND=noninteractive apt install -y ca-certificates curl")
    cmd_run("sudo install -m 0755 -d /etc/apt/keyrings")
    cmd_run("sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc")
    cmd_run("sudo chmod a+r /etc/apt/keyrings/docker.asc")
    cmd_run('echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null')    
    cmd_run("sudo DEBIAN_FRONTEND=noninteractive apt update -y")
    cmd_run("sudo DEBIAN_FRONTEND=noninteractive apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin")

success("Installed npm, docker and mysql.")

cryptsalt = bcrypt.gensalt() 

with spinner("Creating mysql db container..."):
    cmd_run("cd Docker/Mysql && docker-compose up -d", "Crated mysql server container.", "Did you install docker ?", critical=True)
with spinner("Installing node packages."):
    cmd_run('cd "Kraken - Web" && npm i', "Node packages installed.", 'Failed to install node packages. Please cd into "Kraken - Web" and run > npm i', critical=True)
with spinner("Pushing prisma db schema."):
    cmd_run('cd "Kraken - Web" && npx prisma db push', "Prisma db schema pushed.", "Prisma db application failed. Please check your mysql server and retry.", critical=True)

info("Adding selected user to database...")

client = mysql.connector.connect(
        host="localhost",
        user=username,
        password=password,
        database=database,
    )
cursor = client.cursor()
cursor.execute(f'SELECT id FROM User WHERE email="{username.lower()}@local";')
if len(cursor.fetchall()) > 0:
    warning(f"Another user with email {username}@local was found. No new user will be created.")
else:
    dbpass = bcrypt.hashpw(password.encode("utf-8"), cryptsalt).decode("utf-8")
    cursor.execute(f"INSERT INTO User (id, name, email, hashedPassword, roles, updatedAt) VALUES (UUID(), '{username}', '{username.lower()}@local', '{dbpass}', 'admin', NOW());")
    client.commit()
    success("Admin user added to web DB.")

dum = question("Do you wish to setup the demo with dummy data ? [Y/n]")
if dum.lower() == "y" or dum.strip() == "":
    dummy(username, password, database)

if ptfrm == "linux":
    hot = question("Do you wish to setup hostspot mode ? [Y/n]")
    if hot.lower() == "y" or hot.strip() == "":
        import netifaces
        info("The following interfaces are available :")
        for intf in netifaces.interfaces() :
            print(f'[>] {intf}')
        interface = question("Which interface do you wish to use for hotspot ?")

        dhcpcd_conf = f"""
        interface {interface}
            static ip_address=192.168.1.1/24
            nohook wpa_supplicant
        """
        dnsmasq_conf = f"""
        interface={interface}
        dhcp-range=192.168.1.2,192.168.1.20,255.255.255.0,24h
        domain=wlan
        address=/{hostname}/192.168.1.1
        """
        hostapd_conf = f"""country_code=US
        interface={interface}
        ssid={hostname.split(".")[0]}
        hw_mode=g
        channel=7
        macaddr_acl=0
        auth_algs=1
        ignore_broadcast_ssid=0
        """
        
        cmd_run("DEBIAN_FRONTEND=noninteractive apt install -y netfilter-persistent iptables-persistent hostapd dnsmasq")
        cmd_run("systemctl unmask hostapd")
        cmd_run("systemctl enable hostapd")
        cmd_run("cp /etc/dhcpcd.conf dhcpcd.conf.old")
        cmd_run("cp /etc/dnsmasq.conf dnsmasq.conf.old")
        cmd_run("cp /etc/hostapd/hostapd.conf hostapd.conf.old")

        info("Setting up hot spot ...")

        with open("/etc/dhcpcd.conf", "w", encoding="utf-8") as dhcpd:
            dhcpd.write(dhcpcd_conf)
            dhcpd.close()
        
        with open("/etc/dnsmasq.conf", "w", encoding="utf-8") as dnsmasq:
            dnsmasq.write(dnsmasq_conf)
            dnsmasq.close()
        
        cmd_run("rfkill unblock wlan")

        with open("/etc/hostapd/hostapd.conf", "w", encoding="utf-8") as hostapd:
            hostapd.write(hostapd_conf)
            hostapd.close()
        
        success("You will need to reboot your system to apply the changes.")

    service_conf = f"""
    [Unit]
    Description=Web Service

    [Service]
    ExecStart="npm --prefix {os.path.join(os.getcwd(), "Kraken - Web")} run dev"
    Restart=always
    User=nobody
    Group=nogroup
    Environment=PATH=/usr/bin:/usr/local/bin
    Environment=NODE_ENV=production
    WorkingDirectory={os.path.join(os.getcwd(), "Kraken - Web")}

    [Install]
    WantedBy=multi-user.target
    """

    info("Creating service")
    cmd_run(f"echo {service_conf} > /etc/systemd/system/cocopi.service")
    cmd_run("systemctl enable cocopi")
    info("Starting web server <3")
    cmd_run("systemctl start cocopi", "Service created successfully.", "Starting the service failed. Please try manually.")

if question("Setup complete. Do you wish to reboot now ? [Y/n]").lower() == "y":
    if ptfrm == "linux" : cmd_run("systemctl reboot")
    if ptfrm == "win" : cmd_run("shutdown /r /t 0")
