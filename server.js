require("dotenv").config();

const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");


const app = express();

app.use(cors());

app.get("/ping", (_, res) => res.status(200).json({ message: "All Good" }));

mongoose
  .connect(process.env.MONGOURI)
  .then(() =>
    app.listen(process.env.PORT, process.env.HOST, () =>
      console.log(`Server listening on port ${process.env.PORT}`)
    )
  )
  .catch(console.error); 