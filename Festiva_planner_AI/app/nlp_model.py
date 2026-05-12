import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import pickle

# -----------------------------------
# TRAINING DATA
# -----------------------------------

texts = [

    # Wedding
    "plan a wedding",
    "organize marriage function",
    "destination wedding planning",
    "royal wedding ceremony",
    "wedding reception event",

    # Birthday
    "birthday party planning",
    "kids birthday celebration",
    "birthday bash event",
    "surprise birthday party",
    "outdoor birthday celebration",

    # Corporate
    "corporate office event",
    "business meeting event",
    "tech meetup planning",
    "annual business summit",
    "employee engagement event",

    # Concert
    "live music concert",
    "dj night event",
    "rock concert planning",
    "edm music festival",
    "youth concert fest",

    # Engagement
    "engagement ceremony",
    "ring ceremony function",
    "couple engagement party",
    "family engagement event",
    "grand engagement night",

    # Baby Shower
    "baby shower planning",
    "traditional baby shower",
    "baby welcome ceremony",
    "themed baby shower",
    "family baby celebration",

    # Farewell
    "college farewell party",
    "team goodbye event",
    "graduation farewell night",
    "school farewell celebration",
    "corporate farewell function",

    # College Fest
    "college cultural fest",
    "technical symposium event",
    "annual college fest",
    "youth talent festival",
    "ai innovation fest",

    # Anniversary
    "silver anniversary celebration",
    "golden anniversary event",
    "couple anniversary dinner",
    "family anniversary gathering",
    "premium anniversary party",

    # Housewarming
    "housewarming ceremony",
    "gruhapravesha function",
    "new home celebration",
    "villa housewarming event",
    "apartment housewarming party"
]

labels = [

    # Wedding
    "wedding",
    "wedding",
    "wedding",
    "wedding",
    "wedding",

    # Birthday
    "birthday",
    "birthday",
    "birthday",
    "birthday",
    "birthday",

    # Corporate
    "corporate",
    "corporate",
    "corporate",
    "corporate",
    "corporate",

    # Concert
    "concert",
    "concert",
    "concert",
    "concert",
    "concert",

    # Engagement
    "engagement",
    "engagement",
    "engagement",
    "engagement",
    "engagement",

    # Baby Shower
    "baby shower",
    "baby shower",
    "baby shower",
    "baby shower",
    "baby shower",

    # Farewell
    "farewell",
    "farewell",
    "farewell",
    "farewell",
    "farewell",

    # College Fest
    "college fest",
    "college fest",
    "college fest",
    "college fest",
    "college fest",

    # Anniversary
    "anniversary",
    "anniversary",
    "anniversary",
    "anniversary",
    "anniversary",

    # Housewarming
    "housewarming",
    "housewarming",
    "housewarming",
    "housewarming",
    "housewarming"
]

# -----------------------------------
# DATAFRAME
# -----------------------------------

df = pd.DataFrame({
    "text": texts,
    "label": labels
})

# -----------------------------------
# TF-IDF VECTORIZATION
# -----------------------------------

vectorizer = TfidfVectorizer()

X = vectorizer.fit_transform(df["text"])
y = df["label"]

# -----------------------------------
# MODEL TRAINING
# -----------------------------------

model = LogisticRegression()

model.fit(X, y)

# -----------------------------------
# SAVE MODEL
# -----------------------------------

with open("models/nlp_model.pkl", "wb") as f:
    pickle.dump(model, f)

with open("models/vectorizer.pkl", "wb") as f:
    pickle.dump(vectorizer, f)

print("✅ NLP model trained successfully")

# -----------------------------------
# PREDICTION FUNCTION
# -----------------------------------

def predict_event_type(text):

    with open("models/nlp_model.pkl", "rb") as f:
        model = pickle.load(f)

    with open("models/vectorizer.pkl", "rb") as f:
        vectorizer = pickle.load(f)

    X = vectorizer.transform([text])

    prediction = model.predict(X)[0]

    return prediction