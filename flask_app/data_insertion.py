# data_insertion.py
from datetime import datetime
from models import User, Business, Session, engine

def insert_data():
    """insert data in database"""
    with engine.connect() as conn:
        Users = User(
            id=50,
            email="test",
            password_hash="a123456",
            salt=1,
            first_name="dadf",
            last_name="adaadhlfds",
            tel_number="+37498888888",
            dalte_of_birth=datetime(516, 11, 18),
        )

        Businesses = Business(
            id=50,
            user_id=50,
            image_dir="",
            location="Armavir 1/8",
            property_type="Hotel",
            price=350000,
            year_built="2014",
            size=3500,
            name="Zear Hotel",
        )

        session = Session()
        session.add(Users)
        session.add(Businesses)
        session.commit()
