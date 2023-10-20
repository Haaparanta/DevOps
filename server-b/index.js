const express = require('express');
const amqp = require('amqplib');
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const send = require('send');

const app = express();
const PORT = 8000;

app.use(express.json());


app.post('/message', (req, res) => {
  const message = req.body.key;
  const newMessage = `${message} ${req.ip}:78390`;
  sendToRabbitMQ('log', newMessage);
  res.json({ key: newMessage });
});

async function checkRabbitMQConnection() {
  try {
    const conn = await amqp.connect('amqp://rabbitmq-vesa');
    await conn.close();
    return true;
  } catch (error) {
    return false;
  }
}

async function waitForRabbitMQ() {
  let isConnected = await checkRabbitMQConnection();
  while (!isConnected) {
    console.log('Waiting for RabbitMQ...');
    await new Promise(resolve => setTimeout(resolve, 5000));  // retry every 5 seconds
    isConnected = await checkRabbitMQConnection();
  }
}

async function sendToRabbitMQ(topic, message) {
  try {
    const conn = await amqp.connect('amqp://rabbitmq-vesa');
    const channel = await conn.createChannel();
    await channel.assertExchange('exchange', 'topic', { durable: false });
    channel.publish('exchange', topic, Buffer.from(message));
    await channel.close();
    await conn.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function listenToRabbitMQ() {
  let connected = false;
  
  while (!connected) {
    try {
      const connection = await amqp.connect('amqp://rabbitmq-vesa');
      const channel = await connection.createChannel();
      const exchange = 'exchange';
      const topic = 'message';

      await channel.assertExchange(exchange, 'topic', { durable: false });
      const q = await channel.assertQueue('', { exclusive: true });
      await channel.bindQueue(q.queue, exchange, topic);

      channel.consume(q.queue, (msg) => {
        if (msg !== null) {
          channel.ack(msg);
          const message = msg.content.toString() + ' MSG';
          sendToRabbitMQ('log', message);
        }
      });

      connected = true; 

    } catch (error) {
      console.error('Error:', error.message, '. Retrying in 5 seconds...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}


waitForRabbitMQ().then(() => {
  setTimeout(() => {
    listenToRabbitMQ();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  }, 2000);
});