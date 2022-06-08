
#!/usr/bin/python3
from kafka import KafkaConsumer
broker = 'kafka-broker1:9092'
topic = 'test'
consumer = KafkaConsumer(topic, bootstrap_servers=[broker])
for msg in consumer:
  print (msg)
