import express from "express";
import { PORT } from "./config/env.js";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import connectToDB from "./database/mongodb.js";
import errorMiddleware from "./middlewares/error.middlewares.js";
import cookieParser from "cookie-parser";
import arcjetMiddleware from "./middlewares/arcjet.middleware.js";
import workflowRouter from "./routes/workflow.routes.js";

const app = express();

app.use(cors());
app.disable("x-powered-by");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(arcjetMiddleware);

app.get("/", (req, res) => {
  res.send("Welcome to the Subcriptions Model API");
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/workflows", workflowRouter);
app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send("Welcome to the home page");
});

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await connectToDB();
});

export default app;
