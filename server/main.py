from flask import Flask, jsonify, request, abort
from flask_cors import CORS
import time

app = Flask(__name__)
CORS(app)

data = {'updated_at': int(time.time()), 'messages': []}

def updated(current_time):
    return current_time < data['updated_at']

@app.route('/')
def get_all_messages():
    global messages
    return jsonify(messages=data['messages'], updated_at=data['updated_at'])

@app.route('/poll')
def long_polling():
    global messages

    current_time = int(time.time())
    updated_at = int(request.args.get('u'))

    timeout = True
    while (int(time.time()) - current_time < 10):
        if updated(updated_at):
            timeout = False
            break

        time.sleep(0.5)
    
    if timeout:
        abort(502)

    return jsonify(messages=data['messages'], updated_at=data['updated_at'])

@app.route('/send', methods=['POST'])
def send_message():
    global messages

    body = request.json
    
    data['messages'].append(body)
    data['updated_at'] = body['updated_at']

    return jsonify(messages=data['messages'], updated_at=data['updated_at'])

if __name__ == '__main__':
    app.run(debug=True)