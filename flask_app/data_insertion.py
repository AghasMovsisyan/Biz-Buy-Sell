"""Data inserion"""
from datetime import date
from models import User, Business, Session, PropertyType


def insert_data():
    """Insert data into the database."""
    session = Session()

    user = User(
        id=8,
        email="vardan@mial.ru",
        password_hash="123456a",
        salt="ads",
        first_name="Vardan",
        last_name="Melqonyan",
        tel_number="+37494388882",
        date_of_birth=date(2002, 4, 15),
    )

    # Create multiple businesses for the user
    businesses = [
        Business(
            id=13,
            user_id=user.id,
            location="Kentron 2/5",
            property_type=PropertyType.RESTUARANT,
            price=500000,
            year_built="2010",
            size=4000,
            name="Gase Rest",
            description="Pre-pandemic, to Potomac.",
        ),
        Business(
            id=14,
            user_id=user.id,
            location="Dilijan 1/7",
            property_type=PropertyType.RESTUARANT,
            price=350000,
            year_built="2017",
            size=5500,
            name="Elya Nora",
            description="Pre-that the and bites overlooking the elegant Potomac.",
        ),
        # Add more businesses as needed
    ]

    user.businesses.extend(businesses)  # Link the businesses to the user

    session.add(user)
    session.commit()
    session.close()


if __name__ == "__main__":
    insert_data()
