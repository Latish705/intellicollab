import app from "./app";
import connectDb from "./config/mongo";
import connectQdrant from "./config/qdrant";
import dotenv from "dotenv";

dotenv.config();

let qdrantClient: any;

const startServer = async () => {
  try {
    await connectDb();
    qdrantClient = await connectQdrant();
    app.listen(process.env.PORT || 4003, () => {
      console.log(`Server is running on port ${process.env.PORT || 4003}`);
    });
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
  }
};

startServer();
