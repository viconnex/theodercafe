import json
import os

from flask import Flask
from flask import request
from flask_cors import CORS


from nlp import word_similarity

app = Flask(__name__)

CORS(app)

@app.route('/')
def hello():
    return "Hello World!"

@app.route('/name/<name>')
def hello_name(name):
    return "Hello {}!".format(name)

@app.route('/fakesimilarity')
def return_random_float():
    return str(0.2)


@app.route('/similaritya', methods=['GET', 'POST'])
def similarity():
    if request.method == 'POST':  #this block is only entered when the form is submitted
        word1 = request.form.get('word1')
        word2 = request.form['word2']
        similarity_words = word_similarity.similarity(word1, word2)

        return '''<h1>The firstword value is: {}</h1>
                  <h1>The secondword value is: {}</h1>
                  <h1>Similarity is: {}</h1>
                  '''.format(word1, word2, similarity_words)

    return '''<form method="POST">
                  Firstword: <input type="text" name="word1"><br>
                  Secondword: <input type="text" name="word2"><br>
                  <input type="submit" value="Submit"><br>
              </form>'''


@app.route('/word_music_sheet', methods=['POST']) #GET requests will be blocked
def similarity_word_listchords():
    req_data = request.get_json()

    word = req_data['word']
    list_chords = req_data['chords']
    word_similarity.compute_similarity_word_listchords(
        word,
        list_chords
    )
    print("== word: %s" % word)
    for chord in list_chords:
        print(chord)
    return json.dumps(list_chords)


def get_parser():
    import argparse
    parser = argparse.ArgumentParser(description="Do something.")
    parser.add_argument('--fname', type=str, default="resources/cc.fr.300.bin")
    parser.add_argument('--limit', type=int, default=500000)
    return parser


def main():
    parser = get_parser()
    args = parser.parse_args()
    word_similarity.init_wordembedder(
        fname=args.fname,
        limit=args.limit)
    simpremiermot = word_similarity.similarity("premier", "mot")
    print("simpremiermot: %s" % simpremiermot)


if __name__ == '__main__':
    if os.environ.get('WERKZEUG_RUN_MAIN') == 'true':
        main()
    app.run(debug=True, port=5000)
