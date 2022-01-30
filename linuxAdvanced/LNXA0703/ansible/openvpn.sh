#On Server https://www.hugeserver.com/kb/how-to-config-openvpn-ubuntu-debian/
apt-get install -y openvpn easy-rsa
cp -R /usr/share/easy-rsa/ /etc/openvpn/
cd /etc/openvpn/easy-rsa/
nano vars


source ./vars
mv ./openssl-1.0.0.cnf openssl.cnf
./clean-all
cd /etc/openvpn/easy-rsa/


./build-ca
./build-key-server server
./build-dh
./build-key client
cd /etc/openvpn/easy-rsa/
cp -R keys/ /etc/openvpn/
cd /etc/openvpn/

vim /etc/openvpn/server.conf

#change with your port
port 1194

#You can use udp or tcp
proto udp

# "dev tun" will create a routed IP tunnel.
dev tun

#Certificate Configuration

#ca certificate
ca /etc/openvpn/keys/ca.crt

#Server Certificate
cert /etc/openvpn/keys/server.crt

#Server Key and keep this is secret
key /etc/openvpn/keys/server.key

#See the size a dh key in /etc/openvpn/keys/
dh /etc/openvpn/keys/dh2048.pem

#Internal IP will get when already connect
server 10.1.1.0 255.255.255.0

#this line will redirect all traffic through our OpenVPN
push "redirect-gateway def1"

#Provide DNS servers to the client, you can use goolge DNS
push "dhcp-option DNS 8.8.8.8"
push "dhcp-option DNS 8.8.4.4"

#Enable multiple client to connect with same key
duplicate-cn

keepalive 20 60
comp-lzo
persist-key
persist-tun
#daemon

log-append /var/log/openvpn.log

#Log Level
verb 3


touch /var/log/openvpn.log


sysctl -w net.ipv4.ip_forward=1


systemctl restart openvpn@server.service

