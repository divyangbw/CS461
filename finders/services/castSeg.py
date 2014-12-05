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

    def edit_cast(id, company, date):
        if company is None or date is None:
            abort(400)    # missing arguments
        cast = Cast.query.get(id)
        if cast is None:
            abort(404)    # existing user
        cast.company = company;
        cast.date = date;
        db.session.commit()
        return (jsonify(result=
            {'id':cast.id, 'company': cast.company, 'date':cast.date}
        ), 200)

