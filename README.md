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
</ol>


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
