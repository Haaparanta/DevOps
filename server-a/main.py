import time
import requests
import pika
import grpc
import service2_pb2
import service2_pb2_grpc

counter = 0

def send_messages():
    global counter
    while True:
        try:
            connection = pika.BlockingConnection(pika.ConnectionParameters('rabbitmq-vesa'))
            channel = connection.channel()
            channel.exchange_declare(exchange='exchange', exchange_type='topic')
            break  # Exit the while loop if connection is successful
        except pika.exceptions.AMQPConnectionError:
            time.sleep(5)

    for i in range(21):
        timestamp = time.strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'
        message = f'SND {counter} {timestamp} 192.168.2.22:8000'

        # Send message to RabbitMQ
        channel.basic_publish(exchange='exchange', routing_key='message', body=message)

        # Send message via HTTP
        response = requests.post('http://server-b-vesa:8000/message', json={'key': message}, timeout=5)
        response_log = f'{response.status_code} {timestamp}'
        channel.basic_publish(exchange='exchange', routing_key='log', body=response_log)

        # Send message via gRPC


        counter += 1
        time.sleep(2)

    channel.basic_publish(exchange='exchange', routing_key='log', body='SND STOP')

    connection.close()

    while (True) :
        time.sleep(5)

if __name__ == '__main__':
    send_messages()