import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import logger from "morgan";

import router from "./routes/index";
import errorHandler from "./utils/errorHandler";

const app = express();
const port = process.env.PORT || 3000;

const mongoDB = process.env.DATABASE_URL!;
main().catch((err) => console.log(err));
async function main() {
	await mongoose.connect(mongoDB);
}

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(logger("common"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api", router);
app.use(function (req, res, next) {
	res.status(404).json({ error: "Page not found" });
});
app.use(errorHandler);

app.listen(port, () => console.log(`Server listening on ${port}`));
