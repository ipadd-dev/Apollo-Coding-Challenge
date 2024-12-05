const { Pool, types } = require("pg");
const env = require("../env.json");
const generateVin = require("./generateVin");

// during testing, I found that the DECIMAL and NUMERIC types are returned as string in the pg library (due to precision limitations in Number type in JS)
// because of this, I have to add a custom type parser to convert these strings to numbers.
// The only side effect is that we assume DECIMAL values will never grow large enough to cause precision loss or not fit in the Number type
function parseDecimalType(value) {
    return parseFloat(value);
}

types.setTypeParser(1700, parseDecimalType);

// creating a new pool object that will be used to connect to the database
const pool = new Pool({
    host: env.HOST,
    port: env.PORT,
    user: env.USER,
    password: env.PASSWORD,
    database: env.DATABASE
});

async function getVehicles() {
    const query = `SELECT * FROM "Vehicle"`;
    const res = await pool.query(query);
    return res.rows;
}

async function getVehicle(vin) {
    const text = `SELECT * FROM "Vehicle" WHERE vin = $1`;
    const values = [vin];
    const res = await pool.query(text, values);

    return res.rows[0];
}

async function addVehicle(vehicle) {
    // I do not directly insert values into the query to prevent sql injection
    // in the library I am using, we can put placeholders in the query and then provide list of values, and it safely fetches data using these values
    const text = `
        INSERT INTO "Vehicle"
        VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8)
        RETURNING *
    `;
    const values = [
        vehicle.vin,
        vehicle.manufacturerName,
        vehicle.description,
        vehicle.horsePower,
        vehicle.modelName,
        vehicle.modelYear,
        vehicle.purchasePrice,
        vehicle.fuelType
    ];

    const res = await pool.query(text, values);

    return res.rows[0];
}

// since we randomly generate the VIN, there is a chance that an existing VIN is generated, so we need to make sure that a vehicle record with the given VIN does not exist
// we try to insert the vehicle, if it fails, we generate a new VIN and try again
async function persistentAddVehicle(vehicle) {
    let vin = undefined;

    do {
        vin = generateVin();
    }
    while (await getVehicle(vin) != null);

    vehicle.vin = vin;
    return await addVehicle(vehicle);
}

async function updateVehicle(vin, vehicle) {
    const text = `
        UPDATE "Vehicle"
        SET "manufacturerName" = $1,
            "description" = $2,
            "horsePower" = $3,
            "modelName" = $4,
            "modelYear" = $5,
            "purchasePrice" = $6,
            "fuelType" = $7
        WHERE vin = $8
        RETURNING *
    `;
    const values = [
        vehicle.manufacturerName,
        vehicle.description,
        vehicle.horsePower,
        vehicle.modelName,
        vehicle.modelYear,
        vehicle.purchasePrice,
        vehicle.fuelType,
        vin
    ];

    const res = await pool.query(text, values);
    return res.rows[0];
}

async function deleteVehicle(vin) {
    const text = `DELETE FROM "Vehicle" WHERE vin = $1 RETURNING *`;
    const values = [vin];
    const res = await pool.query(text, values);
    return res.rows[0];
}

//exporting the pool object to be used in other files
module.exports = {
    getVehicles,
    getVehicle,
    persistentAddVehicle,
    updateVehicle,
    deleteVehicle
}