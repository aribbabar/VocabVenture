from flask import (Blueprint, flash, jsonify, redirect, render_template,
                   request, url_for)
from flask_login import current_user, login_user, logout_user
from werkzeug.security import check_password_hash, generate_password_hash

from .extensions import db
from .models import Message, User

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


@auth.route("/check_authentication")
def check_authentication():
    return jsonify({"isAuthenticated": current_user.is_authenticated})


@auth.route("/get_user")
def get_user():
    if current_user.is_authenticated:
        first_name = current_user.first_name
        last_name = current_user.last_name

        return jsonify({"first_name": first_name, "last_name": last_name})
    return jsonify({"error": "User not authenticated"})


@auth.route("/save_message", methods=["POST"])
def save_message():
    if current_user.is_authenticated:
        message = request.json["message"]
        sender = request.json["sender"]

        new_message = Message(sender=sender, message=message,
                              user_id=current_user.id, user=current_user)

        db.session.add(new_message)
        db.session.commit()

        return jsonify({"message": "Message saved successfully!"}), 201
    return jsonify({"error": "User not authenticated"})


@auth.route("/get_messages")
def get_messages():
    if current_user.is_authenticated:
        messages = Message.query.filter_by(user_id=current_user.id).order_by(
            Message.created_at.asc()).all()

        messages_list = []
        for message in messages:
            messages_list.append({
                "sender": message.sender,
                "message": message.message,
            })

        return jsonify({"messages": messages_list})
    return jsonify({"error": "User not authenticated"})


@auth.route("/delete_messages", methods=["POST"])
def delete_messages():
    if current_user.is_authenticated:
        Message.query.filter_by(user_id=current_user.id).delete()
        db.session.commit()

        return jsonify({"message": "Messages deleted successfully!"}), 200
    return jsonify({"error": "User not authenticated"})
