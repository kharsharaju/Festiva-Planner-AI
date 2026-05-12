import pandas as pd
import pickle

def get_budget_split(budget, guests, duration):
    with open("models/budget_model.pkl", "rb") as f:
        model = pickle.load(f)

    input_data = pd.DataFrame(
        [[budget, guests, duration]],
        columns=["budget", "guests", "event_duration_days"]
    )

    prediction = model.predict(input_data)[0]

    return {
        "catering": round(float(prediction[0]), 2),
        "decoration": round(float(prediction[1]), 2),
        "venue": round(float(prediction[2]), 2),
        "entertainment": round(float(prediction[3]), 2)
    }