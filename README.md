# Project Setup and Run Instructions

## Dependencies

This project relies on a PostgreSQL database for data storage and retrieval. Make sure you have a PostgreSQL database instance set up and the necessary credentials to access it.

To connect to the database, you'll need to provide the following environment variables:

- DATABASE_USERNAME=your_database_username
- DATABASE_PASSWORD=your_database_password
- DATABASE_HOST=your_database_host
- DATABASE_PORT=your_database_port
- DATABASE_NAME=your_database_name

Make sure to update the `.env` file with the correct values for these variables before running the project.

## Installation

To install the required dependencies, run the following command:
        
    pip install -r requirements.txt


## Data Import

To import the predefined data into the database, follow these steps:

1. Open a command-line interface or a database management tool.
2. Connect to your PostgreSQL database using the appropriate credentials.
3. Run the following command to import the data from the SQL script:

       psql -U your_username -d your_database_name -f path/to/predefined_data.sql


    
## Run Aplication
  
    export FLASK_APP=your_flask_app.py
    flask run

## Code Formatting        

### Pylint

##### How to use pylint
    
    pylint your_file.py

### Black

##### How to use black

    black your_file.py

## API Documentation

### Base URL

The base URL for all API endpoints is: `http://localhost:5000/api`

### Endpoints

#### 1. GET /api/business

Retrieve paginated business items.

- **Parameters**:
- `page` (optional): Page number (default is 1).
- `limit` (optional): Number of items per page (default is 6).

- **Response**:
- `data`: List of business items with attributes such as `id`, `image_dir`, `location`, `price`, and `name`.
- `items_per_page`: Total items per page.
- `total`: Total number of business items.
- `page`: Current page number.

#### 2. POST /api/business

Create a new business item.

- **Request Body**:
```json
{
 "user_id": "User ID",
 "id": "Business ID",
 "image_dir": "Directory path to image",
 "location": "Business location",
 "price": "Business price",
 "name": "Business name"
}
