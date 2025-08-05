const express = require("express")
const { LogModel } = require("../models/log.model")
const logRoute = express.Router()


logRoute.get("/data", async (req, res) => {
    try {
        // const data = await LogModel.find()
        let skip = parseInt(req.query.skip) || 0;
        let load = parseInt(req.query.load) || 20;

        // Optional: Prevent negative or too large values
        if (skip < 0) skip = 0;
        if (load <= 0 || load > 100) load = 20;

        const data = await LogModel.find().skip(skip).limit(load);
        // console.log("Mongo Response:", data); 
        if (!data || data.length === 0) {
            return res.status(200).json({ message: "log is empty" });
        }
        return res.status(200).json({ message: "Logged data", data });
    } catch (error) {
        console.error("Error fetching logs:", error);
        return res.status(500).json({ message: "Something went wrong." });
    }
});


logRoute.get("/all", async (req, res) => {
    try {
        const sucess_data = await LogModel.find({}, { status: "Success" }).countDocuments()
        const all_data = await LogModel.find().countDocuments()
        const failure_data = await LogModel.find({}, { status: "Failure" }).countDocuments()
        return res.status(200).json({ message: "Logged data", failure_data, all_data, sucess_data });
    } catch (error) {
        console.error("Error fetching logs:", error);
        return res.status(500).json({ message: "Something went wrong." });
    }
});





module.exports = { logRoute };
