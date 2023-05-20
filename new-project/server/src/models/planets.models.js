const planetsDatabase = require('./planets.mongoose');
const path = require('path');
const fs = require('fs');
const {parse} = require('csv-parse');

// const habitablePlanets = [];

function ishabitablePlanets(planet) {
    return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6;
}

function loadPlanets() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname,'..', '..', 'data', 'kepler_data.csv')).pipe(parse({
            comment: '#',
            columns: true
        }))

        .on('data', async (data) =>{
            if (ishabitablePlanets(data)) {
                await savePlanets(data);
            }
          
        })

        .on('error', (err) => {
            console.log(err);
            reject()
        })

        .on('end', async() => {
            // console.log(`habitableplanets is ${habitablePlanets.length}`);
            const countPlanetsFound = (await getAllPlanets()).length
            console.log(`habitableplanets is ${countPlanetsFound}`);
            resolve()
        })

    })
}

async function getAllPlanets() {
   return await planetsDatabase.find({});
}

async function savePlanets(planet) {
    try{
        await planetsDatabase.updateOne(
        {
            keplerName: planet.kepler_name,
        },
        {
            keplerName: planet.kepler_name,
        },
        {
            upsert: true
        })
    }catch(err) {
        console.log(err);
    }
}

module.exports = {
    getAllPlanets,
    loadPlanets,
};