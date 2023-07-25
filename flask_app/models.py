import os
from datetime import datetime
from dotenv import load_dotenv
from sqlalchemy import create_engine, ForeignKey
from sqlalchemy.orm import DeclarativeBase, relationship
from sqlalchemy import Column, Integer, String, Date
from sqlalchemy.orm import sessionmaker

# Load environment variables from .env file
load_dotenv()

# Retrieve environment variables
database_username = os.getenv("DATABASE_USERNAME")
database_password = os.getenv("DATABASE_PASSWORD")
database_host = os.getenv("DATABASE_HOST")
database_port = os.getenv("DATABASE_PORT")
database_name = os.getenv("DATABASE_NAME")

database_uri = f"postgresql+psycopg2://{database_username}:{database_password}@{database_host}:{database_port}/{database_name}"

# Connecting to Postgres

# pylint: disable=too-few-public-methods
class Base(DeclarativeBase):
    """Class DeclarativaBase"""


class User(Base):
    """class representing User"""

    __tablename__ = "User"
    id = Column(Integer, primary_key=True)
    email = Column(String)
    password_hash = Column(String)
    salt = Column(Integer)
    first_name = Column(String)
    last_name = Column(String)
    tel_number = Column(String)
    dalte_of_birth = Column(Date)
    business = relationship("Business", back_populates="user")

    def json(self):
        """return self.{name}"""
        return {
            "id": self.id,
            "email": self.email,
            "salt": self.salt,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "tel_number": self.tel_number,
            "dalte_of_birth": self.dalte_of_birth,
        }


class Business(Base):
    """class representing Business"""

    __tablename__ = "Business"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("User.id"))
    image_dir = Column(String)
    location = Column(String)
    property_type = Column(String)
    price = Column(Integer)
    year_built = Column(String)
    size = Column(Integer)
    name = Column(String)
    user = relationship("User", back_populates="business")

    def json(self):
        """"""
        user_tel_number = s.query(User).get(self.user_id).tel_number
        return {
            "id": self.id,
            "user_id": self.user_id,
            "image_dir": self.image_dir,
            "location": self.location,
            "property_type": self.property_type,
            "price": self.price,
            "year_built": self.year_built,
            "size": self.size,
            "name": self.name,
            "tel_number": user_tel_number,
        }

engine = create_engine(database_uri)  # Creating a table
Session = sessionmaker(bind=engine)
