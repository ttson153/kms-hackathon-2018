# Flask API for scikit learn
A simple Flask application that can serve predictions from a scikit-learn model.

### Dependencies
- scikit-learn
- Flask
- pandas
- numpy

```
pip install -r requirements.txt
```

### Running API
```
python main.py <port>
```

# Endpoints
### /predict (POST)
Returns an array of predictions given a JSON object representing. Here's a sample input: