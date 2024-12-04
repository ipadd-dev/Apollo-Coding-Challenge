const request = require('supertest');
const app = require('../app/server');

var chai = require('chai');  
var expect = chai.expect;    // Using Expect style

// test group for GET requests
describe("GET /vehicle", () => {
    it("should return all vehicles", async () => {
        const res = await request(app).get("/vehicle");
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.an("array");
    });
});

describe("POST /vehicle", () => {
    it ("show add a new vehicle", async() => {
        let record = {
            manufacturerName: "Toyota",
            description: "Brand new corolla",
            horsePower: 200,
            modelName: "Corolla",
            modelYear: 2021,
            purchasePrice: 20200.60,
            fuelType: "Petrol"
        };
        const res = await request(app).post("/vehicle").send(record);
        expect(res.statusCode).to.equal(201);
        expect(res.body).to.be.an("object");
        
        // making sure that the body has a unique vin and all the other properties
        expect(res.body).to.have.property("vin");
        expect(res.body).to.have.property("manufacturer_name");
        expect(res.body).to.have.property("description");
        expect(res.body).to.have.property("horse_power");
        expect(res.body).to.have.property("model_name");
        expect(res.body).to.have.property("modelYear");
        expect(res.body).to.have.property("purchasePrice");
        expect(res.body).to.have.property("fuelType");
    });
});