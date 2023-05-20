const http = require("http");
const app = require("./app");
const mongoose = require("mongoose")
const MONGO_URL ='mongodb+srv://nasaproject:123321@cluster0.kyb3nej.mongodb.net/'
require("dotenv").config();
const { loadPlanets } = require("./models/planets.models");
const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

mongoose.connection.once("open", () => {
  console.log("Mongoose connect");
});

mongoose.connection.on("error", (err) => {
  console.log(err);
});

async function startServer() {
  await mongoose.connect(MONGO_URL);
  await loadPlanets();

  server.listen(PORT, () => {
    console.log(`Server listen PORT ${PORT}`);
  });
}

startServer();
