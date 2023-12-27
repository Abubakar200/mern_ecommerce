import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";

const app = express();

// set the cors
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "20kb" }));

app.use(express.urlencoded({ extended: true, limit: "20kb" }));

app.use(express.static("public"));

app.use(cookieParser());

// import apis

import product from "./routes/product.route.js";
import user from "./routes/user.route.js";
import { ErrorUtils } from "./utils/error.js";

// route declaration for product
app.use("/api/v1", product);

// route declaration for product
app.use("/api/v1", user);

app.use(ErrorUtils);
export { app };
