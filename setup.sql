-- Create the database (incase one does not exist)
CREATE DATABASE apollo;

-- connect to the database
\c apollo

-- Create the Vehicle table
-- All names are lowercase because Postgres, by default, converts all names to lowercase
CREATE TABLE vehicle (
    vin VARCHAR(17) PRIMARY KEY CONSTRAINT lengthcheck CHECK (char_length(vin) = 17),
    manufacturer_name VARCHAR(50) NOT NULL,
    description VARCHAR(250) NOT NULL,
    horse_power INT NOT NULL,
    model_name VARCHAR(50) NOT NULL,
    model_year INT NOT NULL,
    purchase_price DECIMAL NOT NULL,
    fuel_type VARCHAR(25) NOT NULL
);

