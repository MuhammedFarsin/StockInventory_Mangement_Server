const express = require("express");
const dotenv = require("dotenv");
const {connectDB} = require("./src/Config/config");
const Route = require("./src/Router/userRoute");
const cors = require("cors");
const path = require("path");
const app = express();
dotenv.config();
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());


const PORT = process.env.PORT || 5005;

connectDB();

app.use("/", Route);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
