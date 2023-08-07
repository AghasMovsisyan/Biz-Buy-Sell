"""
data_insertion.py

This module provides functions to insert data into the database.
"""
from datetime import datetime
from models import User, Business, Session


def insert_data():
    """Insert data in the database"""
    users = User(
        id=51,
        email="test",
        password_hash="a123456",
        salt=1,
        first_name="dadf",
        last_name="adaadhlfds",
        tel_number="+37498888888",
        dalte_of_birth=datetime(516, 11, 18),
    )

    businesses = Business(
        id=51,
        user_id=51,
        image_dir="",
        location="Armavir 1/8",
        property_type="Hotel",
        price=350000,
        year_built="2014",
        size=3500,
        name="Zear Hotel",
    )

    session = Session()
    session.add(users)
    session.add(businesses)
    session.commit()
    session.close()
