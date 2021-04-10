from flask import Flask, request, jsonify
from flask_cors import CORS
import Database
import json
from flask import make_response
from random import randint

# Flask and Cors that runs app and makes http request possible
app = Flask(__name__)
CORS(app)

# Create instance of database
VirtualBoardDB = Database.Database('admin', 'admin')

# Add guest log-ins
VirtualBoardDB.add('Sam', '#IBMCIC', False)
VirtualBoardDB.add('Bertha', '#IBMCIC', False)


@app.route("/verify", methods=['POST'])
def verify_user():
    '''Verify user and password'''
    data = request.json
    print(data)
    username = str(data['username'])
    password = str(data['password'])

    content = ''
    response = ''

    if VirtualBoardDB.verify(username, password):
        print('Success')
        content = json.dumps({'access': True})
    else:
        print('Failed')
        content = json.dumps({'access': False})

    response = make_response(content, 200, {
                             'Content-Type': 'application/json', 'Access-Control-Allow-Credentials': 'true'})
    return response


@app.route("/getPreferredName", methods=['POST'])
def get_preferred_name():
    '''Get preferred name of user. Default is username.'''
    data = request.json
    print(data)
    username = str(data['username'])
    preferred_name = VirtualBoardDB.getPreferredName(username)

    if preferred_name is not None:
        content = json.dumps({'preferredName': preferred_name})
        response = make_response(content, 200, {
            'Content-Type': 'application/json', 'Access-Control-Allow-Credentials': 'true'})
        return response
    else:
        error = json.dumps({'error': 'Invalid Content Type'})
        return make_response(error, 400)


@app.route("/setPreferredName", methods=['POST'])
def set_preferred_name():
    '''Set preferred displayed username.'''
    data = request.json
    username = str(data['username'])
    password = str(data['password'])
    preferred_name = str(data['preferredName'])

    succeeded = VirtualBoardDB.setPreferredName(
        username, password, preferred_name)

    if succeeded:
        response = make_response(json.dumps({}), 200, {
                                 'Content-Type': 'application/json', 'Access-Control-Allow-Credentials': 'true'})
        return response
    else:
        error = json.dumps({'error': 'Invalid Content Type'})
        return make_response(error, 400)


@app.route("/resetPassword", methods=['POST'])
def reset_password():
    '''Reset password for user.'''
    data = request.json
    username = str(data['username'])

    possible_characters = ['#', 'I', 'B', 'M', 'C', 'I', 'C']
    new_password = ''
    for i in range(0, len(possible_characters)):
        new_password = new_password + \
            possible_characters[randint(0, len(possible_characters)) - 1]

    if VirtualBoardDB.resetPassword(username, new_password):
        content = json.dumps({'newPassword': new_password})
        response = make_response(content, 200, {
                                 'Content-Type': 'application/json', 'Access-Control-Allow-Credentials': 'true'})
        return response
    else:
        error = json.dumps({'error': 'Invalid Content Type'})
        return make_response(error, 400)


@app.route("/savePost", methods=['POST'])
def save_post():
    '''Save posts for other users to see or refreshing page.'''
    data = request.json
    posts = str(data['posts'])

    VirtualBoardDB.save_posts(posts)
    content = json.dumps({})
    response = make_response(content, 200, {
                             'Content-Type': 'application/json', 'Access-Control-Allow-Credentials': 'true'})
    return response


@app.route("/getPosts", methods=['POST'])
def get_posts():
    '''Get posts when logging in, if any.'''
    posts = VirtualBoardDB.get_posts()
    print(jsonify(posts))

    content = json.dumps({'posts': posts})
    response = make_response(content, 200, {
                             'Content-Type': 'application/json', 'Access-Control-Allow-Credentials': 'true'})
    return response


if (__name__ == "__main__"):
    app.run()
