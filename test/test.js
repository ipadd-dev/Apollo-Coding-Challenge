const request = require('supertest');
const app = require('../app/server');
const generateVin = require("../app/generateVin")
const { validateVehicle } = require("../app/validation");

var chai = require('chai');  
var expect = chai.expect;    // Using Expect style
var assert = chai.assert;    // Using Assert style

function getSampleRecord() {
    return {
        manufacturerName: "Toyota",
        description: "Brand new corolla",
        horsePower: 200,
        modelName: "Corolla",
        modelYear: 2021,
        purchasePrice: 20200.60,
        fuelType: "Petrol"
    };
}

function areVehicleRecordsSame(r1, r2) {
    isR1Valid = validateVehicle(r1).status == 200;
    isR2Valid = validateVehicle(r2).status == 200;

    // this means we are gauranteed to have all properties and they are correctly defined, thus avoiding any crashes or errors
    if (isR1Valid && isR2Valid) {
        return r1.VIN == r2.VIN &&
            r1.manufacturerName == r2.manufacturerName &&
            r1.description == r2.description &&
            r1.horsePower == r2.horsePower &&
            r1.modelName == r2.modelName &&
            r1.modelYear == r2.modelYear &&
            r1.purchasePrice == r2.purchasePrice &&
            r1.fuelType == r2.fuelType;
    }

    return false;
}

// test group for GET requests
describe("GET /vehicle", () => {
    it("should return all vehicles", async () => {
        const res = await request(app).get("/vehicle");
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.an("array");
    });

    it("should return vehicle record of the given VIN", async () => {
        // adding a record and getting its VIN
        let record = getSampleRecord();
        const res1 = await request(app).post("/vehicle").send(record);
        expect(res1.statusCode).to.equal(201);

        // searching for the vehicle record through the vin of the newly created entry
        const res2 = await request(app).get("/vehicle/" + res1.body.vin);
        expect(res2.statusCode).to.equal(200);
        expect(areVehicleRecordsSame(res1.body, res2.body)).to.equal(true);
    });

    it("get request should fail with invalid VIN", async () => {
        let vin = "ABCDEFGHIJKLMNOP";  // 16 characters long
        const res = await request(app).get("/vehicle/" + vin);

        // failed request
        expect(res.statusCode).to.equal(400);
        // an error in JSON format was sent back
        expect(res.body).to.be.an("object");
        expect(res.body["VIN"]).to.be.an("array");
    });
});

// test group for POST requests
describe("POST /vehicle", () => {
    it ("show add a new vehicle and the return object has all properties, including VIN", async() => {
        let record = getSampleRecord();
        const res = await request(app).post("/vehicle").send(record);
        expect(res.statusCode).to.equal(201);
        expect(res.body).to.be.an("object");
        
        // making sure that the body has a unique vin and all the other properties
        expect(res.body).to.have.property("vin");
        expect(res.body).to.have.property("manufacturerName");
        expect(res.body).to.have.property("description");
        expect(res.body).to.have.property("horsePower");
        expect(res.body).to.have.property("modelName");
        expect(res.body).to.have.property("modelYear");
        expect(res.body).to.have.property("purchasePrice");
        expect(res.body).to.have.property("fuelType");
    });

    it ("should return 400 if the request body is invalid", async() => {
        let record = "Testing";
        const res = await request(app).post("/vehicle").send(record);
        // returns 400
        expect(res.statusCode).to.equal(400); 
        // returns a JSON with error message
        expect(res.body).to.be.an("object");
        expect(res.body["invalidObject"]).to.be.an("array");
    });

    it ("should return 422 if the request body has malformed attributes", async() => {
        let record = getSampleRecord();
        
        // purposefully making certain fields null or of wrong type
        record.manufacturerName = null;
        record.description = 123;
        record.horsePower = "200";
        record.modelYear = 2021.5;

        const res = await request(app).post("/vehicle").send(record);
        // returns 422
        expect(res.statusCode).to.equal(422);
        // returns a JSON with error message
        expect(res.body).to.be.an("object");
        expect(res.body["manufacturerName"]).to.be.an("array");
        expect(res.body["description"]).to.be.an("array");
        expect(res.body["horsePower"]).to.be.an("array");
        expect(res.body["modelYear"]).to.be.an("array");
    });
});

// test group for PUT requests
describe("PUT /vehicle/:vin", async () => {
    it("should update a vehicle record", async () => {
        // creating a sample record
        let record = getSampleRecord();
        const res1 = await request(app).post("/vehicle").send(record);
        expect(res1.statusCode).to.equal(201);
        assert(res1.body.manufacturerName == record.manufacturerName);

        // updating the record
        record.manufacturerName = "Honda";
        const res2 = await request(app).put("/vehicle/" + res1.body.vin).send(record);
        expect(res2.statusCode).to.equal(200);
        assert(res2.body.manufacturerName != res1.body.manufacturerName);
    });

    it("should return 400 when VIN is less than 17 characters long", async () => {
        let record = getSampleRecord();
        let vin = "ABCDEFGHIJKLMNO"; // 15 characters long
        const res = await request(app).put("/vehicle/" + vin).send(record);
        expect(res.statusCode).to.equal(400);
        // expecting array of error messages
        expect(res.body.VIN).to.be.an("array");
    });

    it("should return 400 when VIN is greater than 17 characters long", async () => {
        let record = getSampleRecord();
        let vin = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // 26 characters long
        const res = await request(app).put("/vehicle/" + vin).send(record);
        expect(res.statusCode).to.equal(400);
        // expecting array of error messages
        expect(res.body.VIN).to.be.an("array");
    });

    it("should return 422 if the vehicle object in request body has malformed attributes", async () => {
        let record = getSampleRecord();
        
        // some random valid vin
        let vin = generateVin();

        // malformed attributes
        record.manufacturerName = null;
        record.horsePower = "abc";
        record.modelName = 123;
        record.fuelType = "Don't know";

        let res = await request(app).put("/vehicle/" + vin).send(record);

        expect(res.statusCode).to.equal(422);
        expect(res.body).to.be.an("object");

        // making sure we got a list of error for each malformed attribute
        expect(res.body["manufacturerName"]).to.be.an("array");
        expect(res.body["horsePower"]).to.be.an("array");
        expect(res.body["modelName"]).to.be.an("array");
        expect(res.body["fuelType"]).to.be.an("array");
    });

    it("invalid calls, including malformed vehicle object, should not update the original entry", async () => {
        // creating a sample record
        let record = getSampleRecord();
        const res1 = await request(app).post("/vehicle").send(record);
        expect(res1.statusCode).to.equal(201);

        // changing the record
        record.manufacturerName = null;
        record.description = 123;
        record.fuelType = "Electric";

        const res2 = await request(app).put("/vehicle/" + res1.body.vin).send(record);
        expect(res2.statusCode).to.equal(422);

        // getting the original record
        const res3 = await request(app).get("/vehicle/" + res1.body.vin);
        expect(res3.statusCode).to.equal(200);

        expect(areVehicleRecordsSame(res1.body, res3.body)).to.equal(true);
    });
});

describe("DELETE /vehicle/:vin", () => {
    it("should delete an entry and return no response body", async () => {
        // again, adding a value to the db and getting its vin
        const record = getSampleRecord();
        const res1 = await request(app).post("/vehicle").send(record);
        expect(res1.statusCode).to.equal(201);

        // deleting the record
        let vin = res1.body.vin;
        const res2 = await request(app).delete("/vehicle/" + vin);
        expect(res2.statusCode).to.equal(204);
        expect(res2.body).to.be.empty;

        // making sure that the record is deleted
        const res3 = await request(app).get("/vehicle/" + vin);
        expect(res3.statusCode).to.equal(200);
        expect(res3.body).to.be.empty;
    });

    it("should fail if invalid vin is provided", async () => {
        let originalCount = (await request(app).get("/vehicle")).length;

        let vin = "ABCDEFGHIJKLMNOP";  // 16 characters long
        const res = await request(app).delete("/vehicle/" + vin);
        expect(res.statusCode).to.equal(400);
        expect(res.body).to.be.an("object");
        expect(res.body["VIN"]).to.be.an("array");

        // making sure the counts are same
        let newCount = (await request(app).get("/vehicle")).length;
        expect(newCount).to.equal(originalCount);
    });
});