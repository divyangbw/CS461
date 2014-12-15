from flask.ext.sqlalchemy import SQLAlchemy
from finders.models import ser
from finders.models.cast import Cast, Segment
from finders.models.user import User
from finders.models.questions import Question, Option
from finders.models.questionsAnswers import QuestionAnswers, QuestionAnswersValue, QuestionAnswersOption

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
    def serialize_toAnswer(self):
       return {
           'id': self.id,
           'user_id': self.user_id,
           'segment' : self.getSegment.serialize,
           'cast' : self.getCast.serialize_no_join,
           'completed' : self.completed,
           'questions'  : self.serialize_question_answers,
           'section'  : self.serialize_sections,
           'updated': ser.dump_datetime(self.updated)
       }

    @property
    def serialize_question_answers(self):
        questions = Question.query.all()
        # Get all the sections
        secTemp = AssignSection.query.filter_by(assignment_id=self.id)
        sections = []
        for sec in secTemp:
            print(str(sec))
            sections.append(sec.section)
        user = User.query.get(self.user_id)
        print(sections)
        toReturn = []
        for question in questions:
            if user.role == "mod" or question.section in sections:
                item = QuestionAnswers()
                item.id = question.id
                item.type = question.type
                item.text = question.text
                item.section = question.section
                opts = []
                # Get all the options if any exist
                for optItem in question.options:
                    singleOpts = QuestionAnswersOption()
                    singleOpts.id = optItem.id
                    singleOpts.question_id = optItem.question_id
                    singleOpts.text = optItem.text
                    singleOpts.updated = optItem.updated
                    singleOpts.checked = False
                    opts.append(singleOpts)
                item.options = opts
                item.updated = question.updated
                item.answer = None
                # Add all the answers to question
                for ans in self.answers:
                    if ans.question_id == question.id:
                        answer = QuestionAnswersValue()
                        answer.id = ans.id
                        answer.answer = ans.answer
                        item.answer = answer
                        break

                if item.answer is None:
                    item.answer = QuestionAnswersValue()
                    item.answer.id = -1
                    item.answer.answer = ""
                else:
                    if item.type == "Multiple Choice":
                        item.answer.answer = int(item.answer.answer)
                    elif item.type == "Multi-Choice":
                        idCollectionParsed = item.answer.answer.split('$$>AS<$$')
                        for splitId in idCollectionParsed:
                            for option in item.options:
                                if option.id == int(splitId):
                                    option.checked = True
                toReturn.append(item)
        #Return
        return [ item.serialize for item in toReturn ]

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
            'question': self.get_question,
            'answer' : self.answer,
            'parsed_answer' : self.parse_answer,
            'assignment_id' : self.assignment_id,
            'updated' : ser.dump_datetime(self.updated)
        }

    @property
    def get_question(self):
        return Question.query.get(self.question_id).serialize

    @property
    def parse_answer(self):
        question = Question.query.get(self.question_id)
        if question.type == "Single Line":
            return self.answer
        elif question.type == "Multi-Choice":
            items = self.answer.split('$$>AS<$$')
            toReturn = []
            for item in items:
                choice = Option.query.get(int(item))
                toReturn.append(choice.text)
            return toReturn
        else:
            choice = Option.query.get(int(self.answer))
            return choice.text


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

class AdminAssign():

    @property
    def serialize(self):
       return {
           "castCompany": self.castCompany,
           "castDate": self.castDate,
           "castDate": self.castDate,
           "segId": self.segId,
           "segSubject": self.segSubject,
           "segStart": self.segStart,
           "segEnd": self.segEnd,
           "users": self.serialize_users
       }

    @property
    def serialize_users(self):
       return [ item.serialize for item in self.users ]

class AdminAssignUser():

    @property
    def serialize(self):
       return {
           'id': self.id,
           'user': self.user.serialize,
           'sections': self.serialize_sections
       }

    @property
    def serialize_sections(self):
       return [ item.serialize for item in self.sections ]