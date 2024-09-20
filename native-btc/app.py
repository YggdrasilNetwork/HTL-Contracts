from flask import Flask, jsonify
from flask import Flask, jsonify, request
from main import transfer_tokens

app = Flask(__name__)

@app.route('/')
def hello():
    return jsonify(message='Hello, World!')

@app.route('/transfer_tokens', methods=['GET'])
def transfer_tokens_endpoint():
    recipient = request.args.get('recipient')
    try:
        amount = int(request.args.get('amount'))
    except ValueError:
        return jsonify(result='Invalid amount'), 400
    
    # Call the transfer_tokens function with the provided arguments
    result = transfer_tokens(recipient, amount)
    return jsonify(result=result)

if __name__ == '__main__':
    app.run()