const express = require('express');
const amqp = require('amqplib');

const app = express();
const PORT = 8087;
const logs = [];

async function listenToRabbitMQ() {
  let connected = false;
  
  while (!connected) {
    try {
      const connection = await amqp.connect('amqp://rabbitmq-vesa');
      const channel = await connection.createChannel();
      const exchange = 'exchange';
      const topic = 'log';

      await channel.assertExchange(exchange, 'topic', { durable: false });
      const q = await channel.assertQueue('', { exclusive: true });
      await channel.bindQueue(q.queue, exchange, topic);

      channel.consume(q.queue, (msg) => {
        if (msg !== null) {
          logs.push(msg.content.toString());
          channel.ack(msg);
        }
      });
      connected = true;
    } catch (error) {
      console.error('Error:', error.message, '. Retrying in 5 seconds...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}

app.get('/', (req, res) => {
  res.type('text/plain');
  res.send(logs.join('\n'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  listenToRabbitMQ();
});