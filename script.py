from youtube_transcript_api import YouTubeTranscriptApi

video_id='n6q9TTZD3mA'


print(YouTubeTranscriptApi.get_transcripts(["n2RNcPRtAiY","eY9dXcjkVx8" ], languages=[ 'en']))