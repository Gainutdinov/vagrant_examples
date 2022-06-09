#!/bin/bash

sudo sed -i '/^127\.0\.2\.1[[:space:]]zookeeper1[[:space:]]zookeeper1/d' /etc/hosts
sudo sed -i '/^127\.0\.2\.1[[:space:]]zookeeper2[[:space:]]zookeeper2/d' /etc/hosts
sudo sed -i '/^127\.0\.2\.1[[:space:]]zookeeper3[[:space:]]zookeeper3/d' /etc/hosts
echo '192.168.53.101 zookeeper1' >> /etc/hosts
echo '192.168.53.102 zookeeper2' >> /etc/hosts
echo '192.168.53.103 zookeeper3' >> /etc/hosts


#sudo apt update
#sudo apt install openjdk-11-jre-headless -y
#sudo useradd zookeeper -m
#sudo usermod --shell /bin/bash zookeeper
#sudo usermod -aG sudo zookeeper
#sudo echo 'zookeeper ALL=(ALL) NOPASSWD: ALL' >> /etc/sudoers.d/zookeeper
#
#sudo mkdir -p /usr/local/zookeeper
#sudo cd /tmp
#sudo wget https://mirrors.estointernet.in/apache/zookeeper/zookeeper-3.6.3/apache-zookeeper-3.6.3-bin.tar.gz
#sudo tar -xvzf apache-zookeeper-3.6.3-bin.tar.gz
#sudo cp -r apache-zookeeper-3.6.3-bin/* /usr/local/zookeeper
#sudo chown -R zookeeper:zookeeper /usr/local/zookeeper
#sudo mkdir /var/lib/zookeeper
#sudo echo ${HOSTNAME:9} > /var/lib/zookeeper/myid
#
#cat << EOF > /usr/local/zookeeper/conf/zoo.cfg
#tickTime=2000
#dataDir=/var/lib/zookeeper
#clientPort=2181
#initLimit=20
#syncLimit=5
#server.1=zookeeper1:2888:3888
#server.2=zookeeper2:2888:3888
#server.3=zookeeper3:2888:3888
#4lw.commands.whitelist=*
#EOF
#
#cat << EOF > /etc/systemd/system/zookeeper.service
#[Unit]
#Requires=network.target remote-fs.target
#After=network.target remote-fs.target
#[Service]
#Type=simple
#ExecStart=/usr/local/zookeeper/bin/zkServer.sh start-foreground
#ExecStop=/usr/local/zookeeper/bin/zkServer.sh stop
#Restart=on-abnormal
#[Install]
#WantedBy=multi-user.target
#EOF
#
#sudo systemctl daemon-reload
#sudo systemctl start zookeeper.service
#
##-------------------KAFKA CONFIGURATION-------------------
#sudo adduser --disabled-password --shell /bin/bash --gecos "kafka" kafka
#sudo adduser kafka sudo
#sudo echo 'kafka ALL=(ALL) NOPASSWD: ALL' >> /etc/sudoers.d/vagrant
#
#sudo mkdir /home/kafka/Downloads
#sudo curl "https://dlcdn.apache.org/kafka/3.0.1/kafka_2.12-3.0.1.tgz" -o /home/kafka/Downloads/kafka.tgz
#sudo mkdir /home/kafka/kafka && cd /home/kafka/kafka
#sudo chown -R kafka:kafka /home/kafka/Downloads
#sudo chown -R kafka:kafka /home/kafka/kafka
#sudo tar -xvzf /home/kafka/Downloads/kafka.tgz --strip 1
#sudo chown -R kafka:kafka /home/kafka/kafka
#
#sudo apt update
#sudo apt install openjdk-11-jre-headless -y
#
#cat << EOF >> /etc/systemd/system/kafka.service
#[Unit]
#Requires=zookeeper.service
#After=zookeeper.service
#
#[Service]
#Type=simple
#User=kafka
#ExecStart=/bin/sh -c '/home/kafka/kafka/bin/kafka-server-start.sh /home/kafka/kafka/config/server.properties > /home/kafka/kafka/kafka.log 2>&1'
#ExecStop=/home/kafka/kafka/bin/kafka-server-stop.sh
#Restart=on-abnormal
#
#[Install]
#WantedBy=multi-user.target
#EOF
#
#
#cat << EOF > /home/kafka/kafka/config/server.properties
## The id of the broker. This must be set to a unique integer for each broker.
#broker.id=${HOSTNAME:9}
#
## A comma seperated list of directories under which to store log files
#log.dirs=/tmp/kafka-logs
#advertised.host.name=
#log.dirs=/tmp/kafka-logs
## add all 3 zookeeper instances ip here
#zookeeper.connect=zookeeper1:2181,zookeeper2:2181,zookeeper3:2181
#zookeeper.connection.timeout.ms=6000
#EOF
#sudo chown kafka:kafka  /home/kafka/kafka/config/server.properties
#
#
#sudo systemctl daemon-reload
#sudo systemctl enable --now zookeeper.service
#sudo systemctl enable --now kafka.service
#sudo systemctl status kafka zookeeper
#
#sudo apt install python3-pip -y
#
#sudo pip3 install kafka-python
#
#cat << EOF >> /home/kafka/send.py
##!/usr/bin/python3
#from kafka import KafkaProducer
#broker = 'host1:9092'
#topic = 'test'
#message = 'message2'
#producer = KafkaProducer(bootstrap_servers=[broker])
#producer.send(topic, message.encode('utf-8'))
#producer.flush()
#EOF
#chmod 777 /home/kafka/send.py
#
#cat << EOF >> /home/kafka/receive.py
##!/usr/bin/python3
#from kafka import KafkaConsumer
#broker = 'host1:9092'
#topic = 'test'
#consumer = KafkaConsumer(topic, bootstrap_servers=[broker])
#for msg in consumer:
#  print (msg)
#EOF
#chmod 777 /home/kafka/receive.py
