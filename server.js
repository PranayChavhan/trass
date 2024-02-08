import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import connect from "./database/conn.js";
import userRouter from "./router/user.js";
import swaggerDocs from "./swagger.js";
import gameRouter from "./router/game.js";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
app.disable("x-powered-by");
const port = process.env.PORT || 8080;
app.get("/", (req, res) => {
  res.status(201).json("Navigate to /docs for swagger API documentation");
});


/** api routes */
app.use("/api/user", userRouter);

app.use("/api/game", gameRouter);

connect()
  .then(() => {
    try {
      app.listen(port, () => {
        console.log(`Server connected to http://localhost:${port}`);
      });
      swaggerDocs(app, port);
    } catch (error) {
      console.log("Cannot connect to the server");
    }
  })
  .catch((error) => {
    console.log("Invalid database connection...!");
  });
