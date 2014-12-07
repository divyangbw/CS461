import os, uuid,random, string
#from Fin

#from flask import Flask, render_template, abort, request, jsonify, url_for
#from flask.ext.sqlalchemy import SQLAlchemy
#from passlib.apps import custom_app_context as pwd_context
#from services.auth import Auth






'''
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(128), index=True)
    password_hash = db.Column(db.String(64))
    first = db.Column(db.String(128))
    last = db.Column(db.String(128))
    token = db.Column(db.String(128))
    updated = db.Column(db.DATETIME)

    def hash_password(self, password):
        self.password_hash = pwd_context.encrypt(password)

    def verify_password(self, password):
        return pwd_context.verify(password, self.password_hash)

    def hash_token(self, token):
        self.token = pwd_context.encrypt(token)

    def verify_token(self, token):
        return pwd_context.verify(token, self.token)

def generate_auth_token():
    new_token = ''.join(random.choice(string.ascii_lowercase) for x in range(128))
    return new_token
'''

'''
@app.route('/api/register', methods=['POST'])
def new_user():
    email = request.json.get('email')
    password = request.json.get('password')
    first = request.json.get('first')
    last = request.json.get('last')
    return Auth.new_user(email, password, first, last)


    if email is None or password is None or first is None or last is None:
        abort(400)    # missing arguments
    if User.query.filter_by(email=email).first() is not None:
        abort(401)    # existing user
    token = generate_auth_token()
    updated_n = datetime.datetime.now()
    user = User(email=email, first=first, last=last, updated=updated_n)
    user.hash_password(password)
    user.hash_token(token)
    db.session.add(user)
    db.session.commit()
    return (jsonify(
        {'id':user.id, 'email': email, 'first':first, 'last':last, 'token': token, 'updated': updated_n}
    ), 201)


@app.route('/api/users/<int:id>')
def get_user(id):
    user = User.query.get(id)
    if not user:
        abort(400)
    return jsonify({'id':user.id, 'email': user.email, 'first':user.first, 'last':user.last})



@app.route('/api/login', methods=['POST'])
def login():
    email = request.json.get('email')
    password = request.json.get('password')
    if email is None or password is None:
        abort(400)    # missing arguments
    if User.query.filter_by(email=email).first() is not None:
        token = generate_auth_token()
        updated_n = datetime.datetime.now()
        user = User(email=email, token=token, updated=updated_n)
        user.hash_password(password)
    return (jsonify(
        {'id':user.id, 'email': user.email, 'first':'yolo', 'last':'yolo', 'token': token, 'updated': updated_n}
    ), 201)



@app.route('/api/user', methods=['GET'])
def get_user_details():
    return jsonify({'id':User.id, 'email': User.email, 'first':User.first, 'last':User.last})




@app.route('/api/logout')
def logout():
    print("logout")
    return 1

@app.route('/api/resource')
def get_resource():
    return jsonify({'data': 'Hello, %s!' % User.email})


@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template('index.html')

'''

