from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

# -----------------------------
# KNOWLEDGE BASE (can expand)
# -----------------------------

documents = [
    "Wedding planning involves venue booking, catering, decoration, and guest management.",
    "Corporate events require agenda planning, speaker coordination, and logistics.",
    "Birthday parties need decoration, cake, entertainment, and guest invitations.",
    "For weddings, budgeting and vendor selection are very important.",
    "Corporate events should focus on professionalism and scheduling.",
    "Birthday events are more flexible and fun-oriented."
]

# -----------------------------
# LOAD EMBEDDING MODEL
# -----------------------------

model = SentenceTransformer("all-MiniLM-L6-v2")

# -----------------------------
# CREATE EMBEDDINGS
# -----------------------------

doc_embeddings = model.encode(documents)

# -----------------------------
# CREATE FAISS INDEX
# -----------------------------

dimension = doc_embeddings.shape[1]
index = faiss.IndexFlatL2(dimension)
index.add(np.array(doc_embeddings))

# -----------------------------
# QUERY FUNCTION
# -----------------------------

def query_rag(query):
    query_embedding = model.encode([query])
    distances, indices = index.search(query_embedding, k=1)

    result = documents[indices[0][0]]
    return result