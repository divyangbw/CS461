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

#--------- AUTH ---------#
@app.route('/api/user/first', methods=['POST'])
def edit_user_first():
    email = request.json.get('email')
    first = request.json.get('first')
    return Auth.update_user_firstLast(email=email, first=first, last=None)

@app.route('/api/user/last', methods=['POST'])
def edit_user_last():
    email = request.json.get('email')
    last = request.json.get('last')
    return Auth.update_user_firstLast(email=email, first=None, last=last)

@app.route('/api/user', methods=['GET'])
def user():
    return Auth.all_users()

@app.route('/api/user/role', methods=['POST'])
def user_role():
    email = request.json.get('email')
    role = request.json.get('role')
    return Auth.change_role(email, role)

@app.route('/api/user/status', methods=['POST'])
def user_status():
    email = request.json.get('email')
    return Auth.toggle_isActive(email)



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
        print(str(date))
        return CastSeg.update_cast(id, company, date)

#--------- SEGEMENT ---------#

@app.route('/api/segmentfor/<int:cast_id>', methods=['POST', 'GET'])
def segment(cast_id):

    if request.method == 'GET':
        return CastSeg.all_seg(cast_id)
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
    section = request.json.get('section')

    return Questionnaire.new_question(type, text, section)

@app.route('/api/question/<int:id>', methods=['GET', 'DELETE', 'PUT'])
def question_single(id):
    if request.method == 'GET':
        return Questionnaire.get_question(id)
    if request.method == 'DELETE':
        return Questionnaire.delete_question(id)
    else:
        type = request.json.get('type')
        text = request.json.get('text')
        section = request.json.get('section')

        return Questionnaire.update_question(id, type, text, section)

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

@app.route('/api/my/assignments', methods=['GET'])
def my_assignments():
    if validate_user_session(request) is False:
        return Auth.abort_401()
    email = request.headers['email'];
    user = Auth.getUser(email)
    return AssignService.my_assignments(user)

#--------- ANSWERS ---------#

def all_questions_and_answers(assignment_id):
    return ""

@app.route('/api/admin/answers/<assignment_id>', methods=['GET'])
def all_answers(assignment_id):
    if validate_user_session(request) is False and validate_user_is_admin(request) is False:
        return Auth.abort_401()
    return AssignService.all_answers(assignment_id)

@app.route('/api/answer/<question_id>', methods=['POST'])
def save_answer(question_id):
    if validate_user_session(request) is False:
        return Auth.abort_401()
    assignment_id = request.json.get('assignment_id')
    answer = request.json.get('answer')
    id = request.json.get('id')
    print(str(assignment_id))
    print(str(answer))
    print(str(id))
    if id == -1 or id is None:
        print("Inside new")
        return AssignService.new_answer(question_id, assignment_id, answer)
    else:
        print("Inside update")
        return AssignService.update_Answer(int(id), answer)


#--------- MAIN ---------#

def validate_user_session(request):
    if request is None:
        return False
    if not request.headers:
        return False
    if "email" not in request.headers or "token" not in request.headers:
        return False;
    email = request.headers['email'];
    token = request.headers['token'];
    return Auth.check_user_token(email, token)

def validate_user_is_admin(request):
    if request is None:
        return False
    if not request.headers:
        return False
    if "email" not in request.headers:
        return False;
    email = request.headers['email'];
    return Auth.user_is_admin(email)

@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template('index.html')

if __name__ == '__main__':
    if not os.path.exists('db.sqlite'):
        db.create_all()
    else:
        db.create_all()
    app.run(debug=True)