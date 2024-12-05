-- Create the database (incase one does not exist)
CREATE DATABASE apollo;

-- connect to the database
\c apollo

-- Create the Vehicle table
-- All names are lowercase because Postgres, by default, converts all names to lowercase
CREATE TABLE "Vehicle" (
    vin VARCHAR(17) PRIMARY KEY CONSTRAINT lengthcheck CHECK (char_length(vin) = 17),
    "manufacturerName" VARCHAR(50) NOT NULL,
    "description" VARCHAR(250) NOT NULL,
    "horsePower" INT NOT NULL,
    "modelName" VARCHAR(50) NOT NULL,
    "modelYear" INT NOT NULL,
    "purchasePrice" DECIMAL NOT NULL,
    "fuelType" VARCHAR(25) NOT NULL
);

