#!/bin/bash
apt update 

cat << EOF >> /etc/hosts
192.168.56.100 vm1
192.168.56.200 vm2
EOF


apt install rabbitmq-server -y
apt install python3-pip -y
pip3 install pika 


cat << EOF > /root/send.py
#!/usr/bin/env python3
import pika
connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
channel = connection.channel()
channel.queue_declare(queue='hello')
channel.basic_publish(exchange='',
routing_key='hello',
body='Hello World!')
print(" [x] Sent 'Hello World!'")
connection.close()
EOF

cat << EOF > /root/receive.py
#!/usr/bin/env python3
import pika
connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
channel = connection.channel()
channel.queue_declare(queue='hello')
def callback(ch, method, properties, body):
  print(" [x] Received %r" % body)
channel.basic_consume(queue='hello',
                      auto_ack=True,
                      on_message_callback=callback)
print(' [*] Waiting for messages. To exit press CTRL+C')
channel.start_consuming()
EOF

rabbitmq-plugins enable rabbitmq_federation

#rabbitmqctl add_user federation-user federation
#rabbitmqctl set_parameter federation-upstream my-upstream '{"uri":"amqp://vm2","expires":3600000}'
#amqp://<user>:<password>@<IP/DNS_name>/<vhost>
#rabbitmqctl set_policy queue-federation "hello" '{"federation-upstream-set":"all"}' --apply-to queues


