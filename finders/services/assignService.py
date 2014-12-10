from dateutil import parser
from flask import abort, jsonify
from finders.models.assignments import Assignment, Answer, AssignSection
from finders.services import utils
import datetime

from finders import db

class AssignService:

    #--------- ASSIGNMENTS ---------#

    def new_assignment(seg_id, user_id):
        if seg_id is None or user_id is None:
            abort(400)
        updated = datetime.datetime.now()

        item = Assignment(seg_id=seg_id,user_id=user_id,updated=updated)
        db.session.add(item)
        db.session.commit()
        return (jsonify(result=
            {'id':item.id, 'seg_id':item.seg_id, 'user_id': item.user_id, 'updated':item.updated}
        ), 201)

    def all_assignments():
        items = Assignment.query.all()
        return (jsonify(result=[i.serialize for i in items]), 200)

    def my_assignments(user):
        if user.role == "admin":
            items = Assignment.query.all()
            return (jsonify(result=[i.serialize_admin for i in items]), 200)
        items = Assignment.query.filter_by(user_id=user.user_id).all()
        return (jsonify(result=[i.serialize for i in items]), 200)

    def get_assignment(id):
        if id is None:
            abort(400)
        item = Assignment.query.get(id)
        if item is None:
            abort(404)
        return (jsonify(result=item.serialize), 200)

    def update_assignment(id, question_id, answer, seg_que_id):
        if id is None or question_id is None or answer is None or seg_que_id is None:
            abort(400)    # missing arguments
        item = Assignment.query.get(id)
        if item is None:
            abort(404)
        item.question_id = question_id;
        item.answer = answer;
        item.seg_que_id = seg_que_id;
        item.updated = datetime.datetime.now();
        db.session.commit()
        return (jsonify(result=
            {'id':item.id, 'question_id': item.question_id, 'answer':item.answer, 'seg_que_id':item.seq_que_id, 'updated':item.updated}
        ), 200)

    def delete_assignment(id):
        if id is None:
            abort(400)    # missing arguments
        item = Assignment.query.get(id)
        if item is None:
            abort(404)
        db.session.delete(item)
        db.session.commit()
        return (jsonify(result="ok"), 200)

    #--------- ANSWERS ---------#

    def new_answer(assignment_id, text):
        if assignment_id is None or text is None:
            abort(400)    # missing arguments
        updated = datetime.datetime.now()
        item = Answers(assignmen_id=assignment_id,text=text,updated=updated)
        db.session.add(item)
        db.session.commit()
        return (jsonify(result= {
            'id':item.id, 'assignmnet_id': item.assignment_id, 'text':item.text, 'updated':item.updated
        }), 201)

    def all_answers(assignment_id):
        items = Answers.query.filter_by(assignment_id=assignment_id)
        return (jsonify(result=[i.serialize for i in items]), 200)

    def get_answer(id):
        if id is None:
            abort(400)    # missing arguments
        item = Answers.query.get(id)
        if item is None:
            abort(404)
        return (jsonify(result=item.serialize), 200)

    def update_Answer(id, text):
        if id is None or text is None:
            abort(400)    # missing arguments
        item = Answers.query.get(id)
        if item is None:
            abort(404)
        item.text = text;
        item.updated = datetime.datetime.now();
        db.session.commit()
        return (jsonify(result= {
            'id':item.id, 'assignment_id': item.cast_id, 'text':item.text, 'updated':item.updated
        }), 200)

    def delete_answer(id):
        if id is None:
            abort(400)    # missing arguments
        item = Answers.query.get(id)
        if item is None:
            abort(404)
        db.session.delete(item)
        db.session.commit()
        return (jsonify(result="ok"), 200)

    #--------- SECTION ---------#

