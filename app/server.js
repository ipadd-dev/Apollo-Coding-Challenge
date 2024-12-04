const express = require('express');
const db = require("./db");
const { validateVehicle, validateVin } = require("./validation");
const { isEmptyObject } = require("./utils");

const hostname = "localhost";
const port = 3000;

const app = express();

// middleware that parses the request body and makes it available under req.body
app.use(express.json());

// an endpoint returns all vehicles in the Vehicle table
app.get("/vehicle", async (req, res) => {
    const rows = await db.getVehicles();
    return res.send(rows);
});

// an endpoint that adds new vehicles to the Vehicle table
app.post("/vehicle", async (req, res) => {
    let vehicle = req.body;
    let validationResult = validateVehicle(vehicle);

    // if 200, then we have no validation errors and can insert the new vehicle
    if (validationResult.status == 200) {
        let insertedObject = await db.persistentAddVehicle(vehicle);
        res.statusCode = 201;
        return res.send(insertedObject);
    }
    // otherwise, we have an error and return it
    else {
        res.statusCode = validationResult.status;
        return res.send(validationResult.errors);
    }
});

// get details of vehicle with given VIN
app.get("/vehicle/:vin", async (req, res) => {
    let vin = req.params.vin;

    // making sure that the given VIN is valid
    let errors = validateVin(vin);
    if (!isEmptyObject(errors)) {
        res.statusCode = 400;
        return res.send(errors);
    }

    let details = await db.getVehicle(vin);
    return res.send(details);
});

// updates vehicle record based on vin
app.put("/vehicle/:vin", async (req, res) => {
    let vehicle = req.body;
    let vin = req.params.vin;

    // validating vin
    let errors = validateVin(vin);
    let vehicleErrors = validateVehicle(vehicle);
    // validating vehicle body
    errors = {...errors, ...vehicleErrors.errors}

    if (!isEmptyObject(errors)) {
        // if we have non 200 status code from vehicle validation, then we use this status code
        if (vehicleErrors.status != 200) {
            res.statusCode = vehicleErrors.status;
        }
        // otherwise, we default to 400 Bad Request
        else {
            res.statusCode = 400;
        }

        return res.send(errors);
    }

    // all of our values are valid and we can make a successful query now
    let updatedObject = await db.updateVehicle(vin, vehicle);
    return res.send(updatedObject);
});

// delete vehicle record based on vin
app.delete("/vehicle/:vin", async (req, res) => {
    let vin = req.params.vin;

    // making sure that the vin is valid
    let errors = validateVin(vin);
    if (!isEmptyObject(errors)) {
        res.statusCode = 400;
        return res.send(errors);
    }

    await db.deleteVehicle(vin);
    res.statusCode = 204;
    return res.send();
});

app.listen(port, hostname, () => { 
    console.log(`Listening at: http://${hostname}:${port}`);
});

module.exports = app;