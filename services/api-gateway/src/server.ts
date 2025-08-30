import app from "./app";
import { config } from "./config";
import logger from "./config/logger";

app.listen(4000, () => {
  logger.info(`${config.SERVICE_NAME} running on port ${config.PORT}`);
  console.log("Server is running on port : 4000");
});
