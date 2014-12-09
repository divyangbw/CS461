from flask.ext.sqlalchemy import SQLAlchemy

from finders import db

def dump_datetime(value):
    """Deserialize datetime object into string form for JSON processing."""
    if value is None:
        return None
    return [value.strftime("%Y-%m-%d"), value.strftime("%H:%M:%S")]

class Cast(db.Model):
    __tablename__ = 'cast'
    id = db.Column(db.Integer, primary_key=True)
    company = db.Column(db.String(64))
    date = db.Column(db.DATETIME)
    segments = db.relationship('Segment', backref='cast',lazy='dynamic') #select, joined, subquery

    @property
    def serialize(self):
       return {
           'id': self.id,
           'company' : self.company,
           'date': dump_datetime(self.date),
           'segments'  : self.serialize_many2many
       }

    @property
    def serialize_no_join(self):
       return {
           'id': self.id,
           'company' : self.company,
           'date': dump_datetime(self.date)
       }

    @property
    def serialize_many2many(self):
       return [ item.serialize for item in self.segments]


class Segment(db.Model):
    __tablename__ = 'segment'
    id = db.Column(db.Integer, primary_key=True)
    cast_id = db.Column(db.Integer, db.ForeignKey('cast.id'))
    subject = db.Column(db.String(64))
    start = db.Column(db.Integer)
    end = db.Column(db.Integer)
    comment = db.Column(db.Text)
    assignments = db.relationship('Assignment', backref='segment',lazy='select') #select, joined, subquery

    @property
    def serialize(self):
       return {
           'id': self.id,
           'cast_id' : self.cast_id,
           'subject' : self.subject,
           'start' : self.start,
           'end' : self.end,
           'comment' : self.comment
       }