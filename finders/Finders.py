import os
from finders import app, db
from flask import render_template, request
from finders.services.auth import Auth
from finders.services.castSeg import CastSeg

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
        return CastSeg.update_Cast(id, company, date)



@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template('index.html')

if __name__ == '__main__':
    if not os.path.exists('db.sqlite'):
        db.create_all()
    app.run(debug=True)