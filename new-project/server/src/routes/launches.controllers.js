const {getAllLaunches, sheduleNewLaunch, exsistsLaunchWithId, abortedLaunch} = require("../models/launches.models");

async function httpGetLaunches(req, res) {
    return res.status(200).json(await getAllLaunches());
}

async function httpAddNewLaunch(req, res) {
    const launch = req.body;
    if(!launch.mission || !launch.rocket || !launch.target || !launch.launchDate ) {
        return res.status(404).json({
            error: 'not launch'
        })
    }

    launch.launchDate = new Date(launch.launchDate);

    if(launch.launchDate == 'Invalid Date') {
        return res.status(404).json({
            error: 'Invalid Date launch'
        })  
    }

    await sheduleNewLaunch(launch);
    // addNewLaunch(launch);
    return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
    const launchid = +req.params.id;
    const x = await exsistsLaunchWithId(launchid)
    if(!x) {
        return res.status(404).json({
            error:"Launch not found"
        })
    }
    const aborted = abortedLaunch(launchid);
    return res.status(200).json(aborted)

}

module.exports = {httpGetLaunches, httpAddNewLaunch, httpAbortLaunch}