"""
rag_engine.py  —  ScholarMatch RAG Core
-----------------------------------------
Handles:
  1. Chunking all 25 scholarships into embeddable text pieces
  2. Embedding + storing them in ChromaDB (local, persistent on disk)
  3. Retrieving top-k relevant chunks for a given student query
"""

import os
from typing import Optional, List
from sentence_transformers import SentenceTransformer
import chromadb
from chromadb.config import Settings
from model import RAW_SCHOLARSHIPS

# ── Model & DB client (module-level singletons loaded once at startup) ─────────
_EMBED_MODEL_NAME = "all-MiniLM-L6-v2"   # ~80 MB, runs offline, no API key

_embed_model  = None   # type: Optional[SentenceTransformer]
_chroma_client = None  # type: Optional[chromadb.PersistentClient]
_collection    = None

CHROMA_PATH = os.path.join(os.path.dirname(__file__), "chroma_db")


def get_embed_model() -> SentenceTransformer:
    global _embed_model
    if _embed_model is None:
        print("🔄 Loading embedding model (first time ~10s) …")
        _embed_model = SentenceTransformer(_EMBED_MODEL_NAME)
        print("✅ Embedding model ready")
    return _embed_model


def get_collection():
    global _chroma_client, _collection
    if _collection is not None:
        return _collection

    _chroma_client = chromadb.PersistentClient(
        path=CHROMA_PATH,
        settings=Settings(anonymized_telemetry=False),
    )
    _collection = _chroma_client.get_or_create_collection(
        name="scholarships",
        metadata={"hnsw:space": "cosine"},
    )
    return _collection


# ── Chunking ───────────────────────────────────────────────────────────────────

def _build_chunks(s: dict) -> list[dict]:
    """
    Convert one scholarship dict into multiple focussed text chunks.
    Each chunk has: id, text, metadata (for filtering later).
    """
    sid = s["id"]
    base = f"{s['name']} offered by {s['provider']}"
    chunks = [
        {
            "cid":  f"{sid}_overview",
            "text": (
                f"{base}. Category: {s['category']}. "
                f"Amount: ₹{s['amount']:,} per year. "
                f"Deadline: {s['deadline']}."
            ),
        },
        {
            "cid":  f"{sid}_eligibility",
            "text": (
                f"{base}. Eligibility criteria: "
                + "; ".join(s["eligibility_criteria"]) + "."
            ),
        },
        {
            "cid":  f"{sid}_documents",
            "text": (
                f"{base}. Required documents: "
                + ", ".join(s["documents_required"]) + "."
            ),
        },
        {
            "cid":  f"{sid}_category",
            "text": (
                f"{base} is a {s['category']} scholarship targeting "
                f"{'female students' if s.get('gender_pref') == 'Female' else 'all genders'}. "
                f"{'Caste preference: ' + '/'.join(s['caste_pref']) + '.' if s.get('caste_pref') else 'Open to all categories.'} "
                f"{'Region preference: ' + s['region_pref'] + '.' if s.get('region_pref') else ''}"
            ),
        },
    ]
    # Add metadata to each chunk
    for c in chunks:
        c["meta"] = {
            "scholarship_id": sid,
            "category":       s["category"],
            "amount":         s["amount"],
            "gender_pref":    s.get("gender_pref") or "any",
            "caste_pref":     ",".join(s.get("caste_pref") or ["any"]),
            "region_pref":    s.get("region_pref") or "any",
        }
    return chunks


# ── Initialise vector store ────────────────────────────────────────────────────

def initialize_rag() -> None:
    """
    Called once at FastAPI startup.
    Embeds all scholarship chunks and stores them in ChromaDB.
    If the collection already has data, skips re-embedding (uses disk cache).
    """
    col = get_collection()

    if col.count() > 0:
        print(f"✅ ChromaDB ready: {col.count()} scholarship chunks loaded from cache")
        return

    print("🔄 Building scholarship vector store (first run) …")
    model = get_embed_model()

    all_chunks: list[dict] = []
    for s in RAW_SCHOLARSHIPS:
        all_chunks.extend(_build_chunks(s))

    texts     = [c["text"] for c in all_chunks]
    ids       = [c["cid"]  for c in all_chunks]
    metadatas = [c["meta"] for c in all_chunks]

    embeddings = model.encode(texts, show_progress_bar=False).tolist()

    col.add(
        documents=texts,
        embeddings=embeddings,
        ids=ids,
        metadatas=metadatas,
    )
    print(f"✅ ChromaDB ready: {len(all_chunks)} chunks embedded for {len(RAW_SCHOLARSHIPS)} scholarships")


# ── Retrieval ──────────────────────────────────────────────────────────────────

def retrieve_chunks(query: str, k: int = 6) -> List[str]:
    """
    Embed 'query' and return the top-k most relevant scholarship chunks.
    Returns a list of raw text strings ready to be injected into LLM prompt.
    """
    col   = get_collection()
    model = get_embed_model()

    q_embedding = model.encode([query]).tolist()
    results = col.query(query_embeddings=q_embedding, n_results=min(k, col.count()))

    docs = results.get("documents", [[]])[0]
    return docs
