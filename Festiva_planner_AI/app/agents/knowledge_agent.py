from app.rag import query_rag

def get_event_advice(user_text):
    return query_rag(user_text)