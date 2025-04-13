from flask import Flask, request, jsonify, render_template, session, redirect, url_for
import json
import os
from openai import OpenAI

app = Flask(__name__)
client = OpenAI()
app.secret_key = 'secret_key'

SCORES_FILE = 'scores.json'

def load_scores():
    if os.path.exists(SCORES_FILE):
        with open(SCORES_FILE, 'r') as file:
            return json.load(file)
    return {}

def save_scores(scores):
    with open(SCORES_FILE, 'w') as file:
        json.dump(scores, file)

def generate_question(genre):
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": f"You are a professional quiz master. Generate one trivia question in the genre of {genre} to the user. Don't provide the answer. Make it engaging using interesting facts about the answer as clues in the form of a story that doesn't directly point to the answer. Clues can be related to a different genre or topic such that questions get more interesting."},
            {"role": "user", "content": "Generate a trivia question"}
        ]
    )
    return response.choices[0].message.content

def evaluate_answer(question, user_answer):
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are evaluating a trivia answer. You are supposed to ignore spelling mistakes and accept answers that are close enough. Respond with either 'PASS' or 'FAIL' followed by a brief explanation. Also, provide the correct answer."},
            {"role": "user", "content": f"Question: {question}\nUser's answer: {user_answer}\nEvaluate if this answer is correct and provide the correct answer."}
        ]
    )
    return response.choices[0].message.content

@app.route('/')
def index():
    if 'username' in session:
        return render_template('index.html', username=session['username'])
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        session['username'] = username
        return redirect(url_for('index'))
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('login'))

@app.route('/get-question', methods=['POST'])
def get_question():
    try:
        data = request.json
        genre = data.get('genre')
        
        if not genre:
            return jsonify({'error': 'Genre is required'}), 400
        
        question = generate_question(genre)
        return jsonify({'question': question})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/submit-answer', methods=['POST'])
def submit_answer():
    try:
        data = request.json
        question = data.get('question')
        answer = data.get('answer')
        
        if not question or not answer:
            return jsonify({'error': 'Question and answer are required'}), 400
        
        evaluation = evaluate_answer(question, answer)
        correct_answer = evaluation.split('Correct answer: ')[-1]
        
        scores = load_scores()
        username = session['username']
        if username not in scores:
            scores[username] = {'correct': 0, 'total': 0}
        
        if 'PASS' in evaluation:
            scores[username]['correct'] += 1
        scores[username]['total'] += 1
        
        save_scores(scores)
        
        return jsonify({'evaluation': evaluation, 'correct_answer': correct_answer})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/score')
def score():
    if 'username' in session:
        scores = load_scores()
        username = session['username']
        user_score = scores.get(username, {'correct': 0, 'total': 0})
        return jsonify(user_score)
    return jsonify({'error': 'User not logged in'}), 400

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')