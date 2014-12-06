from flask.ext.sqlalchemy import SQLAlchemy
from finders.models import ser

from finders import db

class AssignSection(db.Model):
    __tablename__ = 'assignsection'
    id = db.Column(db.Integer, primary_key=True)
    seg_que_id = db.Column(db.Integer)
    section = db.Column(db.Integer)
    updated = db.Column(db.DATETIME)

    @property
    def serialize(self):
       return {
           'id': self.id,
           'seg_que_id': self.seg_que_id,
           'section': self.section,
           'updated': ser.dump_datetime(self.updated)
       }