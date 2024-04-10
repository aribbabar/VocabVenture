from flask import Blueprint, render_template, request
from .extensions import db

auth = Blueprint('auth', __name__)


@auth.route('/login')
def login():
    return render_template('login.html')


@auth.route('/signup', methods=['GET', 'POST'])
def signup():
    print(request.method)
    if request.method == "POST":
        email = request.form.get('email')
        password = request.form.get('password')
        first_name = request.form.get('first_name')
        last_name = request.form.get('last_name')

        return 'User created'

    return render_template('signup.html')


@auth.route('/logout')
def logout():
    return 'Logout'
