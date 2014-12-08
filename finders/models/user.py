from flask.ext.sqlalchemy import SQLAlchemy
from passlib.apps import custom_app_context as pwd_context

from finders import db

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(128), index=True, unique=True)
    password_hash = db.Column(db.String(64))
    first = db.Column(db.String(128))
    last = db.Column(db.String(128))
    token = db.Column(db.String(128))
    role = db.Column(db.String(30))
    updated = db.Column(db.DATETIME)

    @property
    def serialize(self):
       return {
           'id': self.id,
           'email' : self.email,
           'first' : self.first,
           'last'  : self.last,
           'role'  : self.role
       }

    def hash_password(self, password):
        self.password_hash = pwd_context.encrypt(password)

    def verify_password(self, password):
        return pwd_context.verify(password, self.password_hash)

    def hash_token(self, token):
        self.token = pwd_context.encrypt(token)

    def verify_token(self, token):
        return pwd_context.verify(token, self.token)