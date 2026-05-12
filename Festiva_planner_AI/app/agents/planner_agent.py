from app.nlp_model import predict_event_type
from app.agents.budget_agent import get_budget_split
from app.agents.knowledge_agent import get_event_advice
from app.agents.vendor_agent import get_all_vendors

def generate_timeline(event_type):
    if event_type == "wedding":
        return ["Book venue", "Hire caterer", "Decoration setup", "Event day"]
    elif event_type == "corporate":
        return ["Finalize agenda", "Book venue", "Arrange catering", "Event day"]
    else:
        return ["Plan activities", "Decorate venue", "Event day"]

def plan_event_with_agents(user_text, budget, guests, duration, city):
    # NLP Agent
    event_type = predict_event_type(user_text)

    # Budget Agent
    budget_split = get_budget_split(budget, guests, duration)

    # Knowledge Agent
    advice = get_event_advice(user_text)

    # Vendor Agent
    vendors = get_all_vendors(city, budget_split)

    # Planner Agent output
    return {
        "event_type": event_type,
        "budget": budget,
        "predicted_costs": budget_split,
        "timeline": generate_timeline(event_type),
        "vendors": vendors,
        "advice": advice
    }