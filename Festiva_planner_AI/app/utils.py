import pandas as pd

def load_data():
    events = pd.read_csv("data/events.csv")
    vendors = pd.read_csv("data/vendors.csv")
    
    print("Events Data:\n", events.head())
    print("\nVendors Data:\n", vendors.head())

if __name__ == "__main__":
    load_data()