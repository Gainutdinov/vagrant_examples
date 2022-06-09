#!/usr/bin/python3
from kafka import KafkaProducer
broker = 'kafka-broker1:9092'
topic = 'test'
message = 'message2'
producer = KafkaProducer(bootstrap_servers=[broker])
producer.send(topic, message)
producer.flush()
