"""Data inserion"""
from datetime import date
from models import User, Business, Session


def insert_data():
    """Insert data into the database."""
    session = Session()

    user = User(
        id=14,
        email="astest@example.com",
        password_hash="dsada51",
        salt=3,
        first_name="John",
        last_name="Doe",
        tel_number="+37494388825",
        dalte_of_birth=date(2000, 1, 1),
    )

    # Create multiple businesses for the user
    businesses = [
        Business(
            id=14,
            user_id=user.id,
            image_dir="",
            location="Avan 10/6",
            property_type="Office",
            price=300000,
            year_built="2010",
            size=2500,
            name="Business 1",
            description="Description for Business 1",
        ),
        Business(
            id=15,
            user_id=user.id,
            image_dir="",
            location="Downtown",
            property_type="Retail",
            price=400000,
            year_built="2015",
            size=1800,
            name="Business 2",
            description="Description for Business 2",  
        ),
        # Add more businesses as needed
    ]

    user.businesses.extend(businesses)  # Link the businesses to the user

    session.add(user)
    session.commit()
    session.close()


if __name__ == "__main__":
    insert_data()
