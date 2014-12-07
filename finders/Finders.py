import os
from finders import app, db
from flask import render_template, request
from finders.services.auth import Auth
from finders.services.castSeg import CastSeg
from finders.services.questionnaire import Questionnaire
from finders.services.assignService import AssignService


#--------- AUTH ---------#

@app.route('/api/register', methods=['POST'])
def new_user():
    email = request.json.get('email')
    password = request.json.get('password')
    first = request.json.get('first')
    last = request.json.get('last')
    return Auth.new_user(email, password, first, last)

@app.route('/api/auth', defaults={'email': None}, methods=['POST'])
@app.route('/api/auth/<email>', methods=['DELETE'])
def login(email):
    if request.method == 'POST':
        emailIn = request.json.get('email')
        password = request.json.get('password')
        return Auth.check_user_password(emailIn, password)
    return Auth.delete_user_session(email)

#--------- CAST ---------#

@app.route('/api/cast', methods=['POST', 'GET'])
def cast():
    if request.method == 'GET':
        return CastSeg.all_casts()
    company = request.json.get('company')
    date = request.json.get('date')
    return CastSeg.new_cast(company, date)

@app.route('/api/cast/<int:id>', methods=['GET', 'DELETE', 'PUT'])
def cast_single(id):
    if request.method == 'GET':
        return CastSeg.get_cast(id)
    if request.method == 'DELETE':
        return CastSeg.delete_cast(id)
    else:
        company = request.json.get('company')
        date = request.json.get('date')
        return CastSeg.update_cast(id, company, date)

#--------- SEGEMENT ---------#

@app.route('/api/segmentfor/<int:cast_id>', methods=['POST', 'GET'])
def segment(cast_id):

    if request.method == 'GET':
        return CastSeg.all_seg(castId)
    print(cast_id)
    subject = request.json.get('subject')
    start = request.json.get('start')
    end = request.json.get('end')
    comment = request.json.get('comment')
    return CastSeg.new_seg(cast_id, subject, start, end, comment)

@app.route('/api/segment/<int:id>', methods=['GET', 'DELETE', 'PUT'])
def segment_single(id):
    if request.method == 'GET':
        return CastSeg.get_seg(id)
    if request.method == 'DELETE':
        return CastSeg.delete_seg(id)
    else:
        subject = request.json.get('subject')
        start = request.json.get('start')
        end = request.json.get('end')
        comment = request.json.get('comment')
        return CastSeg.update_seg(id, subject, start, end, comment)

#--------- QUESTIONS ---------#

@app.route('/api/question', methods=['POST', 'GET'])
def question():
    if request.method == 'GET':
        return Questionnaire.all_questions()
    type = request.json.get('type')
    text = request.json.get('text')
    return Questionnaire.new_question(type, text)

@app.route('/api/question/<int:id>', methods=['GET', 'DELETE', 'PUT'])
def question_single(id):
    if request.method == 'GET':
        return Questionnaire.get_question(id)
    if request.method == 'DELETE':
        return Questionnaire.delete_question(id)
    else:
        type = request.json.get('type')
        text = request.json.get('text')
        return Questionnaire.update_question(id, type, text)

#--------- OPTIONS ---------#

@app.route('/api/questionoptionfor/<int:question_id>', methods=['POST', 'GET'])
def questionOption(question_id):
    if request.method == 'GET':
        return Questionnaire.all_options(question_id)
    text = request.json.get('text')
    return Questionnaire.new_option(question_id, text)

@app.route('/api/questionoption/<int:id>', methods=['GET', 'DELETE', 'PUT'])
def questionOption_single(id):
    if request.method == 'GET':
        return Questionnaire.get_option(id)
    if request.method == 'DELETE':
        return Questionnaire.delete_option(id)
    else:
        text = request.json.get('text')
        return Questionnaire.update_option(id, text)

#--------- ASSIGNMENTS ---------#

@app.route('/api/assignments', methods=['POST', 'GET'])
def assignments():
    if request.method == 'GET':
        return Assignments.all_assignments()
    seg_id = request.json.get('seg_id')
    user_id = request.json.get('user_id')
    return AssignService.new_assignment(seg_id, user_id)



#--------- MAIN ---------#

@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template('index.html')

if __name__ == '__main__':
    if not os.path.exists('db.sqlite'):
        db.create_all()
    app.run(debug=True)