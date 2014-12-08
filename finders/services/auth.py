import datetime
from flask import abort, jsonify
from finders.models.user import User
from finders.services import utils

from finders import db

class Auth:

    def new_user(email, password, first, last):
        if email is None or password is None or first is None or last is None:
            abort(400)    # missing arguments
        if User.query.filter_by(email=email).first() is not None:
            abort(401)    # existing user
        token = utils.generate_auth_token()
        updated_n = datetime.datetime.now()
        user = User(email=email, first=first, last=last,updated=updated_n,role='user')
        user.hash_password(password)
        user.hash_token(token)
        db.session.add(user)
        db.session.commit()
        return (jsonify({
            'id':user.id, 'email': email, 'first':first, 'last':last,
            'token': token, 'updated': updated_n, 'role': 'user'
        }), 201)

    def check_user_password(email, password):
        if email is None or password is None:
            abort(400)    # missing arguments
        user = User.query.filter_by(email=email).first()
        if user is None:
            abort(404)
        if user.verify_password(password):
            token = utils.generate_auth_token()
            user.updated = datetime.datetime.now()
            user.hash_token(token)
            db.session.commit()
            return (jsonify({
                'id':user.id, 'email': user.email, 'first':user.first, 'last':user.last,
                'token': token, 'updated': user.updated, 'role' : user.role
            }), 201)
        else:
            abort(401)

    def delete_user_session(email):
        if email is None:
            abort(400)
        user = User.query.filter_by(email=email).first()
        if user is None:
            abort(404)
        token = utils.generate_auth_token()
        user.updated = datetime.datetime.now()
        user.hash_token(token)
        db.session.commit()
        return (jsonify({'message':"logged out"}), 200)

    def update_user_firstLast(email, first, last):
        if email is None:
            abort(400)
        user = User.query.filter_by(email=email).first()
        if user is None:
            abort(404)
        if first is None:
            user.last = last
        else:
            user.first = first
        user.updated = datetime.datetime.now()
        db.session.commit()
        return (jsonify({'message':"ok"}), 200)

    def all_users():
        users = User.query.filter(User.role != 'admin').all()
        return (jsonify(result=[i.serialize for i in users]), 200)

    def change_role(email, role):
        print("IN CHANGE ROLE")
        if email is None or role is None:
            print("email or role is none")
            abort(400)
        user = User.query.filter_by(email=email).first()
        print("USER is")
        print(user)

        if user is None:
            print("User is none")
            abort(404)
        if role is "admin":
            print("role is none")
            abort(400)
        print("Role is " + str(role))
        if role == "mod" or role == "user":
            print("mod or user")
            user.role = role
            db.session.commit()
            return (jsonify({'message':"ok"}), 200)
        else:
            abort(400)