import os
from finders import app, db
from flask import request
from finders.services.auth import Auth

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
    else:
        return Auth.delete_user_session(email)

if __name__ == '__main__':
    if not os.path.exists('db.sqlite'):
        db.create_all()
    app.run(debug=True)