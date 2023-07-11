"""aplication run"""
import os
from flask import Flask, Response, request
from flask import jsonify
from models import Business, s

app = Flask(__name__)
app.config.from_object(__name__)

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


@app.route('/', methods=['GET'])
def metrics():
    """ A route handler for the root URL ("/") that serves the metrics page.
        Retrieves the content of'index.html' file and returns it as a response with HTML mimetype"""
    content = get_file('templates/index.html')
    return Response(content, mimetype="text/html")


@app.route('/api/business', methods=['GET'])
def get_paginated_items():
    """Retrieves paginated items from the 'Business' collection ased on 'page' and 'limit' """
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 10))
    offset = (page - 1) * limit if page > 0 else 0
    paginated_items = s.query(Business).offset(offset).limit(limit).all()

    # Calculates the total number of pages for pagination
    total_pages = calculate_total_pages(limit)
    s.close()

    # Returns paginated items and total pages in a JSON response
    result = jsonify(items=[item.json() for item in paginated_items], totalPages=total_pages)
    return result


def calculate_total_pages(limit):
    """Calculates the total number of pages based on the given limit"""
    total_items = s.query(Business).count()
    total_pages = (total_items // limit) + (1 if total_items % limit != 0 else 0)
    return total_pages


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
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


if __name__ == '__main__':
    app.run(host="localhost", port=9000, debug=True)
