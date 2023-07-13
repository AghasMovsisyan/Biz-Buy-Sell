# Run App


## Environment Variables

#### The following environment variables need to be set up for the application to run properly:

**DATABASE_URI**: The URI for connecting to the PostgreSQL database. It should be in the format:

    export DATABASE_URI = 'postgresql+psycopg2://postgres:password@localhost:5432/flask_db' 
**DB_USERNAME**: The username for accessing the database.
    
    export DB_USERNAME='postgres'
**DB_PASSWORD**: The password for the database user.
    
    export DB_PASSWORD='password'


## Dependencies

This project relies on a PostgreSQL database for data storage and retrieval. Make sure you have a PostgreSQL database instance set up and the necessary credentials to access it.

To connect to the database, you'll need to provide the following environment variables:

- `DATABASE_USERNAME`: The username for accessing the database.
- `DATABASE_PASSWORD`: The password associated with the username.
- `DATABASE_HOST`: The hostname or IP address of the database server.
- `DATABASE_PORT`: The port number on which the database is running.
- `DATABASE_NAME`: The name of the database to connect to.

Make sure to update the `.env` file with the correct values for these variables before running the project.


## Data Import

To import the predefined data into the database, follow these steps:

1. Open a command-line interface or a database management tool.
2. Connect to your PostgreSQL database using the appropriate credentials.
3. Run the following command to import the data from the SQL script:

   ```bash
   psql -U <username> -d <database_name> -f path/to/predefined_data.sql


## Flask 

### Install Flask 

    pip install Flask

### Starting the Development Server

#### For Linux
  
    export FLASK_APP=main.py

#### For Windows
  
    setx FLASK_APP "main.py"
    
#### Flask run
  
    flask run



# Pylint

### Install

For command line use, pylint is installed with:

    pip install pylint

How to use pylint
    
    pylint name.py
