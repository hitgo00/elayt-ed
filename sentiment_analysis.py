import re
from textblob import TextBlob
import nltk
from nltk import tokenize
from nltk.corpus import stopwords
nltk.download('stopwords')


def sentiment_analysis(text):
  
  pos_sentences = 0
  neg_sentences = 0
  neutral_sentences = 0
  text = tokenize.sent_tokenize(text)

  for sent in text:
    sent = re.sub(r'[^A-Za-z0-9]+', ' ', sent)
    analysis = TextBlob(sent)
    if analysis.sentiment.polarity > 0:
      pos_sentences = pos_sentences + 1
    elif analysis.sentiment.polarity == 0:
      neutral_sentences = neutral_sentences + 1
    else:
      neg_sentences = neg_sentences + 1
  
  total_sentences = pos_sentences + neg_sentences + neutral_sentences
  pos_perc = (pos_sentences / total_sentences)*100
  neutral_perc = (neutral_sentences / total_sentences)*100
  neg_perc = (neg_sentences / total_sentences)*100
  #return total_sentences
  pos_perc = round(pos_perc,2)
  neutral_perc = round(neutral_perc,2)
  neg_perc = round(neg_perc,2)
  return (pos_perc,neutral_perc,neg_perc)

#text = "First of all, Mahatma Gandhi was a notable public figure. His role in social and political reform was instrumental. Above all, he rid the society of these social evils. Hence, many oppressed people felt great relief because of his efforts. Gandhi became a famous international figure because of these efforts. Furthermore, he became the topic of discussion in many international media outlets. Mahatma Gandhi’s philosophy of non-violence is probably his most important contribution. This philosophy of non-violence is known as Ahimsa. Most noteworthy, Gandhiji’s aim was to seek independence without violence. He decided to quit the Non-cooperation movement after the Chauri-Chaura incident. This was due to the violence at the Chauri Chaura incident. Consequently, many became upset at this decision. However, Gandhi was relentless in his philosophy of Ahimsa."

#(pos_perc,neutral_perc,neg_perc) = sentiment_analysis(text)
#print(pos_perc)
#print(neutral_perc)
#print(neg_perc)