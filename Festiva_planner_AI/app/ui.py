import streamlit as st
import requests

# -----------------------------
# CONFIG
# -----------------------------
st.set_page_config(page_title="Festiva Planner AI", layout="wide")

API_URL = "http://127.0.0.1:8000/plan-event"

# -----------------------------
# TITLE
# -----------------------------
st.title("🎉 Festiva Planner AI")
st.markdown("Plan your event intelligently using AI 🚀")

# -----------------------------
# INPUT SECTION
# -----------------------------
st.sidebar.header("📥 Enter Event Details")

user_text = st.sidebar.text_input(
    "Describe your event",
    "I want to plan a wedding in Bangalore"
)

budget = st.sidebar.number_input("Budget (₹)", value=1000000)
guests = st.sidebar.number_input("Number of Guests", value=200)
duration = st.sidebar.number_input("Duration (days)", value=2)
city = st.sidebar.text_input("City", "Bangalore")

# -----------------------------
# BUTTON
# -----------------------------
if st.button("🚀 Generate Plan"):

    payload = {
        "user_text": user_text,
        "budget": budget,
        "guests": guests,
        "duration": duration,
        "city": city
    }

    try:
        response = requests.post(API_URL, json=payload)

        if response.status_code == 200:
            data = response.json()

            st.success("✅ Plan Generated Successfully!")

            # Event Type
            st.subheader("📌 Event Type")
            st.write(f"**{data['event_type'].capitalize()}**")

            # Budget Breakdown
            st.subheader("💰 Budget Breakdown")
            for k, v in data["predicted_costs"].items():
                st.write(f"🔹 {k.capitalize()}: ₹{v}")

            # Timeline
            st.subheader("📅 Timeline")
            for step in data["timeline"]:
                st.write(f"✔ {step}")

            # Vendors
            st.subheader("🏢 Recommended Vendors")

            for category, vendors in data["vendors"].items():
                st.markdown(f"### 🔸 {category.capitalize()}")

                if len(vendors) == 0:
                    st.warning("No vendors available")
                else:
                    for v in vendors:
                        st.write(f"""
                        **{v['vendor_name']}**
                        - 💰 Price: ₹{v['price']}
                        - ⭐ Rating: {v['rating']}
                        - 📍 City: {v['city']}
                        - 📞 Contact: {v['contact']}
                        """)

            # ✅ Advice (NOW CORRECT PLACE)
            st.subheader("🧠 AI Advice")
            st.info(data["advice"])

        else:
            st.error("❌ API Error")

    except Exception as e:
        st.error(f"❌ Error: {e}")