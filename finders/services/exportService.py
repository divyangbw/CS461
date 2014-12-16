from flask import abort, jsonify, Response, make_response
from finders.models import ser
from finders.models.assignments import Option, Question, Cast, Segment, Answer, Assignment, AssignSection, User
import csv

class ExportAllModel:

    @property
    def serialize(self):
       return {
           'Cast Company': self.company,
           'Cast Date' : ser.dump_datetime(self.date)[0],
           'Segment Subject'  : self.subject,
           'First Name'  : self.first,
           'Last Name'  : self.last,
           'Question Section'  : self.questionSection,
           'Question Type'  : self.questionType,
           'Question'  : self.questionText,
           'Answer'  : self.answer
       }

    @property
    def serialize_csv(self):
       return "\"" + str(self.id) + "\"," +  "\"" +str(self.company) + "\"," + "\"" + ser.dump_datetime(self.date)[0] + "\"," + "\"" + str(self.subject) + "\"," + "\"" + str(self.first) + "\"," + "\"" + str(self.last) + "\"," + "\"" + str(self.questionSection) + "\"," + "\"" + str(self.questionType) + "\"," + "\"" + str(self.questionText) + "\"," + "\"" + str(self.answer) + "\" \n"

class ExportService:

    def export_csv_all_questions(self):
        casts = Cast.query.all()
        toReturn = []
        for cast in casts:
            for segment in cast.segments:
                for assignment in segment.assignments:
                    answers = Answer.query.filter_by(assignment_id=assignment.id)
                    for answer in answers:
                        question = Question.query.get(answer.question_id)
                        user = User.query.get(assignment.user_id)
                        export = ExportAllModel()
                        export.id = assignment.id
                        export.company = cast.company
                        export.date = cast.date
                        export.subject = segment.subject
                        export.first = user.first
                        export.last = user.last
                        export.questionText = question.text
                        export.questionType = question.type
                        export.questionSection = question.section
                        export.answer = self.parse_answer(question=question, answer=answer.answer)
                        toReturn.append(export.serialize_csv)
        #return (jsonify(result=[i.serialize for i in toReturn]), 200)
        newToReturn = "Assignment ID, Cast Company, Cast Date, Segment Subject, First Name, Last Name, Question Section, " \
                      "Question Type, Question, Answer \n"
        for row in toReturn:
            newToReturn += row
        response = make_response(newToReturn)
        response.headers["Content-Disposition"] = "attachment;filename=All_Answers.csv"
        return response

    def export_csv_questions_for_assign(self, assignment_id):
        if assignment_id is None:
            abort(404)
        assignment = Assignment.query.get(assignment_id)
        if assignment is None:
            abort(404)
        segment = Segment.query.get(assignment.seg_id)
        cast = Cast.query.get(segment.cast_id)
        user = User.query.get(assignment.user_id)
        answers = Answer.query.filter_by(assignment_id=assignment_id)
        toReturn = []
        for answer in answers:
            question = Question.query.get(answer.question_id)
            user = User.query.get(assignment.user_id)
            export = ExportAllModel()
            export.id = assignment.id
            export.company = cast.company
            export.date = cast.date
            export.subject = segment.subject
            export.first = user.first
            export.last = user.last
            export.questionText = question.text
            export.questionType = question.type
            export.questionSection = question.section
            export.answer = self.parse_answer(question=question, answer=answer.answer)
            toReturn.append(export.serialize_csv)
        newToReturn = "Assignment ID, Cast Company, Cast Date, Segment Subject, First Name, Last Name, Question Section, " \
                      "Question Type, Question, Answer \n"
        for row in toReturn:
            newToReturn += row
        response = make_response(newToReturn)
        response.headers["Content-Disposition"] = "attachment;filename=Answers_Assignment_" + str(assignment.id) + ".csv"
        return response

    def parse_answer(self, question, answer):
        if question.type == "Single Line":
            return answer
        elif question.type == "Multi-Choice":
            items = answer.split('$$>AS<$$')
            toReturn = ""
            firstDone = False
            for item in items:
                if firstDone is True:
                    toReturn += ","
                else:
                    firstDone = True
                choice = Option.query.get(int(item))
                toReturn += str(choice.text)
            return toReturn
        else:
            choice = Option.query.get(int(answer))
            return choice.text