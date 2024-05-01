import requests
from flask_login import current_user

from app.models import User


def test_home(client):
    response = client.get('/')
    assert response.status_code == 200


def test_signup(client, app):
    response = client.post('/signup', data={
        "first_name": "John",
        "last_name": "Doe",
        "email": "johndoe@gmail.com",
        "username": "johndoe",
        "password": "password"
    })

    with app.app_context():
        user = User.query.filter_by(username="johndoe").first()
        assert user is not None
        assert user.first_name == "John"
        assert user.last_name == "Doe"
        assert user.email == "johndoe@gmail.com"
        assert user.username == "johndoe"
        assert user.password is not None
        assert User.query.count() == 1
        assert response.status_code == 302


def test_login(client, app):
    with client:
        client.post('/signup', data={
            "first_name": "John",
            "last_name": "Doe",
            "email": "johndoe@gmail.com",
            "username": "johndoe",
            "password": "password"
        })

        response = client.post('/login', data={
            "username": "johndoe",
            "password": "password"
        })

        user = User.query.filter_by(username="johndoe").first()
        assert current_user == user
        assert response.status_code == 302


def test_logout(client):
    with client:
        client.post('/signup', data={
            "first_name": "John",
            "last_name": "Doe",
            "email": "johndoe@gmail.com",
            "username": "johndoe",
            "password": "password"
        })

        client.post('/login', data={
            "username": "johndoe",
            "password": "password"
        })

        response = client.get('/logout')

        assert response.status_code == 302
        assert not current_user.is_authenticated


def test_wit_api():
    response = requests.get('https://api.wit.ai/message?v=20240417&q=how do you say "how are you" in spanish', headers={
        "Authorization": "Bearer ZQC6XKXB5ZVUM5AD4JOF6RUGZYMKK77X",
        "Content-Type": "application/json"
    })

    json = response.json()
    assert response.status_code == 200
    assert json['intents'][0]['name'] == 'translation'
    assert json['entities']['language:language'][0]['value'] == 'Spanish'
    assert json['entities']['wit$phrase_to_translate:phrase_to_translate'][0]['value'] == 'how are you'


def test_save_message_without_auth(client):
    response = client.post("/save_message", data={
        "message": "Hello",
        "sender": "user"
    })

    assert b"error" in response.data


def test_save_message_with_auth(client, app):
    with client:
        client.post('/signup', data={
            "first_name": "John",
            "last_name": "Doe",
            "email": "johndoe@gmail.com",
            "username": "johndoe",
            "password": "password"
        })

        client.post('/login', data={
            "username": "johndoe",
            "password": "password"
        })

        response = client.post("/save_message", json={
            "message": "Hello",
            "sender": "user"
        })

        user = User.query.filter_by(username="johndoe").first()

        assert b'Message saved successfully!' in response.data
        assert len(user.messages) == 1
