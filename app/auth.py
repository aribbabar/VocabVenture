from flask import Blueprint, flash, redirect, render_template, request, url_for
from flask_login import login_user, logout_user
from .extensions import db
from .models import User
from werkzeug.security import generate_password_hash, check_password_hash

auth = Blueprint('auth', __name__)


@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == "POST":
        username = request.form.get('username')
        password = request.form.get('password')

        user = User.query.filter_by(username=username).first()

        if not user:
            flash('User does not exist', 'danger')
            return redirect(url_for('auth.login'))

        if not check_password_hash(user.password, password):
            flash('Incorrect password', 'danger')
            return redirect(url_for('auth.login'))

        login_user(user)
        flash('Logged in successfully', 'success')

        return redirect(url_for('main.home'))
    return render_template('login.html')


@auth.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == "POST":
        first_name = request.form.get('first_name')
        last_name = request.form.get('last_name')
        email = request.form.get('email')
        username = request.form.get('username')
        password = request.form.get('password')

        user = User.query.filter_by(email=email).first()

        # User already exists
        if user:
            flash('User already exists', 'danger')
            return redirect(url_for('auth.signup'))

        new_user = User(first_name=first_name, last_name=last_name, email=email,
                        username=username, password=generate_password_hash(password))

        db.session.add(new_user)
        db.session.commit()

        flash('Account created successfully', 'success')

        return redirect(url_for('auth.login'))

    return render_template('signup.html')


@auth.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('main.home'))
