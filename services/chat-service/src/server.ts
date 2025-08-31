import app from "./app";
import dotenv from "dotenv";
import connectDB from "./config/db";

dotenv.config();

const PORT = process.env.PORT || 4002;
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log("user service server running at 4001");
    });
  })
  .catch(() => {
    console.log("Error starting the server");
  });
