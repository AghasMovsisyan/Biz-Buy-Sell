## API Documentation

### Endpoints

#### Business API

1.  List businesses

    __API:__ `GET /api/business`

    Retrieve paginated business items.
    
    __Parameters__
    - `page` (optional): Page number for pagination (default is 1).
    - `limit` limit (optional): Number of items per page (default is 6).
    
    __Responses__
    
    a) Status Code: 200 (OK)
    
    _Response Body_:
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
          "price": 200000
        },
        {
          "id": 2,
          "images": [
            "/static/business/2/image1.jpg",
            "/static/business/2/image2.jpg"
          ],
          "name": "Business Name 2",
          "location": "Los Angeles",
          "price": 150000
        }
      ],
      "items_per_page": 2,
      "total": 42,
      "page": 2
    }
    ```
    
    b) Status Code: 400 (Bad Request)

    When validation fails
    
    _Response Body_:
    
    ```json
    {
      "error": true,
      "message": "Invalid page value. Please provide valid integers."
    }
    ```
    
    c) Status Code: 404 (Not Found)

    When page not found
    
    _Response Body_:
    
    ```json
    {
      "error": true,
      "message": "Page not found. The requested page does not exist."
    }
    ```

2. Create business

    __API:__ `POST /api/business`

    Create a new business item.
    
    __Request__
    
   _Requset Body_:
    
    ```json
    {
      "error": false,
      "data": { 
          "location": "Yerevan, Arabkir 1",
          "property_type": "Hotel",
          "price": 300456,
          "year_built": "2023",
          "size": 12,
          "name": "Business 1",
          "description": "Best business in Arabkir"
      }
    }
    
    ```
    __Responses__
    
    a) Status Code: 201 (Created)
    
   _Response Body_:
    
    ```json
    {
      "error": false,
      "data": {
          "id": 1,
          "location": "Yerevan, Arabkir 1",
          "property_type": "Hotel",
          "price": 300456,
          "year_built": "2023",
          "size": 12,
          "name": "Business 1",
          "description": "Best business in Arabkir"
      }
    }
    ```
    
   b) _Status Code_: 400 (Bad Request)

   When validation fails

   _Response Body_:
    
    ```json
    {
      "error": true,
      "message": "\"size\" should be integer"
    }
    ```
    
   c) _Status Code_: 401 (Unauthorized)

   When user is not authenticated.

   _Response Body_:
    
    ```json
    {
      "error": true,
      "message": "Unauthorized"
    }
    ```

3. Get business by ID

   __API:__ `GET /api/business/{business_id}`
    
    __Responses__

   a) Status Code: 200 (OK)

   *Response Body*:
    
   ```json
   {
     "error": false,
     "data": {
          "id": 2,
          "location": "Yerevan, Arabkir 1",
          "property_type": "Hotel",
          "price": 300456,
          "year_built": "2023",
          "size": 12,
          "name": "Business 1",
          "description": "Best business in Arabkir",
          "images": [
            "/static/business/2/1.jpg",
          ],
      }
   }
   ```

   b) Status Code: 400 (Bad Requset)

   Validation fails
    
   _Response Body_:
    
    ```json
    {
      "error": true,
      "message": "Invalid business ID"
    }
    ```

    
   c) Status Code: 404 (Not Found)

   Business not found

   _Response Body_
    
    ```json
    {
      "error": true,
      "message": "Business not found"
    }
    ```

#### 4. PUT /api/business/{business_id}

Update details of a specific business by ID.

- **Request Method**: PUT
- **URL**: `/api/business/{business_id}`z  

##### Parameters

- `business_id` (integer, path): The ID of the business to update.

##### Request

- **Requset Body**:


```json
{
  "error": false,
  "data": {
      "id": "Updated business id",
      "location": "Updated business location",
      "property_type": "Updated type of property",
      "price": "Updated business price",
      "year_built": "Updated year the property was built",
      "size": "Updated size of the property",
      "name": "Updated business name",
      "description": "Updated business description"
  }
}
```

##### Response

- **Status Code**: 200 (OK)
- **Response Body**:

```json
{
  "error": false,
  "message": "Business updated successfully"
}
```

- **Status Code**: 400 (Bad Request)
- **Response Body**:

```json
{
  "error": true,
  "message": "Invalid business ID"
}
```
or

```json
{
  "error": true,
  "message":  "Invalid data format or empty data"
}
```

- **Status Code**: 401 (Unauthorized)
- **Response Body**:

```json
{
  "error": true,
  "message": "Unauthorized"
}
```
- **Status Code**: 403 (Forbidden)
- **Response Body**:
```json
{
  "error": true,
  "message": "Forbidden"
}
```

- **Status Code**: 404 (Not Found)
- **Response Body**:
```json
{
  "error": true,
  "message": "Not Found"
}

```

#### 5. DELETE /api/business/{business_id}

Delete a specific business by ID.

- **Request Method**: DELETE
- **URL**: `/api/business/{business_id}`

##### Parameters

- `business_id` (integer, path): The ID of the business to delete.

##### Response

- **Status Code**: 202 (Accepted)
- **Response Body**:

```json
{
  "error": "false"
  "message": "Business deleted successfully"
}
```
- **Status Code**: 400 (Bad Requset)
- **Response Body**:

```json
{
  "error": "true"
  "message": "Invalid business ID"
}
```
- **Status Code**: 401 (Unauthorized)
- **Response Body**:

```json
{
  "error": "true"
  "message": "Unauthorized"
}
```
- **Status Code**: 403 (Forbidden)
- **Response Body**:

```json
{
  "error": "true"
  "message": "Forbidden"
}
```
- **Status Code**: 404 (Not Found)
- **Response Body**:

```json
{
  "error": "true"
  "message": "Not Found"
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
