# data_insertion.py
from datetime import datetime
from models import User, Business, Session, engine

def insert_data():
    with engine.connect() as conn:
        Users = User(
            id=31,
            email="armansd@mail.ru",
            password_hash="dada5f",
            salt=1,
            first_name="dadf",
            last_name="adaadhlfds",
            tel_number="+37498888888",
            dalte_of_birth=datetime(516, 11, 18),
        )

        Businesses = Business(
            id=31,
            user_id=31,
            image_dir="https://upload.wikimedia.org/wikipedia/commons/e/e7/Hypermartjf.JPG",
            location="Kotayq 1/8",
            property_type="Supermarket",
            price=350000,
            year_built="2014",
            size=3500,
            name="Zear Super",
        )

        s = Session()
        s.add(Users)
        s.add(Businesses)
        s.commit()


