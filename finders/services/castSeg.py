from dateutil import parser
from flask import abort, jsonify
from finders.models.cast import Cast, Segment
from finders.services import utils

from finders import db

class CastSeg:

    def new_cast(company, date):
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

    def all_casts():
        casts = Cast.query.all()
        return (jsonify(result=[i.serialize for i in casts]), 200)

    def get_cast(id):
        if id is None:
            abort(400)    # missing arguments
        cast = Cast.query.get(id)
        if cast is None:
            abort(404)
        return (jsonify(result=cast.serialize), 200)

    def update_cast(id, company, date):
        if id is None or company is None or date is None:
            abort(400)    # missing arguments
        cast = Cast.query.get(id)
        if cast is None:
            abort(404)
        cast.company = company;
        cast.date = date;
        db.session.commit()
        return (jsonify(result=
            {'id':cast.id, 'company': cast.company, 'date':cast.date}
        ), 200)

    def delete_cast(id):
        if id is None:
            abort(400)    # missing arguments
        cast = Cast.query.get(id)
        if cast is None:
            abort(404)
        db.session.delete(cast)
        db.session.commit()
        return (jsonify(result="ok"), 200)

    def new_seg(cast_id, subject, start, end, comment):
        if cast_id is None or subject is None or start is None or end is None:
            abort(400)    # missing arguments
        segment = Segment(cast_id=cast_id, subject=subject, start=start, end=end, comment=comment)
        db.session.add(segment)
        db.session.commit()
        return (jsonify(result= {
            'id':segment.id, 'cast_id': segment.cast_id, 'subject':segment.subject,
            'start':segment.start, 'end':segment.end, 'comment':segment.comment
        }), 201)

    def all_seg(castId):
        segments = Segment.query.filter_by(cast_id=castId)
        return (jsonify(result=[i.serialize for i in segments]), 200)

    def get_seg(id):
        if id is None:
            abort(400)    # missing arguments
        segment = Segment.query.get(id)
        if segment is None:
            abort(404)
        return (jsonify(result=segment.serialize), 200)

    def update_seg(id, subject, start, end, comment):
        if id is None or subject is None or start is None or end is None or comment is None:
            abort(400)    # missing arguments
        segment = Segment.query.get(id)
        if segment is None:
            abort(404)
        segment.subject = company;
        segment.start = date;
        segment.end = date;
        segment.comment = date;
        db.session.commit()
        return (jsonify(result= {
            'id':segment.id, 'cast_id': segment.company, 'subject':segment.date,
            'start':segment.start, 'end':segment.end, 'comment':segment.comment
        }), 200)

    def delete_seg(id):
        if id is None:
            abort(400)    # missing arguments
        segment = Segment.query.get(id)
        if segment is None:
            abort(404)
        db.session.delete(segment)
        db.session.commit()
        return (jsonify(result="ok"), 200)