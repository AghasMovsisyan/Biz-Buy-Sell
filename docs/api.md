## API Documentation

### Endpoints

#### 1.  GET /api/business

Retrieve Paginated Business Items.

- **Request Method**: GET
-  **URL**: ``/api/business``

##### Parameters
- `page` (optional): Page number for pagination (default is 1).
- `limit` limit (optional): Number of items per page (default is 6).

##### Response
- **Status Code**: 200 (OK)
- **Response Body**:

```json
{
  "error": false,
  "data": [
    {
      "id": 1,
      "images": [
        "/static/business/1/image1.jpg",
        "/static/business/1/image2.jpg"
      ],
      "name": "Business Name 1",
      "location": "New York",
      "price": "$200,000"
    },
    {
      "id": 2,
      "images": [
        "/static/business/2/image1.jpg",
        "/static/business/2/image2.jpg"
      ],
      "name": "Business Name 2",
      "location": "Los Angeles",
      "price": "$150,000"
    },
    // ... (more business items)
  ],
  "items_per_page": 10,
  "total": 42,
  "page": 2
}

```

- **Status Code**: 400 (Bad Request)
- **Response Body**:

```json
{
  "error": true,
  "message": "Invalid page or limit value. Please provide valid integers."
}

```
- **Status Code**: 404 (Not Found)
- **Response Body**:

```json
{
  "error": true,
  "message": "Page not found. The requested page does not exist."
}
```

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
##### Response Body
```json
{
  "Business created successfully id(business)"
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
```

#### 6. POST /api/business/{business_id}/upload

Upload and Save Images for a Specific Business.

- **Request Method**: POST
- **URL**: `/api/business/{business_id}/upload`

##### Parameters

- `business_id` (integer, path): The ID of the business to upload images for.

##### Request

- Request Headers: Content-Type: multipart/form-data
- Request Body: images (multiple files): The images to be uploaded.

##### Response

- **Status Code**: 201 (Created)
- **Response Body**:


```json
{
  "error": false,
  "message": "Images uploaded successfully.",
  "uploaded_images": [
    "/static/business/{business_id}/image1.jpg",
    "/static/business/{business_id}/image2.jpg",
    "/static/business/{business_id}/image3.jpg"
  ]
}
```  
- **Status Code**: 400 (Bad Request)
- **Response Body**:


```json
{
  "error": true,
  "message": "No images provided."
}
```
- **Status Code**: 404 (Not Found)
- **Response Body**:

```json
{
  "error": true,
  "message": "Business not found."
}
```

#### 7. DELETE /api/business/{business_id}/delete/{filename}

Delete Image for a Specific Business

- **Request Method**: DELETE
- **URL**: `/api/business/{business_id}/delete/{filename}`

##### Parameters
- `business_id` (integer, path): The ID of the business.
- `filename` (string, path): The name of the image file to be deleted.

##### Response

- **Status Code**: 200 (OK)
- **Response Body**:

```json
{
  "error": false,
  "message": "Image deleted successfully."
}

```

- **Status Code**: 404 (Not Found)
- **Response Body**:

```json
{
  "error": true,
  "message": "Business not found."
}

```

```json
{
  "error": true,
  "message": "Image not found."
}

```
