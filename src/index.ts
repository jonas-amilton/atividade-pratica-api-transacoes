import cors from "cors";
import express from "express";
import { userRoutes } from "./routes/user.routes";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/users", userRoutes());

app.listen(process.env.PORT, () => {
  console.log("API is running in..." + process.env.PORT);
});
