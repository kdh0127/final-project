from flask import Blueprint, request, jsonify
from qa_model import create_qa_chain
import os

qa_blueprint = Blueprint('qa', __name__)

pdf_path = os.getenv('PDF_PATH', '꿀벌질병.pdf')
qa_chain = create_qa_chain(pdf_path)

@qa_blueprint.route('/ask', methods=['POST'])
def ask_question():
    query = request.json.get("query")
    if not query:
        return jsonify({'error': 'Query is required'}), 400
    try:
        response = qa_chain(query)
        return jsonify({'response': str(response)})
    except Exception as e:
        return jsonify({'error': f'Error occurred: {str(e)}'}), 500
