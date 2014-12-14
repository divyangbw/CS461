from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy

# initialization
app = Flask(__name__)
app.config['SECRET_KEY'] = 'the quick brown fox jumps over the lazy dog'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite' #mysql+pymysql://mysqluser:mysqlpass@localhost:3306/databasename
app.config['SQLALCHEMY_COMMIT_ON_TEARDOWN'] = True

# extensions
db = SQLAlchemy(app)