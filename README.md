# Run App


## Environment Variables

#### The following environment variables need to be set up for the application to run properly:

**DATABASE_URI**: The URI for connecting to the PostgreSQL database. It should be in the format:

    export DATABASE_URI = 'postgresql+psycopg2://postgres:password@localhost:5432/flask_db' 
**DB_USERNAME**: The username for accessing the database.
    
    export DB_USERNAME='postgres'
**DB_PASSWORD**: The password for the database user.
    
    export DB_PASSWORD='password'

## Importing Predefined Data to the Database

predefined data that you want to import into the database using the SQLAlchemy models, follow these steps:

1. Set up the database connection:
   - Update the `DATABASE_URI` variable in your code with the correct connection URL for your PostgreSQL database. The format of the `DATABASE_URI` should be:
     ```
     'postgresql+psycopg2://<username>:<password>@<host>:<port>/<database_name>'
     ```
     Replace `<username>`, `<password>`, `<host>`, `<port>`, and `<database_name>` with the appropriate values for your PostgreSQL setup.

2. Define the predefined data:
 
   - Set up the database connection:
     ```python
     DATABASE_URI = 'postgresql+psycopg2://postgres:password@localhost:5432/flask_db'
     engine = create_engine(DATABASE_URI)
     Session = sessionmaker(bind=engine)
     session = Session()
     ```

   - Define instances of the models and populate their attributes with the predefined data:
     ```python
     user = User(
         id=6,
         email='Vahag@mail.ru',
         password_hash='d2as86daadd1d',
         salt=2,
         first_name='Vahag',
         last_name='Babken',
         tel_number='+1dasd2651631',
         dalte_of_birth=datetime(516, 11, 18)
     )

     business = Busines(
         id=6,
         user_id=6,
         image_dir='',
         location='Ererbuni 5/1',
         property_type='Hotel',
         price=250000,
         year_built='2021',
         size=4500,
         name='Orlan Hotel'
     )
     ```

   - Add the instances to the session and commit the changes:
     ```python
     session.add(user)
     session.add(business)
     session.commit()
     ```

4. Run the script or execute the code: Execute the Python script or the code in the interactive Python shell to import the predefined data into the database.

5. Verify the data: After executing the script or code, verify that the predefined data has been successfully imported into the database. You can use database tools, SQL queries, or your application's endpoints to inspect the data.


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
