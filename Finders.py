import os, traceback, sys
from finders import app, db
from flask import render_template, request
from finders.services.auth import Auth
from finders.services.castSeg import CastSeg
from finders.services.questionnaire import Questionnaire
from finders.services.assignService import AssignService
from finders.services.exportService import ExportService

app.config['DEBUG'] = True
app.secret_key = '123'
#--------- AUTH ---------#

@app.route('/api/register', methods=['POST'])
def new_user():
    try:
        email = request.json.get('email')
        password = request.json.get('password')
        first = request.json.get('first')
        last = request.json.get('last')
        au = Auth()
        return au.new_user(email, password, first, last)
    except:
            traceback.print_exc(file=sys.stdout)

@app.route('/api/auth', defaults={'email': None}, methods=['POST'])
@app.route('/api/auth/<email>', methods=['DELETE'])
def login(email):
    au = Auth()
    if request.method == 'POST':
        emailIn = request.json.get('email')
        password = request.json.get('password')
        return au.check_user_password(emailIn, password)
    return au.delete_user_session(email)

#--------- USER ---------#
@app.route('/api/user/first', methods=['POST'])
def edit_user_first():
    au = Auth()
    email = request.json.get('email')
    first = request.json.get('first')
    return au.update_user_firstLast(email=email, first=first, last=None)

@app.route('/api/user/last', methods=['POST'])
def edit_user_last():
    au = Auth()
    email = request.json.get('email')
    last = request.json.get('last')
    return au.update_user_firstLast(email=email, first=None, last=last)

@app.route('/api/user', methods=['GET'])
def user():
    au = Auth()
    return au.all_users()

@app.route('/api/user/role', methods=['POST'])
def user_role():
    au = Auth()
    email = request.json.get('email')
    role = request.json.get('role')
    return au.change_role(email, role)

@app.route('/api/user/status', methods=['POST'])
def user_status():
    au = Auth()
    email = request.json.get('email')
    return au.toggle_isActive(email)



#--------- CAST ---------#

@app.route('/api/cast', methods=['POST', 'GET'])
def cast():
    cs = CastSeg()
    if request.method == 'GET':
        return cs.all_casts()
    company = request.json.get('company')
    date = request.json.get('date')
    return cs.new_cast(company, date)

@app.route('/api/cast/<int:id>', methods=['GET', 'DELETE', 'PUT'])
def cast_single(id):
    cs = CastSeg()
    if request.method == 'GET':
        return cs.get_cast(id)
    if request.method == 'DELETE':
        return cs.delete_cast(id)
    else:
        company = request.json.get('company')
        date = request.json.get('date')
        print(str(date))
        return cs.update_cast(id, company, date)

#--------- SEGEMENT ---------#

@app.route('/api/segmentfor/<int:cast_id>', methods=['POST', 'GET'])
def segment(cast_id):
    cs = CastSeg()
    if request.method == 'GET':
        return cs.all_seg(cast_id)
    print(cast_id)
    subject = request.json.get('subject')
    start = request.json.get('start')
    end = request.json.get('end')
    comment = request.json.get('comment')
    return cs.new_seg(cast_id, subject, start, end, comment)

@app.route('/api/segment/<int:id>', methods=['GET', 'DELETE', 'PUT'])
def segment_single(id):
    cs = CastSeg()
    if request.method == 'GET':
        return cs.get_seg(id)
    if request.method == 'DELETE':
        return cs.delete_seg(id)
    else:
        subject = request.json.get('subject')
        start = request.json.get('start')
        end = request.json.get('end')
        comment = request.json.get('comment')
        return cs.update_seg(id, subject, start, end, comment)

#--------- QUESTIONS ---------#

@app.route('/api/question', methods=['POST', 'GET'])
def question():
    qs = Questionnaire()
    if request.method == 'GET':
        return qs.all_questions()
    type = request.json.get('type')
    text = request.json.get('text')
    section = request.json.get('section')
    return qs.new_question(type, text, section)

@app.route('/api/question/<int:id>', methods=['GET', 'DELETE', 'PUT'])
def question_single(id):
    qs = Questionnaire()
    if request.method == 'GET':
        return qs.get_question(id)
    if request.method == 'DELETE':
        return qs.delete_question(id)
    else:
        type = request.json.get('type')
        text = request.json.get('text')
        section = request.json.get('section')
        return qs.update_question(id, type, text, section)

#--------- OPTIONS ---------#

@app.route('/api/questionoptionfor/<int:question_id>', methods=['POST', 'GET'])
def questionOption(question_id):
    qs = Questionnaire()
    if request.method == 'GET':
        return qs.all_options(question_id)
    text = request.json.get('text')
    return qs.new_option(question_id, text)

@app.route('/api/questionoption/<int:id>', methods=['GET', 'DELETE', 'PUT'])
def questionOption_single(id):
    qs = Questionnaire()
    if request.method == 'GET':
        return qs.get_option(id)
    if request.method == 'DELETE':
        return qs.delete_option(id)
    else:
        text = request.json.get('text')
        return qs.update_option(id, text)

#--------- ASSIGNMENTS ---------#

@app.route('/api/assignments', methods=['POST', 'GET'])
def assignments():
    asr = AssignService()
    if request.method == 'GET':
        return asr.all_assignments()
    seg_id = request.json.get('seg_id')
    user_id = request.json.get('user_id')
    return asr.new_assignment(seg_id, user_id)

@app.route('/api/my/assignments', methods=['GET'])
def my_assignments():
    asr = AssignService()
    au = Auth()
    if validate_user_session(request) is False:
        return Auth.abort_401()
    email = request.headers['email'];
    user = au.getUser(email)
    return asr.my_assignments(user)

@app.route('/api/admin/assignments', methods=['GET'])
def get_admin_assignments():
    asr = AssignService()
    au = Auth()
    if validate_user_session(request) is False and validate_user_is_admin(request) is False:
        return au.abort_401()
    return asr.get_admin_assignments()

@app.route('/api/admin/assign/users/<segment_id>', methods=['GET', 'POST'])
def admin_assign_get_list(segment_id):
    asr = AssignService()
    au = Auth()
    if validate_user_session(request) is False and validate_user_is_admin(request) is False:
        return au.abort_401()
    if request.method == 'GET':
        return asr.get_non_assigned_users(segment_id)
    else:
        user_id = request.json.get('user_id')
        sections = request.json.get('sections')
        sectionsArr = []
        for sec in sections:
            if sec["checked"] is True:
                sectionsArr.append(sec["value"])
        return asr.assign_user_to_seg(segment_id, user_id, sectionsArr)

@app.route('/api/admin/assign/sections', methods=['GET'])
def admin_assign_get_section_count():
    asr = AssignService()
    au = Auth()
    if validate_user_session(request) is False and validate_user_is_admin(request) is False:
        return au.abort_401()
    return asr.admin_assign_get_section_count()

@app.route('/api/admin/assign/delete/<assignment_id>', methods=['DELETE'])
def admin_assign_delete_user(assignment_id):
    asr = AssignService()
    au = Auth()
    if validate_user_session(request) is False and validate_user_is_admin(request) is False:
        return au.abort_401()
    return asr.admin_assign_delete_user(assignment_id)


#--------- ANSWERS ---------#
@app.route('/api/question/answers/<assignment_id>', methods=['GET'])
def all_questions_and_answers(assignment_id):
    asr = AssignService()
    au = Auth()
    if validate_user_session(request) is False:
        return au.abort_401()
    return asr.get_questions_to_answer(assignment_id)

@app.route('/api/question/submit/<assignment_id>', methods=['PUT'])
def submit_question_form(assignment_id):
    asr = AssignService()
    au = Auth()
    if validate_user_session(request) is False:
        return au.abort_401()
    return asr.submit_question_form(assignment_id)

@app.route('/api/admin/answers/<assignment_id>', methods=['GET'])
def all_answers(assignment_id):
    asr = AssignService()
    au = Auth()
    if validate_user_session(request) is False or validate_user_is_admin(request) is False:
        return au.abort_401()
    return asr.all_answers(assignment_id)

@app.route('/api/answer/<question_id>', methods=['POST'])
def save_answer(question_id):
    asr = AssignService()
    au = Auth()
    if validate_user_session(request) is False:
        return au.abort_401()
    assignment_id = request.json.get('assignment_id')
    answer = request.json.get('answer')
    id = request.json.get('id')
    if id == -1 or id is None:
        print("Inside new")
        return asr.new_answer(question_id, assignment_id, answer)
    else:
        print("Inside update")
        return asr.update_Answer(int(id), answer)

#Apply permissions
@app.route('/api/admin/export/questions', methods=['GET'])
def export_csv_all_questions():
    es = ExportService()
    return es.export_csv_all_questions()

#Apply permissions
@app.route('/api/admin/export/questions/<assignment_id>', methods=['GET'])
def export_csv_questions_for_assign(assignment_id):
    es = ExportService()
    return es.export_csv_questions_for_assign(assignment_id)


#--------- MAIN ---------#

def validate_user_session(request):
    au = Auth()
    if request is None:
        return False
    if not request.headers:
        return False
    if "email" not in request.headers or "token" not in request.headers:
        return False;
    email = request.headers['email'];
    token = request.headers['token'];
    return au.check_user_token(email, token)

def validate_user_is_admin(request):
    au = Auth()
    if request is None:
        return False
    if not request.headers:
        return False
    if "email" not in request.headers:
        return False;
    email = request.headers['email'];
    return au.user_is_admin(email)

@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template('index.html')

if __name__ == '__main__':
    if not os.path.exists('db.sqlite'):
        db.create_all()
    app.run(debug=True)