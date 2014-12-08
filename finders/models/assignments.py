from flask.ext.sqlalchemy import SQLAlchemy
from finders.models import ser

from finders import db

class Assignment(db.Model):
    __tablename__ = 'assignment'
    id = db.Column(db.Integer, primary_key=True)
    seg_id = db.Column(db.Integer)
    user_id = db.Column(db.Integer)
    answers = db.relationship('Answer', backref='assignment',lazy='dynamic') #select, joined, subquery
    sections = db.relationship('AssignSection', backref='assignment',lazy='dynamic') #select, joined, subquery
    updated = db.Column(db.DATETIME)

    @property
    def serialize(self):
       return {
           'id': self.id,
           'seg_id' : self.seg_id,
           'user_id' : self.user_id,
           'answers'  : self.serialize_answers,
           'section'  : self.serialize_sections,
           'updated': ser.dump_datetime(self.updated)
       }

    @property
    def serialize_answers(self):
       return [ item.serialize for item in self.answers ]

    @property
    def serialize_sections(self):
       return [ item.serialize for item in self.sections ]


class Answer(db.Model):
    __tablename__ = 'answer'
    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer)
    assignment_id = db.Column(db.Integer, db.ForeignKey('assignment.id'))
    answer = db.Column(db.Text)
    updated = db.Column(db.DATETIME)

    @property
    def serialize(self):
        return {
            'id': self.id,
            'question_id' : self.question_id,
            'answer' : self.answer,
            'assignment_id' : self.assignment_id,
            'updated' : ser.dump_datetime(self.updated)
        }

class AssignSection(db.Model):
    __tablename__ = 'assignsection'
    id = db.Column(db.Integer, primary_key=True)
    assignment_id = db.Column(db.Integer, db.ForeignKey('assignment.id'))
    section = db.Column(db.Integer)
    updated = db.Column(db.DATETIME)

    @property
    def serialize(self):
       return {
           'id': self.id,
           'assignment_id': self.assignment_id,
           'section': self.section,
           'updated': ser.dump_datetime(self.updated)
       }