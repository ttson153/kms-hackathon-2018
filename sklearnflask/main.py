import sys
import os
import shutil
import time
import traceback
import json
from flask import Flask, request, jsonify
import pandas as pd
from sklearn.externals import joblib
from flask_cors import CORS, cross_origin
app = Flask(__name__)
cors = CORS(app)
# app.config['CORS_HEADERS/'] = 'Content-Type'

model_directory = 'model'
# model_file_name = '%s/model.pkl' % model_directory
model_file_name = '../model/train.dat'
model_columns_file_name = '%s/model_columns.pkl' % model_directory

# These will be populated at training time
model_columns = None
clf = None

from nltk.corpus import stopwords  # Import the stop word list
import re
from bs4 import BeautifulSoup
from sklearn.feature_extraction.text import CountVectorizer


def job_to_words(raw_job, lang="english"):
    # Function to convert a raw job posting to a string of words
    # The input is a single string (a raw job description), and
    # the output is a single string (a preprocessed job description)
    #
    # 1. Remove HTML
    job_text = BeautifulSoup(raw_job, "lxml").get_text()
    #
    # 1. Remove non-letters
    letters_only = re.sub(
        u"[^a-zA-ZàáãạảăắằẳẵặâấầẩẫậèéẹẻẽêềếểễệđìíĩỉịòóõọỏôốồổỗộơớờởỡợùúũụủưứừửữựỳỵỷỹýÀÁÃẠẢĂẮẰẲẴẶÂẤẦẨẪẬÈÉẸẺẼÊỀẾỂỄỆĐÌÍĨỈỊÒÓÕỌỎÔỐỒỔỖỘƠỚỜỞỠỢÙÚŨỤỦƯỨỪỬỮỰỲỴỶỸÝ]",
        " ", job_text)
    #
    # 2. Convert to lower case, split into individual words
    words = letters_only.lower().split()
    #
    # 3. In Python, searching a set is much faster than searching
    #   a list, so convert the stop words to a set
    stops = set(stopwords.words(lang))
    #
    # 4. Remove stop words
    meaningful_words = [w for w in words if not w in stops]
    #
    # 5. Join the words back into one string separated by space,
    # and return the result.
    return (" ".join(meaningful_words))


def vectorize(clean_train_jobs):
    # Initialize the "CountVectorizer" object, which is scikit-learn's
    # bag of words tool.
    vectorizer1 = CountVectorizer(analyzer="word", \
                                  tokenizer=None, \
                                  preprocessor=None, \
                                  stop_words=None, \
                                  max_features=2000,
                                  ngram_range=(1, 4))

    # fit_transform() does two functions: First, it fits the model
    # and learns the vocabulary; second, it transforms our training data
    # into feature vectors. The input to fit_transform should be a list of
    # strings.
    train_data_features = vectorizer1.fit_transform(clean_train_jobs)

    # Numpy arrays are easy to work with, so convert the result to an
    # array
    train_data_features = train_data_features.toarray()
    return train_data_features

@app.route('/predict1', methods=['POST'])
def predict():
    if clf:
        try:
            json_ = request.json
            query = pd.get_dummies(pd.DataFrame(json_))
            # https://github.com/amirziai/sklearnflask/issues/3
            # Thanks to @lorenzori
            query = query.reindex(columns=model_columns, fill_value=0)

            prediction = list(clf.predict(query))

            return jsonify({'prediction': prediction})

        except Exception as e:

            return jsonify({'error': str(e), 'trace': traceback.format_exc()})
    else:
        print('train first')
        return 'no model here'

@app.route('/predict', methods=['POST'])
def clf_predict():
    if clf:
        try:
            print(request.json)
            my_json = json.loads(request.data.decode('utf8'))
            print(my_json)
            w = job_to_words(my_json['description'])
            v = vectorize([w])
            prediction = list(clf.predict(v))
            print(predict)
            return jsonify({'prediction': prediction})
        except Exception as e:
            return jsonify({'error': str(e), 'trace': traceback.format_exc()})
    else:
        print('train first')
        return 'no model here'


if __name__ == '__main__':
    try:
        port = int(sys.argv[1])
    except Exception as e:
        port = 80

    try:
        clf = joblib.load(model_file_name)
        # print 'model loaded'
        model_columns = joblib.load(model_columns_file_name)
        # print 'model columns loaded'

    except Exception as e:
        # print 'No model here'
        # print 'Train first'
        # print str(e)
        clf = None

    app.run(host='0.0.0.0', port=port, debug=True)
