"""aplication run"""
import os
from flask import Flask, Response, request, jsonify
from flask_cors import CORS
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, joinedload
from models import User, Business, Base, database_uri

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes in the app
app.config.from_object(__name__)

engine = create_engine(database_uri)
Base.metadata.bind = engine
Session = sessionmaker(bind=engine)


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
    MAX_LIMIT = 10
    
    
    try:
        page = int(request.args.get("page", 1))
        limit = int(request.args.get("limit", 3))
    except ValueError:
        return (
            jsonify(
                error="Invalid page or limit value. Please provide valid integers."
            ),
            400,
        )

    if page < 1:
        return (
            jsonify(
                error="Invalid page number. Page number must be greater than or equal to 1."
            ),
            400,
        )

    if limit < 1:
        return (
            jsonify(
                error="Invalid limit value. Limit must be greater than or equal to 1."
            ),
            400,
        )
    

     # Limit the maximum 'limit' value to MAX_LIMIT
    limit = min(limit, MAX_LIMIT)

    offset = (page - 1) * limit

    # Open a new session for the API call
    session = Session()
    try:
        paginated_items = session.query(Business).offset(offset).limit(limit).all()

        if not paginated_items:
            return (
                jsonify(error="Page not found. The requested page does not exist."),
                404,
            )

        total = calculate_total_businesses(session)  

        # Calculate total pages for pagination
        # Devide into multiple variables
        total_pages = (total // limit) + (1 if total % limit != 0 else 0)

        result = jsonify(
            items=[item.json() for item in paginated_items],
            totalPages=total_pages,
            total=total, 
            page=page,
            limit=limit,
        )
        return result, 200
    finally:
        # Close the session after the API call is completed
        session.close()


def calculate_total_businesses(session):
    """Calculates the total number of items in the 'Business' collection"""
    total = session.query(Business).count()  # Renamed total_items to total
    return total


@app.route("/api/business", methods=["POST"])
def create_business():
    """Create business"""
    data = request.json
    session = Session()

    try:
        user_id = data.get("user_id")
        user = session.query(User).get(user_id)

        if user:
            business = Business(
                user_id=user_id,
                business_id=data.get("business_id"),
                image_dir=data.get("image_dir"),
                location=data.get("location"),
                property_type=data.get("property_type"),
                price=data.get("price"),
                year_built=data.get("year_built"),
                size=data.get("size"),
                name=data.get("name"),
            )

            session.add(business)
            session.commit()

            return jsonify(message="Business created successfully")
        return jsonify(message="User not found"), 404
    finally:
        session.close()


@app.route("/api/business/<int:business_id>", methods=["GET"])
def get_business_by_id(business_id):
    """Retrieve a specific business by ID"""
    with Session() as session:
        try:
            business = (
                session.query(Business)
                .options(joinedload(Business.user))
                .get(business_id)
            )
            if business:
                return jsonify(business.json())
            return jsonify(message="Business not found"), 404
        except ImportError as error:
            return jsonify(error=str(error)), 500


@app.route("/api/business/<int:business_id>", methods=["PUT"])
def update_business(business_id):
    """Update a specific business by ID"""
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
