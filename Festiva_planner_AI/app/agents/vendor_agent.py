import pandas as pd

def load_vendors(city):
    df = pd.read_csv("data/vendors.csv")
    return df[df["city"].str.lower() == city.lower()]

def suggest_vendors(vendors_df, category, max_price):
    filtered = vendors_df[
        (vendors_df["category"] == category) &
        (vendors_df["price"] <= max_price) &
        (vendors_df["availability"] == "yes")
    ]

    if filtered.empty:
        fallback = vendors_df[
            (vendors_df["category"] == category) &
            (vendors_df["availability"] == "yes")
        ]

        if fallback.empty:
            return pd.DataFrame(columns=vendors_df.columns)

        return fallback.sort_values(by="rating", ascending=False).head(1)

    return filtered.sort_values(by="rating", ascending=False).head(2)

def get_all_vendors(city, budget_split):
    vendors = load_vendors(city)

    return {
        "catering": suggest_vendors(vendors, "catering", budget_split["catering"]).to_dict(orient="records"),
        "decoration": suggest_vendors(vendors, "decoration", budget_split["decoration"]).to_dict(orient="records"),
        "venue": suggest_vendors(vendors, "venue", budget_split["venue"]).to_dict(orient="records"),
        "entertainment": suggest_vendors(vendors, "entertainment", budget_split["entertainment"]).to_dict(orient="records")
    }