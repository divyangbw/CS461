from flask.ext.sqlalchemy import SQLAlchemy
from finders.models import ser

from finders import db

class Question(db.Model):
    __tablename__ = 'question'
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(64))
    text = db.Column(db.TEXT)
    options = db.relationship('Option', backref='option',lazy='dynamic') #select, joined, subquery
    updated = db.Column(db.DATETIME)

    @property
    def serialize(self):
       return {
           'id': self.id,
           'type' : self.type,
           'text' : self.text,
           'options'  : self.serialize_many2many,
           'updated': ser.dump_datetime(self.updated)
       }

    @property
    def serialize_many2many(self):
       return [ item.serialize for item in self.options]


class Option(db.Model):
    __tablename__ = 'option'
    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, db.ForeignKey('question.id'))
    text = db.Column(db.TEXT)
    updated = db.Column(db.DATETIME)

    @property
    def serialize(self):
       return {
           'id': self.id,
           'question_id' : self.question_id,
           'text' : self.text,
           'updated' : ser.dump_datetime(self.updated)
       }