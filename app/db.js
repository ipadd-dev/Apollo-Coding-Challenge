const { Pool } = require("pg");
const env = require("../env.json");
const generateVin = require("./generateVin");

// creating a new pool object that will be used to connect to the database
const pool = new Pool({
    host: env.HOST,
    port: env.PORT,
    user: env.USER,
    password: env.PASSWORD,
    database: env.DATABASE
});

async function getVehicles() {
    const query = "SELECT * FROM vehicle";
    const res = await pool.query(query);
    return res.rows;
}

async function getVehicle(vin) {
    const text = "SELECT * FROM vehicle WHERE vin = $1";
    const values = [vin];
    const res = await pool.query(text, values);

    return res.rows[0];
}

async function addVehicle(vehicle) {
    // I do not directly insert values into the query to prevent sql injection
    // in the library I am using, we can put placeholders in the query and then provide list of values, and it safely fetches data using these values
    const text = `
        INSERT INTO vehicle
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
        UPDATE vehicle
        SET manufacturer_name = $1,
            description = $2,
            horse_power = $3,
            model_name = $4,
            model_year = $5,
            purchase_price = $6,
            fuel_type = $7
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
    const text = "DELETE FROM vehicle WHERE vin = $1 RETURNING *";
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