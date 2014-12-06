from flask.ext.sqlalchemy import SQLAlchemy
from finders.models import ser

from finders import db

class Assignments(db.Model):
    __tablename__ = 'assignments'
    id = db.Column(db.Integer, primary_key=True)
    seg_id = db.Column(db.Integer)
    user_id = db.Column(db.Integer)
    answers = db.relationship('Option', backref='option',lazy='dynamic') #select, joined, subquery
    section = db.relationship('Option', backref='option',lazy='dynamic') #select, joined, subquery
    updated = db.Column(db.DATETIME)

    @property
    def serialize(self):
       return {
           'id': self.id,
           'seg_id' : self.seg_id,
           'user_id' : self.user_id,
           'answers'  : self.serialize_many2many,
           'section'  : self.serialize_many2many,
           'updated': ser.dump_datetime(self.updated)
       }

    @property
    def serialize_many2many(self):
       return [ item.serialize for item in self.answers ]

    @property
    def serialize_many2many(self):
       return [ item.serialize for item in self.section ]


class Answers(db.Model):
    __tablename__ = 'answers'
    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, db.ForeignKey('question.id'))
    answer = db.Column(db.text)
    seg_que_id = db.Column(db.Integer)
    updated = db.Column(db.DATETIME)

    @property
    def serialize(self):
        return {
            'id': self.id,
            'question_id' : self.question_id,
            'answer' : self.answer,
            'seg_que_id' : self.seg_que_id,
            'updated' : ser.dump_datetime(self.updated)
        }

class Section(db.Model):
    __tablename__ = 'section'
    id = db.Column(db.Integer, primary_key=True)

    updated = db.Column(db.DATETIME)

    @property
    def serialize(self):
        return {
            'id': self.id,

            'updated' : ser.dump_datetime(self.updated)
        }