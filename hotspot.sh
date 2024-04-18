apt install -y hostapd dnsmasq
DEBIAN_FRONTEND=noninteractive apt install -y netfilter-persistent iptables-persistent

systemctl unmask hostapd
systemctl enable hostapd

cp /etc/dhcpcd.conf dhcpcd.conf.old

echo """
interface wlan0
    static ip_address=192.168.1.1/24
    nohook wpa_supplicant
""" >> /etc/dhcpcd.conf

mv /etc/dnsmasq.conf dnsmasq.conf.old

echo """interface=wlan0
dhcp-range=192.168.1.2,192.168.1.20,255.255.255.0,24h
domain=wlan
address=/cocopi/192.168.1.1""" > /etc/dnsmasq.conf

rfkill unblock wlan

echo """country_code=US
interface=wlan0
ssid=CocoPi
hw_mode=g
channel=7
macaddr_acl=0
auth_algs=1
ignore_broadcast_ssid=0
wpa=2
wpa_passphrase=petitprince
wpa_key_mgmt=WPA-PSK
wpa_pairwise=TKIP
rsn_pairwise=CCMP""" > /etc/hostapd/hostapd.conf

systemctl reboot