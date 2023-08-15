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

- **Request Method**: POST
- **URL**: `/api/business`

##### Request Body

```json
{
  "user_id": "User ID",
  "id": "Business ID",
  "image_dir": "Directory path to image",
  "location": "Business location",
  "property_type": "Type of property",
  "price": "Business price",
  "year_built": "Year the property was built",
  "size": "Size of the property",
  "name": "Business name",
  "description": "Business description"
}

```

#### 3. GET /api/business/{business_id}

Retrieve details of a specific business by ID.

- **Request Method**: GET
- **URL**: `/api/business/{business_id}`

##### Parameters

- `business_id` (integer, path): The ID of the business to retrieve.

##### Response

- **Status Code**: 200 (OK)
- **Response Body**:

```json
{
  "id": "Business ID",
  "user_id": "User ID",
  "image_dir": "Directory path to image",
  "location": "Business location",
  "price": "Business price",
  "name": "Business name",
  "authenticated_user_id": 2
}
```
#### 4. PUT /api/business/{business_id}

Update details of a specific business by ID.

- **Request Method**: PUT
- **URL**: `/api/business/{business_id}`

##### Parameters

- `business_id` (integer, path): The ID of the business to update.

##### Request Body

```json
{
  "user_id": "User ID",
  "image_dir": "Updated directory path to image",
  "location": "Updated business location",
  "property_type": "Updated type of property",
  "price": "Updated business price",
  "year_built": "Updated year the property was built",
  "size": "Updated size of the property",
  "name": "Updated business name",
  "description": "Updated business description"
}
```

#### 5. DELETE /api/business/{business_id}

Delete a specific business by ID.

- **Request Method**: DELETE
- **URL**: `/api/business/{business_id}`

##### Parameters

- `business_id` (integer, path): The ID of the business to delete.

##### Response

- **Status Code**: 200 (OK)
- **Response Body**:

```json
{
  "message": "Business deleted successfully"
}
