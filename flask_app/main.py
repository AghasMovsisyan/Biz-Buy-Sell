"""aplication run"""
import os
from flask import Flask, Response, request, jsonify, send_from_directory
from flask_cors import CORS
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, joinedload
from sqlalchemy.exc import SQLAlchemyError
from werkzeug.utils import secure_filename
from models import User, Business, Base, database_uri


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
    max_limit = 30
    max_page = 30

    try:
        page = int(request.args.get("page", 1))
        limit = int(request.args.get("limit", 6))
    except ValueError:
        return (
            jsonify(
                error=True,
                message="Invalid page or limit value. Please provide valid integers.",
            ),
            400,
        )

    # Ensure limit is within valid range
    if limit < 1 or limit > max_limit:
        limit = 6

    # Ensure page is within valid range
    if page < 1 or page > max_page:
        page = 1

    # Limit the maximum 'limit' value to MAX_LIMITS
    limit = min(limit, max_limit)
    offset = (page - 1) * limit

    # Open a new session for the API call
    session = Session()
    try:
        paginated_items = (
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

        if not paginated_items:
            return (
                jsonify(error="Page not found. The requested page does not exist."),
                404,
            )

        total = session.query(Business).count()
        # Calculate total pages for pagination
        additional_page_needed = 1 if total % limit != 0 else 0
        items_per_page = (total // limit) + additional_page_needed

        # Construct the JSON response
        response_data = {
            "error": False,
            "data": [],
            "items_per_page": items_per_page,
            "total": total,
            "page": page,
        }

        for item in paginated_items:
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
                "location": item.location,
                "price": item.price,
                "name": item.name,
            }

            response_data["data"].append(business_data)

        return jsonify(response_data), 200

    finally:
        # Close the session after the API call is completed
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

    # Ensure business_id exists in the database
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

    # Close the session
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


@app.route("/api/business", methods=["POST"])
def create_business():
    """Create a business"""
    try:
        data = request.json

        user_id = data.get("user_id")
        if not user_id:
            return jsonify(message="Missing user_id"), 400

        session = Session()

        user = session.query(User).get(user_id)
        if not user:
            return jsonify(message=f"User with id {user_id} not found"), 404

        business_id = data.get("id")
        if not business_id:
            return jsonify(message="Missing business ID"), 400

        existing_business = (
            session.query(Business).filter(Business.id == business_id).first()
        )
        if existing_business:
            return (
                jsonify(message=f"Business with id {business_id} already exists"),
                400,
            )

        business = Business(
            user_id=user_id,
            id=business_id,
            location=data.get("location"),
            property_type=data.get("property_type"),
            price=data.get("price"),
            year_built=data.get("year_built"),
            size=data.get("size"),
            name=data.get("name"),
            description=data.get("description"),
        )
        session.add(business)
        session.commit()

        return (
            jsonify(message="Business created successfully", business_id=business_id),
            201,
        )

    except ImportError:
        return jsonify(message="An error occurred"), 500


@app.route("/api/business/<int:business_id>", methods=["GET"])
def get_business_by_id(business_id):
    """Retrieve a specific business by ID"""

    # Hardcoded authenticatedUserId for testing purposes
    authenticated_user_id = 2

    if business_id <= 0:
        return jsonify(message="Invalid business ID"), 400

    with Session() as session:
        try:
            business = (
                session.query(Business)
                .options(joinedload(Business.user))
                .get(business_id)
            )
            if business:
                business_data = business.json()
                business_data["authenticated_user_id"] = authenticated_user_id
                return jsonify(business_data)
            return jsonify(message="Business not found"), 404
        except SQLAlchemyError as error:
            return jsonify(error=str(error)), 500


@app.route("/api/business/<int:business_id>", methods=["PUT"])
def update_business(business_id):
    """Update a specific business by ID"""
    if business_id <= 0:
        return jsonify(message="Invalid business ID"), 400  # Bad Request

    data = request.json
    session = Session()
    try:
        business = session.query(Business).get(business_id)
        if business:
            for key, value in data.items():
                setattr(business, key, value)
            session.commit()
            return jsonify(message="Business updated successfully")
        return jsonify(message="Business not found"), 404
    finally:
        session.close()


@app.route("/api/business/<int:business_id>", methods=["DELETE"])
def delete_business(business_id):
    """Delete a specific business by ID"""

    session = Session()
    try:
        business = session.query(Business).get(business_id)
        if business:
            session.delete(business)
            session.commit()
            return jsonify(message="Business deleted successfully")
        return jsonify(message="Business not found"), 404
    except SQLAlchemyError as error:
        session.rollback()  # Rollback the transaction in case of an error
        return jsonify(error=str(error)), 500
    finally:
        session.close()


@app.route("/api/login", methods=["POST"])
def login():
    """Handles the login process"""
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify(error="Email and password are required."), 400

    session = Session()  # Open a new session for the API call
    try:
        user = session.query(User).filter_by(email=email).first()

        if not user:
            return jsonify(error="Invalid email."), 401

        if (
            password == user.password_hash
        ):  # Compare provided password with stored password hash
            # Password matches, return a success response along with user details
            return jsonify(message="Login successful", user=user.json()), 200
        return jsonify(error="Invalid email or password."), 401
    except SQLAlchemyError as error:
        # Catch specific SQLAlchemy errors and handle them
        session.rollback()  # Rollback the transaction in case of an error
        return jsonify(error=str(error)), 500
    finally:
        session.close()  # Close the session after the API call is compl


@app.route("/api/me", methods=["GET"])
def get_current_user():
    """hardcoded user_id"""
    # Replace this with your actual logic to retrieve the user_id
    # For now, let's assume you have a user_id hardcoded
    user_id = 2

    # Return the user_id in JSON format
    return jsonify({"user_id": user_id})


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
