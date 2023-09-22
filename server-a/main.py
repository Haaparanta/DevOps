import time
from datetime import datetime
import requests

# Service 1 (server-a)
ip_1 = '0.0.0.0'
port_1 = 3000

# Service 2 (server-b)
ip_2 = '0.0.0.0'
port_2 = 8000

# getting server-a ip from hosts file, there is a probably better way to do this. But this is my way :)
try:
    with open('../etc/hosts', 'r') as f:
        last_line = f.readlines()[-1]
        ip_1 = last_line.split('\t')[0]
except FileNotFoundError as e:
        print(f"Failed to read file: {e}")

time.sleep(1)
# Send server-a ip to server-b and get response with server-b ip
try:
    response = requests.get(f'http://server-b-vesa:{port_2}/ip', timeout=5)
    ip_2 = response.text
except requests.RequestException as e:
    print(f"Failed to communicate with server-b: {e}")

time.sleep(1)

# Sending the time logs to server-b
for i in range(20):
    current_datetime = datetime.utcnow()
    timestamp = current_datetime.strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'
    message = f"{i+1} {timestamp} {ip_2}:{port_2}"
    if (i == 0):
        with open('/app/logs/service1.log', 'w+') as f:
            f.write(message + '\n')
    else:
        with open('/app/logs/service1.log', 'a') as f:
            f.write(message + '\n')
    data = {"key": message}
    try:
        response = requests.post(f'http://server-b-vesa:{port_2}/message', json=data ,timeout=5)
    except requests.RequestException as e:
        print(f"Failed to communicate with server-b: {e}")
    time.sleep(2)


# send stop to server-b
with open('/app/logs/service1.log', 'a') as f:
    f.write('STOP\n')

try:
    data = {"key": "STOP"}
    response = requests.post(f'http://server-b-vesa:{port_2}/message', json=data, timeout=5)
except requests.RequestException as e:
    print(f"Failed to communicate with server-b: {e}")
