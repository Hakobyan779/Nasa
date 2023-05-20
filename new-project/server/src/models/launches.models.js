const launchesDatabase = require('./launches.mongoose');
const planetsDatabase = require('./planets.mongoose');
const launches = new Map();

let lastFlightNumber = 100;
const DEFAULT_FLIGHT_NUMBER = 100;
const launch = {
    flightNumber: 100,
    mission: "Kepler Exploristion X",
    rocket: "Explorer IS",
    launchDate: new Date("December 27, 2030"),
    target: "Kepler-442 b",
    costumer: ['ZIM', 'NASA'],
    upcoming: true,
    succes: true
}

saveLaunches(launch);

// launches.set(launch.flightNumber, launch);

async function getAllLaunches() {
   return await launchesDatabase.find({},{'_id': 0, '_v' : 0})
}

async function saveLaunches(launch) {
    const planet = planetsDatabase.findOne({
        keplerName: launch.target
    });

    if(!planet) {
        throw new Error('No matching planet found');
    }

    await launchesDatabase.findOneAndUpdate({
        flightNumber: launch.flightNumber
    },
    launch,
    {upsert: true})
}

async function exsistsLaunchWithId(launchid) {
    // await  launches.has(launchid)
    return await launchesDatabase.findOne({
        flightNumber:launchid
    })
}

async function getLatestFlightNumber() {
    const latestLaunch = await launchesDatabase.findOne().sort('-flightNumber')
    if(!latestLaunch){
        return DEFAULT_FLIGHT_NUMBER;
    }

    return latestLaunch.flightNumber;
}

// function addNewLaunch(launch) {
//     lastFlightNumber++
//     launches.set(
//         lastFlightNumber,
//         Object.assign(launch, {
//         costumer: ['ZIM', 'NASA'],
//         upcoming: true,
//         succes: true,
//         flightNumber:lastFlightNumber,  
//     }))
// }

 async function abortedLaunch(launchid) {
    // const aborted = launches.get(launchid);
    // aborted.upcoming = false;
    // aborted.success = false;

    const aborted = await launchesDatabase.updateOne({
        flightNumber:launchid
    },
    {
        upcoming:false,
        succes:false
    })
    return aborted
}

async function sheduleNewLaunch(launch) {
    const newFlightNumber = await getLatestFlightNumber() +1;

    const newLaunch = Object.assign(launch, {
        costumer: ['ZIM', 'NASA'],
        upcoming: true,
        succes: true,
        flightNumber:newFlightNumber,  
    })
    await saveLaunches(newLaunch)
}


module.exports = {
    getAllLaunches,
    exsistsLaunchWithId,
    abortedLaunch,
    sheduleNewLaunch
};