import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { authorizationMiddleware } from "./src/middlewares/authorizationMiddleware.js";
import rulesRoutes from "./src/routes/rulesRoutes.js";
import relaysRoutes from "./src/routes/relaysRoutes.js";
import tasksRoutes from "./src/routes/tasksRoutes.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:3000" }));
app.use(authorizationMiddleware);

app.use("/rules", rulesRoutes);
app.use("/relays", relaysRoutes);
app.use("/tasks", tasksRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
