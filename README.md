# Project Setup and Run Instructions

## Installation

To install the required dependencies, run the following command:
        
    pip install -r requirements.txt

## Dependencies

This project relies on a PostgreSQL database for data storage and retrieval. Make sure you have a PostgreSQL database instance set up and the necessary credentials to access it.

To connect to the database, you'll need to provide the following environment variables:

- DATABASE_USERNAME=your_database_username
- DATABASE_PASSWORD=your_database_password
- DATABASE_HOST=your_database_host
- DATABASE_PORT=your_database_port
- DATABASE_NAME=your_database_name

Make sure to update the `.env` file with the correct values for these variables before running the project.


## Data Import

To import the predefined data into the database, follow these steps:

1. Open a command-line interface or a database management tool.
2. Connect to your PostgreSQL database using the appropriate credentials.
3. Run the following command to import the data from the SQL script:

       psql -U your_username -d your_database_name -f path/to/predefined_data.sql


## Flask 
    
#### Run Flask App
  
    export FLASK_APP=your_flask_app.py
    flask run

## Code Formatting        

## Pylint

#### How to use pylint
    
    pylint your_file.py

## Black

#### How to use pylint

    black your_file.py
