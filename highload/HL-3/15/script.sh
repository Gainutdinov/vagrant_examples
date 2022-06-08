#!/bin/bash

sudo adduser --disabled-password --shell /bin/bash --gecos "kafka" kafka
sudo adduser kafka sudo
sudo echo 'kafka ALL=(ALL) NOPASSWD: ALL' >> /etc/sudoers.d/vagrant

sudo mkdir /home/kafka/Downloads
sudo curl "https://dlcdn.apache.org/kafka/3.0.1/kafka_2.12-3.0.1.tgz" -o /home/kafka/Downloads/kafka.tgz
sudo mkdir /home/kafka/kafka && cd /home/kafka/kafka
sudo chown -R kafka:kafka /home/kafka/Downloads
sudo chown -R kafka:kafka /home/kafka/kafka
sudo tar -xvzf /home/kafka/Downloads/kafka.tgz --strip 1
sudo chown -R kafka:kafka /home/kafka/kafka

sudo apt update
sudo apt install openjdk-11-jre-headless -y

cat << EOF >> /etc/systemd/system/zookeeper.service
[Unit]
Requires=network.target remote-fs.target
After=network.target remote-fs.target

[Service]
Type=simple
User=kafka
ExecStart=/home/kafka/kafka/bin/zookeeper-server-start.sh /home/kafka/kafka/config/zookeeper.properties
ExecStop=/home/kafka/kafka/bin/zookeeper-server-stop.sh
Restart=on-abnormal

[Install]
WantedBy=multi-user.target
EOF


cat << EOF >> /etc/systemd/system/kafka.service
[Unit]
Requires=zookeeper.service
After=zookeeper.service

[Service]
Type=simple
User=kafka
ExecStart=/bin/sh -c '/home/kafka/kafka/bin/kafka-server-start.sh /home/kafka/kafka/config/server.properties > /home/kafka/kafka/kafka.log 2>&1'
ExecStop=/home/kafka/kafka/bin/kafka-server-stop.sh
Restart=on-abnormal

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now zookeeper.service
sudo systemctl enable --now kafka.service
sudo systemctl status kafka zookeeper

sudo apt install python3-pip -y

sudo pip3 install kafka-python

cat << EOF >> /home/kafka/send.py
#!/usr/bin/python3
from kafka import KafkaProducer
broker = 'host1:9092'
topic = 'test'
message = 'message2'
producer = KafkaProducer(bootstrap_servers=[broker])
producer.send(topic, message.encode('utf-8'))
producer.flush()
EOF
chmod 777 /home/kafka/send.py

cat << EOF >> /home/kafka/receive.py
#!/usr/bin/python3
from kafka import KafkaConsumer
broker = 'host1:9092'
topic = 'test'
consumer = KafkaConsumer(topic, bootstrap_servers=[broker])
for msg in consumer:
  print (msg)
EOF
chmod 777 /home/kafka/receive.py
