const express = require('express');
const cors = require('cors')
const planetsRouter = require('./routes/planets.routers');
const launchesRouter = require('./routes/launches.routers');
const app = express();

app.use(cors({
    origin: 'http://localhost:3000'
}))

app.use(express.json());
app.use('/planets', planetsRouter);
app.use('/launches', launchesRouter);

module.exports = app;