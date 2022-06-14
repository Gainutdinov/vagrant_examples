#!/bin/bash

sudo sed -i '/^127\.0\.2\.1[[:space:]]zookeeper1[[:space:]]zookeeper1/d' /etc/hosts
sudo sed -i '/^127\.0\.2\.1[[:space:]]zookeeper2[[:space:]]zookeeper2/d' /etc/hosts
sudo sed -i '/^127\.0\.2\.1[[:space:]]zookeeper3[[:space:]]zookeeper3/d' /etc/hosts
sudo sed -i '/^127\.0\.2\.1[[:space:]]broker1[[:space:]]broker1/d' /etc/hosts
sudo sed -i '/^127\.0\.2\.1[[:space:]]broker2[[:space:]]broker2/d' /etc/hosts
sudo sed -i '/^127\.0\.2\.1[[:space:]]broker3[[:space:]]broker3/d' /etc/hosts
echo '192.168.53.101 zookeeper1' >> /etc/hosts
echo '192.168.53.102 zookeeper2' >> /etc/hosts
echo '192.168.53.103 zookeeper3' >> /etc/hosts
echo '192.168.53.104 broker1' >> /etc/hosts
echo '192.168.53.105 broker2' >> /etc/hosts
echo '192.168.53.106 broker3' >> /etc/hosts



sudo apt update
sudo apt install openjdk-11-jre-headless -y
sudo useradd zookeeper -m
sudo usermod --shell /bin/bash zookeeper
sudo usermod -aG sudo zookeeper
sudo echo 'zookeeper ALL=(ALL) NOPASSWD: ALL' >> /etc/sudoers.d/zookeeper

sudo mkdir -p /usr/local/zookeeper
sudo cd /tmp
sudo wget https://mirrors.estointernet.in/apache/zookeeper/zookeeper-3.6.3/apache-zookeeper-3.6.3-bin.tar.gz
sudo tar -xvzf apache-zookeeper-3.6.3-bin.tar.gz
sudo cp -r apache-zookeeper-3.6.3-bin/* /usr/local/zookeeper
sudo chown -R zookeeper:zookeeper /usr/local/zookeeper
sudo mkdir /var/lib/zookeeper
sudo echo ${HOSTNAME:9} > /var/lib/zookeeper/myid

cat << EOF > /usr/local/zookeeper/conf/zoo.cfg
tickTime=2000
dataDir=/var/lib/zookeeper
clientPort=2181
initLimit=20
syncLimit=5
server.1=zookeeper1:2888:3888
server.2=zookeeper2:2888:3888
server.3=zookeeper3:2888:3888
4lw.commands.whitelist=*
EOF

cat << EOF > /etc/systemd/system/zookeeper.service
[Unit]
Requires=network.target remote-fs.target
After=network.target remote-fs.target
[Service]
Type=simple
ExecStart=/usr/local/zookeeper/bin/zkServer.sh start-foreground
ExecStop=/usr/local/zookeeper/bin/zkServer.sh stop
Restart=on-abnormal
[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl start zookeeper.service
