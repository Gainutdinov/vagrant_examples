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

#-------------------KAFKA CONFIGURATION-------------------

sudo adduser --disabled-password --shell /bin/bash --gecos "kafka" kafka
sudo adduser kafka sudo
sudo echo 'kafka ALL=(ALL) NOPASSWD: ALL' >> /etc/sudoers.d/kafka

sudo mkdir /usr/local/kafka
sudo mkdir /var/lib/kafka
sudo curl "https://dlcdn.apache.org/kafka/3.0.1/kafka_2.12-3.0.1.tgz" -o /tmp/kafka.tgz
sudo mkdir /usr/local/kafka && cd /usr/local/kafka
sudo chown -R kafka:kafka /usr/local/kafka
sudo tar -xvzf /tmp/kafka.tgz --strip 1
sudo chown -R kafka:kafka /usr/local/kafka
sudo chown -R kafka:kafka /var/lib/kafka

sudo apt update
sudo apt install openjdk-11-jre-headless -y

cat << EOF >> /etc/systemd/system/kafka.service
[Unit]
Requires=zookeeper.service
After=zookeeper.service

[Service]
Type=simple
User=kafka
ExecStart=/bin/sh -c '/usr/local/kafka/bin/kafka-server-start.sh /usr/local/kafka/config/server.properties > /var/lib/kafka/kafka.log 2>&1'
ExecStop=/usr/local/kafka/bin/kafka-server-stop.sh
Restart=on-abnormal

[Install]
WantedBy=multi-user.target
EOF


cat << EOF > /usr/local/kafka/config/server.properties
# The id of the broker. This must be set to a unique integer for each broker.
broker.id=${HOSTNAME:6}

# A comma seperated list of directories under which to store log files
log.dirs=/var/lib/kafka
advertised.host.name=
# add all 3 zookeeper instances ip here
zookeeper.connect=zookeeper1:2181,zookeeper2:2181,zookeeper3:2181
zookeeper.connection.timeout.ms=6000
EOF
sudo chown kafka:kafka  /usr/local/kafka/config/server.properties


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
