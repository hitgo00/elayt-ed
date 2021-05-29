from flask import Flask, request
from flask_cors import CORS
from youtube_transcript_api import YouTubeTranscriptApi, TooManyRequests, CouldNotRetrieveTranscript, TranscriptsDisabled

# run server:
# export FLASK_APP=main.py && flask run --host 0.0.0.0

app = Flask(__name__)
cors = CORS(app)


def insert_metadata(transcript, yt_id, notion):
    for doc in transcript:
        doc['notion_url'] = notion
        doc['yt_id'] = yt_id
    return transcript


@app.route('/', methods=['GET'])
def check():
    return {
        'response': '200 Success'
    }


@app.route('/getcaptions', methods=['POST'])
def getcaptions():
    request_data = request.get_json()
    yt_ids = request_data['yt_ids']
    notion = str(request_data['notion'])
    # print('printing: ', yt_id, notion)

    result_list = []
    for yt_id in yt_ids:
        result = []
        try:
            transcript_list = YouTubeTranscriptApi.list_transcripts(yt_id)
            result = transcript_list.find_transcript(['en']).fetch()
            result = insert_metadata(result, yt_id, notion)
            for r in result:
                result_list.append(r)
        except TooManyRequests:
            result = "TooManyRequests"
            print(result)
        except TranscriptsDisabled:
            result = "TranscriptsDisabled"
            print(result)
        except CouldNotRetrieveTranscript:
            result = "CouldNotRetrieveTranscript"
            print(result)

    return {
        'response': result_list
    }


if __name__ == '__main__':
    # app.run()
    app.run(debug=True)
