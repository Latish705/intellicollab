import asyncio
import json
from aiokafka import AIOKafkaConsumer

async def consume_messages(topic, bootstrap_servers):
    # Create a consumer instance.
    consumer = AIOKafkaConsumer(
        topic,
        bootstrap_servers=bootstrap_servers,
        group_id="ai_service_group" # A group ID for this consumer
    )

    # Start the consumer.
    await consumer.start()
    print("Kafka consumer started...")
    try:
        # Continuously listen for messages.
        async for msg in consumer:
            print(
                f"Received message from Kafka: {json.loads(msg.value.decode('utf-8'))}"
            )
            # In the future, you will add AI processing logic here.
    finally:
        # Ensure the consumer is stopped on exit.
        await consumer.stop()
        print("Kafka consumer stopped.")