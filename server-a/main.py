import time
import requests
import pika
import grpc
import service2_pb2
import service2_pb2_grpc
import docker

def get_container_ip(container_name):
    try:
        client = docker.DockerClient(base_url='unix://var/run/docker.sock')
        container = client.containers.get(container_name)
        ip_address = container.attrs['NetworkSettings']['Networks']['devops_default']['IPAddress']
        return ip_address
    except Exception as error:
        return error



def send_messages():
    counter = 1
    while True:
        try:
            connection = pika.BlockingConnection(pika.ConnectionParameters('rabbitmq-vesa'))
            channel = connection.channel()
            channel.exchange_declare(exchange='exchange', exchange_type='topic')
            break 
        except pika.exceptions.AMQPConnectionError:
            time.sleep(5)
    ip = get_container_ip('devops-server-b-vesa-1')
    for i in range(20):
        timestamp = time.strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'
        message = f'SND {counter} {timestamp} {ip}:8000'

        # Send message to RabbitMQ
        try:
            channel.basic_publish(exchange='exchange', routing_key='message', body=message)
        except Exception as error:
            channel.basic_publish(exchange='exchange', routing_key='log', body=f'ERR {error}')


        # Send message via HTTP
        try:
            response = requests.post('http://server-b-vesa:8000/message', json={'key': message}, timeout=30)
            timestamp = time.strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'
            response_log = f'{response.status_code} {timestamp}'
            channel.basic_publish(exchange='exchange', routing_key='log', body=response_log)
        except Exception as error:
            channel.basic_publish(exchange='exchange', routing_key='log', body=f'ERR {error}')

        # Send message via gRPC


        counter += 1
        time.sleep(2)

    channel.basic_publish(exchange='exchange', routing_key='log', body='SND STOP')

    connection.close()

    while (True) :
        time.sleep(5)

if __name__ == '__main__':
    send_messages()