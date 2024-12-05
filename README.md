# Apollo Engineering Coding Exercise

## Overview
This project is a simple web service that provides API endpoints to manage a list of Vehicle records. A Vehicle record stores useful information about a vehicle such as its VIN number, manufacturer, horse power, model, year etc.

## Requirements
This project is built using JavaScript and utilizes the Node.js and Express.js libraries. The following are all the requirements to run this project:
<ol>
    <li>Node.js</li>
        <ol>
            <li>Used to build the server-side application, which handles the HTTP requests and perform SQL queries on our Vehicle table</li>
        </ol>
    <li>Express.js</li>
        <ol>
            <li>Provides a simplified interface to create the backend</li>
        </ol>
    <li>PostgresSQL</li>
        <ol>
            <li>My choice of DBMS for the project</li>
        </ol>
    <li>node-postgres</li>
        <ol>
            <li>Collection of node.js modules for interfacing with a PostgreSQL database</li>
        </ol>
    <li>mocha, chai, supertest</li>
        <ol>
            <li>Frameworks used for testing</li>
            <li>Please note that I used v4.5.0 for chai, whereas the latest version is v5.0.0 and my application does not support this latest version.</li>
        </ol>
</ol>

## Project Structure

The project is organized as follows:

- **app/**: Contains the main application code.
  - **db.js**: Handles database operations for the Vehicle entity.
  - **generateVin.js**: Contains a function that generates random VIN numbers.
  - **server.js**: The entry point of the application.
  - **utils.js**: A place to store utility functions that are used throughout our application.
  - **validation.js**: Contains validation logic for the Vehicle entity.
- **env.json**: Contains the environment variables used to setup the PostgreSQL database.
- **package.json**: Contains metadata about the project, dependencies, and scripts for the application.
- **setup.sql**: SQL script to set up the PostgreSQL database and create the necessary tables. You will see how it is used in the Quick Start section.

## Quick Start
### Pre-requisites
Before you start, please make sure that you have the following tools and libraries installed on your machine:
<ul>
    <li>Node.js (I used v20.17.0, but any relatively new version should be suffice)</li>
    <li>npm (Node Package Manager)</li>
    <li>PostgreSQL (I used v17.0, but again any relatively new version should be suffice)</li>
</ul>

### Setup
#### 1. Clone Project
```
git clone https://github.com/ipadd-dev/Apollo-Coding-Challenge.git
cd "Apollo-Coding-Challenge"
```

#### 2. Install Dependencies
```
npm install
```
This installs the depedencies listed inside [package.json](./package.json) file (in our case, we install express and pg)

#### 3. Defining Environment Variables
Please modify the base [env.json](./env.json) file to define environment variables used to configure our PostgreSQL database. 
```
{
    "USER": YOUR_USERNAME,
    "PASSWORD": YOUR_PASSWORD,
    "HOST": YOUR_HOSTNAME,
    "PORT": PORT,
    "DATABASE": "apollo"
}
```

Here is what each field represents:
<ul>
  <li><strong>USER:</strong> The username of your database account that will be used to connect to the database. It is <em>postgres</em> by default.</li>
  <li><strong>PASSWORD:</strong> The password the specified user account.</li>
  <li><strong>HOST:</strong> The address of the machine where the PostgreSQL server is running. It is <em>localhost</em> by default.</li>
  <li><strong>PORT:</strong> The port on which the server is running on. It is <em>5432</em> by default.</li>
</ul>

The database name is expected to be ``apollo`` in all of my SQL scripts so please do not change that value.

#### 4. Setting up the Database
Please run the following command, replacing USERNAME with your account's username.
```
psql -U USERNAME -f setup.sql
```
The ``setup.sql`` file creates a database named ``apollo`` and table named ``vehicle`` with columns defined in the instruction document.

#### 5. Run Server
We are ready to start up our app and test out our API! In ``package.json``, we can define scripts that can be run using ``npm run <script_name>`` command. One of the scripts I defined is ``start``, which changes the directory to ``/app`` and runs the ``node server.js`` line.
```
npm run start
```
This should start the application on port 3000 ([http://localhost:3000](http://localhost:3000))

## Testing
_Before starting with tests, please make sure that you are using v4.5.0 for chai. My application and testing did not work with versions > v5.0.0 as chai switched from using CommonJS to ESM in newer versions, and since my app uses CommonJS, the imports and exports would not work._

I have written a test suite that tests our API endpoints using ``chai``, ``mocha``, and ``supertest`` and is operatable through CLI. In general, the tests make sure that all of our API behave correctly. Additionally, when bad or malformed data is sent, it makes sure that the API calls return back with correct status codes (400, 422) and return JSON-formatted errors.
To run the tests, go to the root directory of the project and run the command ``npm run test``. This should give you an overview of all the tests and if they passed/failed. Here is a sample image from my testing:

![image](https://github.com/user-attachments/assets/a3b0ad5a-5198-4f64-9dcb-e33965925adc)

## Future Improvements
These are some places where my application could improve and it would lead to an overall better experience and a more robust system.

### Generating accurate VINs
After doing some research on VINs, I found that each digit and letter has a specific meaning and these VINs are not fully random after all. Due to the scope and time limitations of this project, I did not create a function that generates an accurate VIN and resorted for a randomized VIN generator. The randomized VIN generator works for small scale usages but it will struggle in real-world scenarios. Since we already collect vehicle information like ``manufacturer``, ``modelName``, ``modelYear``, ``fuelType`` etc, we can use these to VINs that are more accurate and reflect these data points. The VIN would still be semi-random since we do not have other data needed to complete the VIN.
