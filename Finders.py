import os, uuid,random,string
from flask import Flask, render_template, abort, request, jsonify, url_for
from flask.ext.sqlalchemy import SQLAlchemy
from passlib.apps import custom_app_context as pwd_context
from itsdangerous import (TimedJSONWebSignatureSerializer
                          as Serializer, BadSignature, SignatureExpired)
import datetime


# initialization
app = Flask(__name__)
app.config['SECRET_KEY'] = 'the quick brown fox jumps over the lazy dog'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'
app.config['SQLALCHEMY_COMMIT_ON_TEARDOWN'] = True

# extensions
db = SQLAlchemy(app)

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



    @staticmethod
    def verify_auth_token(token):
        s = Serializer(app.config['SECRET_KEY'])
        try:
            data = s.loads(token)
        except SignatureExpired:
            return None    # valid token, but expired
        except BadSignature:
            return None    # invalid token
        user = User.query.get(data['id'])
        return user


def verify_password(email_or_token, password):
    # first try to authenticate by token
    user = User.verify_auth_token(email_or_token)
    if not user:
        # try to authenticate with email/password
        user = User.query.filter_by(email=email_or_token).first()
        if not user or not user.verify_password(password):
            return False
    #g.user = user
    return True

def generate_auth_token():
    new_token = ''.join(random.choice(string.lowercase) for x in range(128))
    return new_token

@app.route('/api/register', methods=['POST'])
def new_user():
    email = request.json.get('email')
    password = request.json.get('password')
    first = request.json.get('first')
    last = request.json.get('last')
    if email is None or password is None or first is None or last is None:
        abort(400)    # missing arguments
    if User.query.filter_by(email=email).first() is not None:
        abort(400)    # existing user
    token = generate_auth_token()
    updated_n = datetime.datetime.now()
    user = User(email=email, first=first, last=last, token=token, updated=updated_n)
    user.hash_password(password)
    db.session.add(user)
    db.session.commit()
    return (jsonify(
        {'id':user.id, 'email': user.email, 'first':first, 'last':last, 'token': token, 'updated': updated_n}
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

@app.route('/api/token')
def get_auth_token():
    token = generate_auth_token(600)
    return jsonify(
        {'token': token.decode('ascii'), 'duration': 1})


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

if __name__ == '__main__':
    if not os.path.exists('db.sqlite'):
        db.create_all()
    app.run(debug=True)