from dateutil import parser
from flask import abort, jsonify
from finders.models.assignments import Assignment, Answer, AssignSection, Option, Question, Segment, Cast, User, AdminAssign, AdminAssignUser
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
        items = Assignment.query.filter_by(user_id=user.id).all()
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
            {'id':item.id, 'question_id': item.question_id, 'answer':item.answer, 'seg_que_id':item.seq_que_id,
             'updated':item.updated }), 200)

    def delete_assignment(id):
        if id is None:
            abort(400)    # missing arguments
        item = Assignment.query.get(id)
        if item is None:
            abort(404)
        db.session.delete(item)
        db.session.commit()
        return (jsonify(result="ok"), 200)

    def get_admin_assignments():
        toReturn = []
        allSegs = Segment.query.all()
        for seg in allSegs:
            # Store basic info
            cast = Cast.query.get(seg.cast_id)
            singleAdminAssign = AdminAssign()
            singleAdminAssign.castCompany = cast.company
            singleAdminAssign.castDate = cast.date
            singleAdminAssign.segId = seg.id
            singleAdminAssign.segSubject = seg.subject
            singleAdminAssign.segStart = seg.start
            singleAdminAssign.segEnd = seg.end
            # Get all Users
            singleAdminAssign.users = []
            allAssign = Assignment.query.filter_by(seg_id=seg.id)
            for assignment in allAssign:
                #Get basic user info
                user = User.query.get(assignment.user_id)
                assignUser = AdminAssignUser()
                assignUser.user = user
                assignUser.sections = []
                #Get all sections
                sections = AssignSection.query.filter_by(assignment_id=assignment.id)
                for sec in sections:
                    assignUser.sections.append(sec)
                singleAdminAssign.users.append(assignUser)
            toReturn.append(singleAdminAssign)

        return (jsonify(result=[i.serialize for i in toReturn]), 200)


    #--------- ANSWERS ---------#

    def new_answer(question_id, assignment_id, answer):
        if question_id is None or assignment_id is None or answer is None:
            abort(400)    # missing arguments
        updated = datetime.datetime.now()
        item = Answer(question_id=question_id,assignment_id=assignment_id,answer=answer,updated=updated)
        db.session.add(item)
        db.session.commit()
        return (jsonify(result= {
            'id':item.id, 'question_id': item.question_id, 'assignment_id':item.assignment_id,
            'answer':item.answer, 'updated':item.updated
        }), 201)

    def all_answers(assignment_id):
        items = Answer.query.filter_by(assignment_id=assignment_id)
        return (jsonify(result=[i.serialize for i in items]), 200)

    def get_answer(id):
        if id is None:
            abort(400)    # missing arguments
        item = Answer.query.get(id)
        if item is None:
            abort(404)
        return (jsonify(result=item.serialize), 200)

    def update_Answer(id, answer):
        if id is None or answer is None:
            abort(400)    # missing arguments
        item = Answer.query.get(id)
        assignment = Assignment.query.get(item.assignment_id)
        if item is None or assignment is None:
            abort(404)
        if assignment.completed is True:
            abort(403)
        item.answer = answer;
        item.updated = datetime.datetime.now();
        db.session.commit()
        return (jsonify(result= {
            'id':item.id, 'question_id': item.question_id, 'assignment_id':item.assignment_id,
            'answer':item.answer, 'updated':item.updated
        }), 200)

    def delete_answer(id):
        if id is None:
            abort(400)    # missing arguments
        item = Answer.query.get(id)
        if item is None:
            abort(404)
        db.session.delete(item)
        db.session.commit()
        return (jsonify(result="ok"), 200)

    #--------- ANSWERING QUESTIONS ---------#
    def get_questions_to_answer(assignment_id):
        assignment = Assignment.query.get(assignment_id)
        if assignment.completed is True:
            abort(403)
        return (jsonify(result=assignment.serialize_question_answers), 200)

    def submit_question_form(assignment_id):
        assignment = Assignment.query.get(assignment_id)
        if assignment.completed is True:
            abort(403)
        assignment.completed = True
        assignment.updated = datetime.datetime.now();
        db.session.commit()
        return (jsonify(result="ok"), 200)




