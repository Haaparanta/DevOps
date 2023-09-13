const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
const fs = require('fs');

// Service 1 (server-a)
let ip_1 = '0.0.0.0';
const port_1 = 3000;

// Service 2 (server-b)
let ip_2 = '0.0.0.0';
const port_2 = 8000;

// getting server-a ip from hosts file, there is a probably better way to do this. But this is my way :)
const filePath = '/etc/hosts';
fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
        console.error(`${filePath} does not exist.`);
    } else {
        fs.readFile(filePath, 'utf8', (readErr, data) => {
            if (readErr) {
                console.error(`Error reading ${filePath}: ${readErr.message}`);
            } else {
                console.log(`Contents of ${filePath}:\n`, data);
                const lines = data.split('\n');
                let lastLine = lines[lines.length - 1];
                // Get server a port ip from last line
                ip_2 = lastLine.split('\t')[0];
                if (ip_2 === '') {
                    lastLine = lines[lines.length - 2];
                    ip_2 = lastLine.split('\t')[0];
                }
            }
        });
    }
});

// getting server-a ip and sending server-b ip
app.get('/ip', (req, res) => {
    ip_1 = req.ip;
    res.send(ip_2);
    console.log('ip_1: ' + ip_1);
    console.log('ip_2: ' + ip_2);
});

// getting message from server-a and sending message with server-b ip and port
app.post('/message', (req, res) => {
    if (req.body["key"] === 'STOP') {
        process.exit(0);
    }
    console.log(req.body["key"]);
    let msg = req.body["key"];
    msg = msg + ' ' + ip_1 + ':' + port_1;
    console.log(msg);
    res.json({ "key": msg });
    fs.appendFile('service2.log', msg + '\n', (err) => {
        if (err) throw err;
    });
});

// listening port 8000
app.listen(port_2, '0.0.0.0', () => {
   console.log('Server running on port 8000');
});

