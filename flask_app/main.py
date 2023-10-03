"""aplication run"""
import os
from flask import Flask, Response, request, jsonify, send_from_directory
from flask_cors import CORS
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, joinedload
from sqlalchemy.exc import SQLAlchemyError
from werkzeug.utils import secure_filename
from models import User, Business, PropertyType, Base, database_uri


app = Flask(__name__)
CORS(app)  # This will enable CORS   for all routes in the app
app.config.from_object(__name__)

engine = create_engine(database_uri)
Base.metadata.bind = engine
Session = sessionmaker(bind=engine)

UPLOAD_FOLDER = "static/business"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


def root_dir():
    """Gives the directory name of the current script file."""
    return os.path.abspath(os.path.dirname(__file__))


def get_file(filename):
    """Get file"""
    try:
        src = os.path.join(root_dir(), filename)
        with open(src, "rb") as file:
            content = file.read()
        return content
    except IOError as exc:
        return str(exc)


@app.route("/", methods=["GET"])
def serve_index_page():
    """
    A route handler for the root URL ("/") that serves the index.html page.
    Retrieves the content of 'index.html' file and returns it as a response with HTML mimetype.
    """
    content = get_file("templates/index.html")
    return Response(content, mimetype="text/html")


@app.route("/api/business", methods=["GET"])
def get_business():
    """Retrieves paginated items from the 'Business' collection based on 'page' and 'limit'."""

    limit = request.args.get("limit", 6)
    page = request.args.get("page", 1)

    # Check if the 'page' parameter is provided and is a valid positive integer
    if str(page).isdigit() and int(page) >= 1:
        page = int(page)
    else:
        return (
            jsonify(
                error=True,
                message="Invalid page value. Please provide valid integers.",
            ),
            400,  # Status Code: 400 (Bad Request)
        )

        # Check if the 'limit' parameter is provided and is a valid positive integer
    if str(limit).isdigit() and int(limit) >= 1:
        limit = int(limit)
    else:
        return (
            jsonify(
                error=True,
                message="Invalid limit value. Please provide a valid positive integer for 'limit'.",
            ),
            400,  # Status Code: 400 (Bad Request)
        )

    page = int(page)
    limit = int(limit)
    offset = (page - 1) * limit

    # Open a new session for the API call
    session = Session()
    try:
        businesses_items = (
            session.query(Business)
            .with_entities(
                Business.id,
                Business.location,
                Business.price,
                Business.name,
            )
            .offset(offset)
            .limit(limit)
            .all()
        )

        total = session.query(Business).count()

        # Check if the provided 'limit' exceeds the total number of items
        if limit > total:
            return (
                jsonify(
                    error=True,
                    message="The requested 'limit' exceeds the total number of items.",
                ),
                400,  # Status Code: 400 (Bad Request)
            )

        if not businesses_items:
            return (
                jsonify(
                    error=True,
                    message="Page not found. The requested page does not exist.",
                ),
                404,  # Status Code: 404 (Not Found)
            )

        # Construct the JSON response
        response_data = {
            "error": False,
            "data": [],
            "items_per_page": limit,  # Set items_per_page equal to limit
            "total": total,
            "page": page,
        }

        for item in businesses_items:
            business_images_folder = os.path.join(
                app.config["UPLOAD_FOLDER"], str(item.id)
            )
            if os.path.exists(business_images_folder):
                images = [
                    f"/static/business/{item.id}/{filename}"
                    for filename in os.listdir(business_images_folder)
                    if allowed_file(filename)
                ]
            else:
                images = []

            business_data = {
                "id": item.id,
                "images": images,
                "name": item.name,
                "location": item.location,
                "price": item.price,
            }

            response_data["data"].append(business_data)

        return jsonify(response_data), 200

    finally:
        # Close the session after the API call is completed
        session.close()



def validate_business_data(data):
    """Validate the data for creating a business."""
    
    # Define a list of string field names to validate
    string_fields = ["location", "year_built", "name", "description"]
    
    error_response = None  # Initialize error_response to None
    
    property_type = data.get("property_type")
    if property_type not in [e.value for e in PropertyType]:
        error_response = {
            "error": True,
            "message": "The 'property_type' must be one of: " + ", ".join([e.value for e in PropertyType])
        }
    
    price = data.get("price")
    if not isinstance(price, int) or price is None or price < 0:
        error_response = {
            "error": True,
            "message": "The 'price' must be a non-negative integer value."
        }
    
    size = data.get("size")
    if not isinstance(size, int) or size is None or size < 0:
        error_response = {
            "error": True,
            "message": "The 'size' must be a non-negative integer value."
        }
    
    for field in string_fields:
        field_value = data.get(field)
        if not isinstance(field_value, str) or field_value is None:
            error_response = {
                "error": True,
                "message": f"'{field}' must be a non-null string."
            }
    
    return error_response  # Return the error_response dictionary if there's an error, otherwise return None




@app.route("/api/business", methods=["POST"])
def create_business():
    """Create a business"""
    try:
        data = request.json.get("data")
        session = Session()

        business_id = data.get("id")

        existing_business = (
            session.query(Business).filter(Business.id == business_id).first()
        )

        if existing_business:
            return (
                jsonify(
                    error=True,
                    message=f"Business with id {business_id} already exists",
                ),
                400,
            )

        unauthorized_condition = False
        if unauthorized_condition:
            return (
                jsonify(
                    error=True,
                    message="Unauthorized",
                ),
                401,
            )

        validation_error = validate_business_data(data)
        if validation_error:
            return jsonify(validation_error), 400


        business = Business(
            user_id=data.get("user_id"),
            id=business_id,
            location=data["location"],
            property_type=data["property_type"],
            price=data["price"],
            year_built=data["year_built"],
            size=data["size"],
            name=data["name"],
            description=data["description"],
        )
        session.add(business)
        session.commit()

        response_data = {
            "location": business.location,
            "property_type": business.property_type.value,
            "price": business.price,
            "year_built": business.year_built,
            "size": business.size,
            "name": business.name,
            "description": business.description,
        }

        response = {
            "error": False,
            "data": response_data,
        }

        return jsonify(response), 201

    except (ValueError, SQLAlchemyError) as error:
        response_message = str(error)
        return jsonify(message=response_message), 400


@app.route("/api/business/<int:business_id>", methods=["GET"])
def get_business_by_id(business_id):
    """Retrieve a specific business by ID"""

    if not isinstance(business_id, int) or business_id <= 0:
        return jsonify(error=True, message="Invalid business ID"), 400

    with Session() as session:
        try:
            business = (
                session.query(Business)
                .options(joinedload(Business.user))
                .get(business_id)
            )

            if business:
                # Use the json() method from the Business model to get all columns
                business_data = business.json()

                # Get image URLs for the business (same as in your previous code)
                business_images_folder = os.path.join(
                    app.config["UPLOAD_FOLDER"], str(business_id)
                )
                if os.path.exists(business_images_folder):
                    images = [
                        f"/static/business/{business_id}/{filename}"
                        for filename in os.listdir(business_images_folder)
                        if allowed_file(filename)
                    ]
                else:
                    images = []

                business_data["images"] = images

                return jsonify(error=False, data=business_data)

            return jsonify(error=True, message="Business not found"), 404
        except SQLAlchemyError as error:
            return jsonify(error=True, message=str(error)), 400


@app.route("/api/business/<int:business_id>", methods=["PUT"])
def update_business(business_id):
    """Update a specific business by ID"""
    data = request.json

    if not isinstance(business_id, int) or business_id <= 0:
        return (
            jsonify(
                error=True,
                message="Invalid business ID",
            ),
            400,
        )

    unauthorized_condition = False
    if unauthorized_condition:
        return (
            jsonify(error=True, message="Unauthorized"),
            401,
        )

    forbidden_condition = False
    if forbidden_condition:
        return (
            jsonify(error=True, message="Forbidden"),
            403,
        )

    session = Session()
    try:
        business = session.query(Business).get(business_id)
        if business:
            for key, value in data.items():
                if hasattr(business, key):
                    setattr(business, key, value)
                else:
                    return jsonify(error=True, message=f"Invalid field: {key}"), 400
            session.commit()
            return jsonify(error=False, message="Business updated successfully"), 200
        return jsonify(error=True, message="Business not found"), 404
    finally:
        session.close()


@app.route("/api/business/<int:business_id>", methods=["DELETE"])
def delete_business(business_id):
    """Delete a specific business by ID"""
    if business_id <= 0:
        return jsonify(message="Invalid business ID"), 400

    unauthorized_condition = False
    if unauthorized_condition:
        return (
            jsonify(error=True, message="Unauthorized"),
            401,
        )

    forbidden_condition = False
    if forbidden_condition:
        return (
            jsonify(error=True, message="Forbidden"),
            403,
        )

    session = Session()
    try:
        business = session.query(Business).get(business_id)
        if business:
            session.delete(business)
            session.commit()
            return (
                jsonify(error=False, message="Business deleted successfully"),
                202,
            )  # Accepted
        return jsonify(error=True, message="Business not found"), 404
    except SQLAlchemyError as error:
        session.rollback()  # Rollback the transaction in case of an error
        return jsonify(error=str(error)), 400
    finally:
        session.close()


def allowed_file(filename):
    """Check if a filename has an allowed file extension."""
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/api/business/<int:business_id>/upload", methods=["POST"])
def upload_images(business_id):
    """Uploads and saves images for a specific business."""

    if "images" not in request.files:
        return jsonify(error=True, message="No images provided."), 400

    images = request.files.getlist("images")

    session = Session()
    business = session.query(Business).filter_by(id=business_id).first()
    if not business:
        session.close()
        return jsonify(error=True, message="Business not found."), 404

    uploaded_images = []
    for image in images:
        if image and allowed_file(image.filename):
            filename = secure_filename(image.filename)
            filepath = os.path.join(
                app.config["UPLOAD_FOLDER"], str(business_id), filename
            )
            os.makedirs(os.path.dirname(filepath), exist_ok=True)
            image.save(filepath)
            uploaded_images.append(filepath)

    session.close()
    return (
        jsonify(
            error=False,
            message="Images uploaded successfully.",
            uploaded_images=uploaded_images,
        ),
        201,
    )


@app.route("/static/business/<int:business_id>/<path:filename>")
def serve_image(business_id, filename):
    """Serves a static image file for a specific business."""
    return send_from_directory(
        os.path.join(app.config["UPLOAD_FOLDER"], str(business_id)), filename
    )


@app.route("/api/business/<int:business_id>/delete/<path:filename>", methods=["DELETE"])
def delete_image(business_id, filename):
    """Deletes a specific image for a business."""

    session = Session()
    business = session.query(Business).filter_by(id=business_id).first()
    if not business:
        session.close()
        return jsonify(error=True, message="Business not found."), 404

    image_path = os.path.join(app.config["UPLOAD_FOLDER"], str(business_id), filename)
    if os.path.exists(image_path):
        os.remove(image_path)
        session.close()
        return jsonify(error=False, message="Image deleted successfully."), 200
    session.close()
    return jsonify(error=True, message="Image not found."), 404


@app.route("/api/login", methods=["POST"])
def login():
    """Handles the login process"""
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify(error="Email and password are required."), 400

    # Create a session
    session = Session()

    try:
        # Query the database to find the user by email
        user = session.query(User).filter_by(email=email).first()

        if not user:
            return jsonify(error="Invalid email."), 401

        if password == user.password_hash:
            # Password matches, return a success response along with user details
            return jsonify(message="Login successful", user=user.json()), 200
        return jsonify(error="Invalid password."), 401

    except SQLAlchemyError as error:
        # Catch specific SQLAlchemy errors and handle them
        session.rollback()  # Rollback the transaction in case of an error
        return jsonify(error=str(error)), 500
    finally:
        session.close()  # Close the session af


@app.route("/api/me", methods=["GET"])
def get_current_user():
    """Hardcoded user_id and authenticated_user_id for demonstration"""

    # Replace this with your actual logic to retrieve the user_id
    # For now, let's assume you have a user_id hardcoded
    user_id = 2

    # For demonstration purposes, let's also assume you have an authenticated_user_id
    authenticated_user_id = 2

    # Return the user_id and authenticated_user_id in JSON format
    return jsonify({"user_id": user_id, "authenticated_user_id": authenticated_user_id})


@app.route("/api/me/<int:user_id>", methods=["PUT"])
def update_user_tel_number(user_id):
    """Update the telephone number for a specific user."""
    data = request.json
    new_tel_number = data.get("tel_number")

    session = Session()
    try:
        user = session.query(User).get(user_id)
        if user:
            user.tel_number = new_tel_number  # Update the tel_number directly
            session.commit()
            return jsonify(message="User telephone number updated successfully")
        return jsonify(message="User not found"), 404
    finally:
        session.close()


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def get_resource(path):
    """define a route handler for serving static resources from a specified directory"""
    mimetypes = {
        ".css": "text/css",
        ".html": "text/html",
        ".js": "application/javascript",
    }
    complete_path = os.path.join(root_dir(), path)
    ext = os.path.splitext(path)[1]
    mimetype = mimetypes.get(ext, "text/html")
    content = get_file(complete_path)
    return Response(content, mimetype=mimetype)


if __name__ == "__main__":
    app.run(host="localhost", port=9000, debug=True)
