"""
data_insertion.py

This module provides functions to insert data into the database.
"""
from datetime import datetime
from models import User, Business, Session


def insert_data():
    """Insert data in the database"""
    users = User(
        id=13,
        email="astestadas",
        password_hash="dsada51",
        salt=3,
        first_name="dadf",
        last_name="adaadhlfds",
        tel_number="+37494388825",
        dalte_of_birth=datetime(516, 11, 18),
    )

    businesses = Business(
        id=13,
        user_id=13,
        image_dir="",
        location="Avan 10/5",
        property_type="Hotel",
        price=500000,
        year_built="2012",
        size=4000,
        name="Sofi Hotel",
        business_description="",
    )

    session = Session()
    session.add(users)
    session.add(businesses)
    session.commit()
    session.close()


insert_data()
