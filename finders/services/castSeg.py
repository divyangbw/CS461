from dateutil import parser
from flask import abort, jsonify
from finders.models.cast import Cast, Segment
from finders.models.user import User
from finders.models.assignments import Assignment
from finders.services import utils
import datetime

from finders import db

class CastSeg:

    def new_cast(self, company, date):
        if company is None or date is None:
            print(str(company) + ":" + str(date))
            abort(400)    # missing arguments
        newDate = parser.parse(date)
        cast = Cast(company=company,date=newDate)
        db.session.add(cast)
        db.session.commit()
        return (jsonify(result=
            {'id':cast.id, 'company': cast.company, 'date':cast.date}
        ), 201)

    def all_casts(self):
        casts = Cast.query.all()
        return (jsonify(result=[i.serialize for i in casts]), 200)

    def get_cast(self, id):
        if id is None:
            abort(400)    # missing arguments
        cast = Cast.query.get(id)
        if cast is None:
            abort(404)
        return (jsonify(result=cast.serialize), 200)

    def update_cast(self, id, company, date):
        if id is None or company is None or date is None:
            abort(400)    # missing arguments
        cast = Cast.query.get(id)
        if cast is None:
            abort(404)
        cast.company = company
        cast.date = parser.parse(date)
        db.session.commit()
        return (jsonify(result=Cast.query.get(id).serialize), 200)

    def delete_cast(self, id):
        if id is None:
            abort(400)    # missing arguments
        cast = Cast.query.get(id)
        if cast is None:
            abort(404)
        db.session.delete(cast)
        db.session.commit()
        return (jsonify(result="ok"), 200)

    def new_seg(self, cast_id, subject, start, end, comment):
        if cast_id is None or subject is None or start is None or end is None:
            abort(400)    # missing arguments
        segment = Segment(cast_id=cast_id, subject=subject, start=start, end=end, comment=comment)
        segment.updated = datetime.datetime.now()
        db.session.add(segment)
        db.session.commit()
        users = User.query.filter_by(role="mod")
        for user in users:
            assignment = Assignment(seg_id=segment.id,user_id=user.id,completed=False)
            assignment.updated = datetime.datetime.now()
            db.session.add(assignment)
        db.session.commit()
        return (jsonify(result= {
            'id':segment.id, 'cast_id': segment.cast_id, 'subject':segment.subject,
            'start':segment.start, 'end':segment.end, 'comment':segment.comment
        }), 201)

    def all_seg(self, castId):
        segments = Segment.query.filter_by(cast_id=castId)
        return (jsonify(result=[i.serialize for i in segments]), 200)

    def get_seg(self, id):
        if id is None:
            abort(400)    # missing arguments
        segment = Segment.query.get(id)
        if segment is None:
            abort(404)
        return (jsonify(result=segment.serialize), 200)

    def update_seg(self, id, subject, start, end, comment):
        if id is None or subject is None or start is None or end is None or comment is None:
            abort(400)    # missing arguments
        segment = Segment.query.get(id)
        if segment is None:
            abort(404)
        segment.subject = subject;
        segment.start = start;
        segment.end = end;
        segment.comment = comment;
        db.session.commit()
        return (jsonify(result= {
            'id':segment.id, 'subject': segment.subject, 'start':segment.start,
            'end':segment.end, 'comment':segment.comment
        }), 200)

    def delete_seg(self, id):
        if id is None:
            abort(400)    # missing arguments
        segment = Segment.query.get(id)
        if segment is None:
            abort(404)
        db.session.delete(segment)
        db.session.commit()
        return (jsonify(result="ok"), 200)
