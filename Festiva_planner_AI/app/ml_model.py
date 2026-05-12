import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
import pickle

def train_model():
    # Load dataset
    df = pd.read_csv("data/events.csv")

    # Input features
    X = df[["budget", "guests", "event_duration_days"]]

    # Output targets
    y = df[["catering_cost", "decoration_cost", "venue_cost", "entertainment_cost"]]

    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # Train model
    model = LinearRegression()
    model.fit(X_train, y_train)

    # Save model
    with open("models/budget_model.pkl", "wb") as f:
        pickle.dump(model, f)

    print("Model trained and saved!")

def predict():
    # Load model
    with open("models/budget_model.pkl", "rb") as f:
        model = pickle.load(f)

    # Sample input
    sample = pd.DataFrame([[1000000, 200, 2]], columns=["budget", "guests", "event_duration_days"])

    prediction = model.predict(sample)

    print("\nPredicted Costs:")
    print("Catering, Decoration, Venue, Entertainment")
    rounded = [[round(float(value), 2) for value in row] for row in prediction]
    print(rounded)

if __name__ == "__main__":
    train_model()
    predict()