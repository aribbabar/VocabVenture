from flask import Blueprint, render_template
from flask_login import current_user

main = Blueprint('main', __name__)


@main.route('/')
def home():
    print(current_user.is_authenticated)

    return render_template('layout.html')


@main.route('/matching')
def matching_game():
    return render_template('matching.html')


@main.route('/lesson_one')
def lesson_one():
    return render_template('lesson_one.html')


@main.route('/quiz')
def quiz():
    return render_template('quiz.html')


@main.route('/german_lesson')
def german_lesson():
    return render_template('german.html')


@main.route("/chatbot")
def chatbot():
    return render_template('chatbot.html')
