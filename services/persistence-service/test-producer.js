// Test script to send a message to Kafka
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'test-producer',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9094'],
});

const producer = kafka.producer();

async function sendTestMessage() {
  try {
    await producer.connect();
    console.log('✅ Producer connected');

    const testMessage = {
      chatId: 'test-chat-123',
      senderId: 'user-456',
      message: 'Hello from test producer!',
      timestamp: new Date(),
    };

    await producer.send({
      topic: 'mongo-chat-messages',
      messages: [
        {
          value: JSON.stringify(testMessage),
        },
      ],
    });

    console.log('✅ Test message sent:', testMessage);
    await producer.disconnect();
    console.log('✅ Producer disconnected');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

sendTestMessage();
