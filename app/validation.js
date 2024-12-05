const { isEmptyObject } = require("./utils");
function validateVehicle(vehicle) {
    let message = {
        status: 200,
        errors: {}
    };

    // making sure that the vehicle object exists
    if (vehicle == null || typeof vehicle !== "object" || isEmptyObject(vehicle)) {
        message.status = 400;
        message.errors["invalidObject"] = ["Please provide a valid vehicle object as a JSON."];
        return message;
    }

    // validating every property one by one
    validateProperty(vehicle, "manufacturerName", validateManufacturerName, message);
    validateProperty(vehicle, "description", validateDescription, message);
    validateProperty(vehicle, "horsePower", validateHorsePower, message);
    validateProperty(vehicle, "modelName", validateModelName, message);
    validateProperty(vehicle, "modelYear", validateModelYear, message);
    validateProperty(vehicle, "purchasePrice", validatePurchasePrice, message);
    validateProperty(vehicle, "fuelType", validateFuelType, message);

    // if there are any errors, we return with a 422 status code
    if (Object.keys(message.errors).length > 0) {
        message.status = 422
    }

    return message;
}

function validateProperty(vehicle, propertyName, validationFunction, message) {
    let errors = validationFunction(vehicle);
    if (errors.length > 0) {
        message.errors[propertyName] = errors;
    }
}

function validateStringValue(value) {
    let errors = [];

    // making sure that the value is not null or undefined
    if (value == null) {
        errors.push("Value cannot be null or undefined.");
    }

    // making sure that the value is a string
    if (typeof value !== "string") {
        errors.push("The value should be a string!");
    }
    // making sure that the value is not an empty string
    else if (value.trim() === "") {
        errors.push("Value cannot be an empty string.");
    }

    return errors;
}

// I do not validate for VIN in vehicle because for new records, it is generated randomly in our system
// and for existing records, we get vin as a query parameter rather than a part of the vehicle object in request body
function validateVin(vin) {
    // making sure that vin is a non-empty string
    let errors = validateStringValue(vin);

    // if there are no errors in previous step (i.e. vin is defined and an non-empty string), then we perform vin specific validations
    if (errors.length == 0) {
        // a vin must be 17 characters long
        if (vin.length != 17) {
            errors.push("VIN must be 17 characters long.");
        }
        
        
        // a vin can only contain capital letters (besides I, O, Q) and 0-9 digits
        let pattern = /^[A-HJ-NPR-Z0-9]+$/

        if (vin.match(pattern) === null) {
            errors.push("A VIN can only contain capital letters (excluding I,O,Q) and digits from 0-9.");
        }
    }

    // I return an object so that we are consistent with how we return errors in validateVehicle
    if (errors.length > 0) {
        return {"VIN": errors};
    }
    return {}
}

function validateManufacturerName(vehicle) {
    let errors = [];

    // making sure vehicle has a manufacturer's name property
    if (!(vehicle.hasOwnProperty("manufacturerName"))) {
        errors.push("Vehicle must have a manufacturer's name.");
    }
    else {
        // validating the name string
        errors = errors.concat(validateStringValue(vehicle.manufacturerName));
    }

    return errors;
}

function validateDescription(vehicle) {
    let errors = [];
    if (!(vehicle.hasOwnProperty("description"))) {
        errors.push("Vehicle must have a description.");
    }
    else {
        errors = errors.concat(validateStringValue(vehicle.description));
    }

    return errors;
}

// validates that the value is a non-negative integer
// the reason why I allow 0 is may be there is a case where horse power is not known at the moment, so we initialize it to 0
function validateNonNegativeInteger(value) {
    let errors = [];

    // validating that the value is of type number
    if (typeof value !== "number") {
        errors.push("The value should be a number!");
    }
    else {
        if (Number.isInteger(value) === false) {
            errors.push("The value should be an integer, not decimal.");
        }
        if (value < 0) {
            errors.push("The value should be a non-negative integer.");
        }
    }

    return errors;
}

function validateNonNegativeDecimal(value) {
    let errors = [];

    // I assume that an integer can be treated as a decimal (like 3 -> 3.0), so I only check if the value is a number or not
    if (typeof value !== "number") {
        errors.push("The value should be a number!");
    }
    else if (value < 0) {
        errors.push("The value should be a non-negative decimal.");
    }

    return errors;
}

function validateHorsePower(vehicle) {
    let errors = [];
    if (!(vehicle.hasOwnProperty("horsePower"))) {
        errors.push("Vehicle must have a horse power.");
    }
    else {
        if (typeof vehicle.horsePower !== "number") {
            errors.push("Horse power must be a number.");
        }
        else {
            errors = errors.concat(validateNonNegativeInteger(vehicle.horsePower));
        }
    }

    return errors;
}

function validateModelName(vehicle) {
    let errors = [];
    if (!(vehicle.hasOwnProperty("modelName"))) {
        errors.push("Vehicle must have a model name.");
    }
    else {
        errors = errors.concat(validateStringValue(vehicle.modelName));
    }

    return errors;
}

function validateModelYear(vehicle) {
    let errors = [];
    
    if (!(vehicle.hasOwnProperty("modelYear"))) {
        errors.push("Vehicle must have a model year.");
    }
    else {
        errors = errors.concat(validateNonNegativeInteger(vehicle.modelYear));

        // making sure that the year has 4 digits
        if (vehicle.modelYear?.toString().length != 4) {
            errors.push("A year should have 4 digits.");
        }
    }

    return errors;
}

function validatePurchasePrice(vehicle) {
    let errors = [];

    if (!(vehicle.hasOwnProperty("purchasePrice"))) {
        errors.push("Vehicle must have a purchase price.");
    }
    else {
        errors = errors.concat(validateNonNegativeDecimal(vehicle.purchasePrice));
    }

    return errors;
}

const fuelType = ["petrol", "deisel", "electric", "hybrid"];
function validateFuelType(vehicle) {
    let errors = [];

    if (!(vehicle.hasOwnProperty("fuelType"))) {
        errors.push("Vehicle must have a fuel type.");
    }
    else {
        errors = errors.concat(validateStringValue(vehicle.fuelType));

        // we can also further validate fuel type by checking if it is one of the known fuel types
        if (fuelType.includes(vehicle.fuelType?.trim().toLowerCase()) === false) {
            errors.push("Invalid fuel type.");
        }
    }

    return errors;
}

module.exports = {
    validateVehicle,
    validateVin
};