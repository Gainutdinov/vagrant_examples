import stompconn = stomp.Connection()conn.start()conn.connect()conn.send(body='Example Message', destination='/queue/stomp-messages')conn.disconnect()