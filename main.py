from flask import Flask, request
from flask_cors import CORS
from youtube_transcript_api import YouTubeTranscriptApi

# run server:
# export FLASK_APP=main.py && flask run --host 0.0.0.0

app = Flask(__name__)
cors = CORS(app)


@app.route('/', methods=['GET'])
def check():
    return {
        'response': '200 Success'
    }

@app.route('/getcaptions', methods=['POST'])
def getcaptions():
    request_data = request.get_json()
    yt_id = request_data['yt_id']
    result = YouTubeTranscriptApi.get_transcript(yt_id, languages=[ 'en'])
    return {
        'response': result
    }

if __name__ == '__main__':
    # app.run()
    app.run(debug=True)