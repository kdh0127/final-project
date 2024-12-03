from flask import Blueprint, jsonify

cors_blueprint = Blueprint('cors', __name__)

@cors_blueprint.route('/preflight', methods=['OPTIONS'])
def preflight():
    response = jsonify({'message': 'CORS preflight'})
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type")
    response.headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    response.headers.add("Access-Control-Allow-Credentials", "true")
    return response
