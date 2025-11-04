import { QdrantClient } from "@qdrant/js-client-rest";

const connectQdrant = async () => {
  try {
    const Qdrantclient = new QdrantClient({
      url: process.env.QDRANT_URL!,
      apiKey: process.env.QDRANT_API_KEY!,
    });
    const info = await Qdrantclient.api.name;
    console.log(`Qdrant Connected at: ${info}`);
    return Qdrantclient;
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
};

export default connectQdrant;
