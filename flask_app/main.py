"""aplication run"""
import os
from flask import Flask, Response, request, render_template
from flask import jsonify
from models import User, Business, s, Base, database_uri
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

app = Flask(__name__)
app.config.from_object(__name__)

engine = create_engine(database_uri)
Base.metadata.bind = engine
Session = sessionmaker(bind=engine)

def root_dir():
    """gives the directory name of the current script file."""
    return os.path.abspath(os.path.dirname(__file__))


def get_file(filename):
    """get file"""
    try:
        src = os.path.join(root_dir(), filename)
        return open(src, encoding="utf-8").read()
    except IOError as exc:
        return str(exc)


@app.route("/", methods=["GET"])
def metrics():
    """A route handler for the root URL ("/") that serves the metrics page.
    Retrieves the content of'index.html' file and returns it as a response with HTML mimetype
    """
    content = get_file("templates/index.html")
    return Response(content, mimetype="text/html")


@app.route("/api/business", methods=["GET"])
def get_business():
    """Retrieves paginated items from the 'Business' collection ased on 'page' and 'limit'"""
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 10))
    offset = (page - 1) * limit if page > 0 else 0
    paginated_items = s.query(Business).offset(offset).limit(limit).all()

    # Calculates the total number of pages for pagination
    total_pages = calculate_total_pages(limit)
    s.close()

    # Returns paginated items and total pages in a JSON response
    result = jsonify(
        items=[item.json() for item in paginated_items], totalPages=total_pages
    )
    return result


def calculate_total_pages(limit):
    """Calculates the total number of pages based on the given limit"""
    total_items = s.query(Business).count()
    total_pages = (total_items // limit) + (1 if total_items % limit != 0 else 0)
    return total_pages



@app.route("/api/business", methods=["POST"])
def create_business():
    data = request.json
    session = Session()

    try:
        
        user_id = data.get("user_id")
        user = session.query(User).get(user_id)

        if user:
            business = Business(
                user_id=user_id,
                id=data.get("id"),
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
        else:
            return jsonify(message="User not found"), 404
    finally:
        session.close()


# Retrieve a specific business by ID
@app.route("/api/business/<int:id>", methods=["GET"])
def get_business_by_id(id):
    session = Session()

    try:
        business = session.query(Business).get(id)
        if business:
            return jsonify(business.json())
        else:
            return jsonify(message="Business not found"), 404
    finally:
        session.close()

# Update a specific business by ID
@app.route("/api/business/<int:id>", methods=["PUT"])
def update_business(id):
    data = request.json
    session = Session()

    try:
        business = session.query(Business).get(id)
        if business:
            for key, value in data.items():
                setattr(business, key, value)
            session.commit()
            return jsonify(message="Business updated successfully")
        else:
            return jsonify(message="Business not found"), 404
    finally:
        session.close()

# Delete a specific business by ID
@app.route("/api/business/<int:id>", methods=["DELETE"])
def delete_business(id):
    session = Session()

    try:
        business = session.query(Business).get(id)
        if business:
            session.delete(business)
            session.commit()
            return jsonify(message="Business deleted successfully")
        else:
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
