#from app import app
from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

@app.route('/')
def home():
    # This route always displays the homepage
    return render_template('layout.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # Implement login logic here
        # For demonstration, let's just redirect them back to home
        return redirect(url_for('home'))
    # Shows the login form when method is GET
    return render_template('login.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        # Implement signup logic here
        # For demonstration, redirect them to home
        return redirect(url_for('home'))
    # Shows the signup form when method is GET
    return render_template('signup.html')

if __name__ == '__main__':
    app.run(debug=True)
