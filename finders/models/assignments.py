from flask.ext.sqlalchemy import SQLAlchemy
from finders.models import ser
from finders.models.cast import Cast, Segment
from finders.models.user import User

from finders import db

class Assignment(db.Model):
    __tablename__ = 'assignment'
    id = db.Column(db.Integer, primary_key=True)
    seg_id = db.Column(db.Integer, db.ForeignKey('segment.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    completed = db.Column(db.Boolean)
    answers = db.relationship('Answer', backref='assignment',lazy='dynamic') #select, joined, subquery
    sections = db.relationship('AssignSection', backref='assignment',lazy='dynamic') #select, joined, subquery
    updated = db.Column(db.DATETIME)

    @property
    def serialize(self):
       return {
           'id': self.id,
           'user_id': self.user_id,
           'segment' : self.getSegment.serialize,
           'cast' : self.getCast.serialize_no_join,
           'completed' : self.completed,
           'answers'  : self.serialize_answers,
           'section'  : self.serialize_sections,
           'updated': ser.dump_datetime(self.updated)
       }

    @property
    def serialize_admin(self):
       return {
           'id': self.id,
           'user': self.getUser.serialize,
           'segment' : self.getSegment.serialize,
           'cast' : self.getCast.serialize_no_join,
           'completed' : self.completed,
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

    @property
    def getSegment(self):
        return Segment.query.get(self.seg_id)

    @property
    def getCast(self):
        id = Segment.query.get(self.seg_id).cast_id
        return Cast.query.get(id)

    @property
    def getUser(self):
        return User.query.get(self.user_id)


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