from dateutil import parser
from flask import abort, jsonify
from finders.models.questions import Question, Option
from finders.services import utils
import datetime

from finders import db

class Questionnaire:

    #--------- QUESTIONS ---------#

    def new_question(type, text):
        if type is None or text is None:
            abort(400)
        updated = datetime.datetime.now()
        item = Question(type=type,text=text,updated=updated)
        db.session.add(item)
        db.session.commit()
        return (jsonify(result=
            {'id':item.id, 'type': item.type, 'text':item.text, 'updated':item.updated}
        ), 201)

    def all_questions():
        items = Question.query.all()
        return (jsonify(result=[i.serialize for i in items]), 200)

    def get_question(id):
        if id is None:
            abort(400)
        item = Question.query.get(id)
        if item is None:
            abort(404)
        return (jsonify(result=item.serialize), 200)

    def update_question(id, type, text):
        if id is None or type is None or text is None:
            abort(400)    # missing arguments
        item = Question.query.get(id)
        if item is None:
            abort(404)
        item.type = type;
        item.text = text;
        item.updated = datetime.datetime.now();
        db.session.commit()
        return (jsonify(result=
            {'id':item.id, 'type': item.type, 'text':item.text, 'updated':item.updated}
        ), 200)

    def delete_question(id):
        if id is None:
            abort(400)    # missing arguments
        item = Question.query.get(id)
        if item is None:
            abort(404)
        db.session.delete(item)
        db.session.commit()
        return (jsonify(result="ok"), 200)

    #--------- OPTIONS ---------#

    def new_option(question_id, text):
        if question_id is None or text is None:
            abort(400)    # missing arguments
        updated = datetime.datetime.now()
        item = Option(question_id=question_id,text=text,updated=updated)
        db.session.add(item)
        db.session.commit()
        return (jsonify(result= {
            'id':item.id, 'question_id': item.question_id, 'text':item.text, 'updated':item.updated
        }), 201)

    def all_options(question_id):
        items = Options.query.filter_by(question_id=question_id)
        return (jsonify(result=[i.serialize for i in items]), 200)

    def get_option(id):
        if id is None:
            abort(400)    # missing arguments
        item = Options.query.get(id)
        if item is None:
            abort(404)
        return (jsonify(result=item.serialize), 200)

    def update_option(id, text):
        if id is None or text is None:
            abort(400)    # missing arguments
        item = Option.query.get(id)
        if item is None:
            abort(404)
        item.text = text;
        item.updated = datetime.datetime.now();
        db.session.commit()
        return (jsonify(result= {
            'id':item.id, 'question_id': item.cast_id, 'text':item.text, 'updated':item.updated
        }), 200)

    def delete_option(id):
        if id is None:
            abort(400)    # missing arguments
        item = Option.query.get(id)
        if item is None:
            abort(404)
        db.session.delete(item)
        db.session.commit()
        return (jsonify(result="ok"), 200)