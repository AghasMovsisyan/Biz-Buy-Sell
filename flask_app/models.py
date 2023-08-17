"""
models.py

This module contains the SQLAlchemy models for the database schema.
"""
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, ForeignKey
from sqlalchemy.orm import DeclarativeBase, relationship, sessionmaker
from sqlalchemy import Column, Integer, String, Date

# Load environment variables from .env file
load_dotenv()

# Retrieve environment variables
database_username = os.getenv("DATABASE_USERNAME")
database_password = os.getenv("DATABASE_PASSWORD")
database_host = os.getenv("DATABASE_HOST")
database_port = os.getenv("DATABASE_PORT")
database_name = os.getenv("DATABASE_NAME")
database_uri = (
    f"postgresql+psycopg2://{database_username}:{database_password}"
    f"@{database_host}:{database_port}/{database_name}"
)
# Connecting to Postgres


class Base(DeclarativeBase):
    """Base class for SQLAlchemy models."""


class User(Base):
    """Class representing User"""

    __tablename__ = "User"
    id = Column(Integer, primary_key=True)
    email = Column(String)
    password_hash = Column(String)
    salt = Column(String)
    first_name = Column(String)
    last_name = Column(String)
    tel_number = Column(String)
    date_of_birth = Column(Date)
    businesses = relationship("Business", back_populates="user")

    def json(self):
        """Return a dictionary representation of the User."""
        return {
            "id": self.id,
            "email": self.email,
            "salt": self.salt,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "tel_number": self.tel_number,
            "date_of_birth": self.date_of_birth,
        }


class Business(Base):
    """Class representing Business"""

    __tablename__ = "Business"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("User.id"))
    location = Column(String)
    property_type = Column(String)
    price = Column(Integer)
    year_built = Column(String)
    size = Column(Integer)
    name = Column(String)
    description = Column(String)

    # Define the relationship between User and Business
    user = relationship("User", back_populates="businesses")

    def json(self):
        """Return a dictionary representation of the Business."""
        return {
            "id": self.id,
            "user_id": self.user_id,
            "location": self.location,
            "property_type": self.property_type,
            "price": self.price,
            "year_built": self.year_built,
            "size": self.size,
            "name": self.name,
            "description": self.description,
            "tel_number": self.user.tel_number,
        }


engine = create_engine(database_uri)  # Creating a table
Session = sessionmaker(bind=engine)
Base.metadata.create_all(engine)
