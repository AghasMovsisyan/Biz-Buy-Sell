"""Data inserion"""
from datetime import date
from models import User, Business, Session, PropertyType, Status



def insert_data():
    """Insert data into the database."""
    session = Session()

    user = User(
        id=3,
        email="astest@example.com",
        password_hash="dsada51",
        salt='ss',
        first_name="John",
        last_name="Doe",
        tel_number="+37494388825",
        date_of_birth=date(2000, 1, 1),
    )

    # Create multiple businesses for the user
    businesses = [
        Business(
            id=3,
            user_id=user.id,    
            location="Avan 10/6",
            property_type=PropertyType.RESTUARANT,
            price=300000,
            year_built="2010",
            size=2500,
            name="Rest Adas",
            description="A hotel is a commercial establishment that provides lodging, meals, and other services to guests, travelers, and tourists. Hotels can range from small family-run businesses to large international chains. Most hotels list a variety of services, such as room service, laundry, and concierge.",
        ),
        Business(
            id=4,
            user_id=user.id,
            location="Downtown",
            property_type=PropertyType.RESTUARANT,
            price=400000,
            year_built="2015",
            size=1800,
            name="John Astra",
            description="A hotel is a commercial establishment that provides lodging, meals, and other services to guests, travelers, and tourists. Hotels can range from small family-run businesses to large international chains. Most hotels list a variety of services, such as room service, laundry, and concierge.",
        ),
        # Add more businesses as needed
    ]

    user.businesses.extend(businesses)  # Link the businesses to the user

    session.add(user)
    session.commit()
    session.close()

if __name__ == "__main__":
    insert_data()
