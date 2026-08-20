"""
=============================================================================
API REST · Genera Intelligence — Challenge Dasa/Genera Sprint 3
=============================================================================
Expõe o pipeline RAG real (rag_system.py) como uma API HTTP simples,
para ser consumida pelo app React Native (Dashboard/Riscos/Ancestralidade/
Análise), substituindo os stubs de resumoService.js e ChatBox.js.

Execução:
    export ANTHROPIC_API_KEY="sk-ant-..."   # ou OPENAI_API_KEY
    pip install -r requirements.txt
    python api.py

Endpoints:
    GET  /api/health   -> status da API e se já há paciente indexado
    POST /api/index     -> indexa o JSON genômico do paciente (formato da Sprint 1)
    POST /api/chat       -> { "question": "..." } -> resposta gerada via RAG
=============================================================================
"""

import os

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS

from rag_system import GenomicRAGPipeline

load_dotenv()

app = Flask(__name__)
CORS(app)

_pipeline: GenomicRAGPipeline | None = None
_patient_indexed = False


def get_pipeline() -> GenomicRAGPipeline:
    """Cria o pipeline RAG uma única vez (embeddings + LLM ficam em memória)."""
    global _pipeline
    if _pipeline is None:
        if os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY"):
            default_llm_backend = "gemini"
        elif os.getenv("ANTHROPIC_API_KEY"):
            default_llm_backend = "anthropic"
        else:
            default_llm_backend = "openai"
        config = {
            "embedding_backend": os.getenv("EMBEDDING_BACKEND", "sentence_transformers"),
            "embedding_model": os.getenv("EMBEDDING_MODEL"),
            "llm_backend": os.getenv("LLM_BACKEND", default_llm_backend),
            "llm_model": os.getenv("LLM_MODEL"),
            "top_k": int(os.getenv("RAG_TOP_K", "5")),
            "min_score": float(os.getenv("RAG_MIN_SCORE", "0.25")),
        }
        _pipeline = GenomicRAGPipeline.from_config(config)
    return _pipeline


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "paciente_indexado": _patient_indexed}), 200


@app.route("/api/index", methods=["POST"])
def index_patient():
    """Recebe o JSON genômico do paciente (formato da Sprint 1) e indexa no RAG."""
    global _patient_indexed

    genomic_json = request.get_json(silent=True)
    if not genomic_json:
        return jsonify({"error": "JSON do perfil genômico é obrigatório"}), 400

    try:
        pipeline = get_pipeline()
        n_chunks = pipeline.index_patient(genomic_json)
        _patient_indexed = True
    except Exception as e:
        return jsonify({"error": "Falha ao indexar perfil genômico", "details": str(e)}), 500

    return jsonify({"status": "indexed", "chunks": n_chunks}), 200


@app.route("/api/chat", methods=["POST"])
def chat():
    """Responde uma pergunta do paciente usando o pipeline RAG (retrieval + LLM)."""
    if not _patient_indexed:
        return jsonify({"error": "Nenhum perfil genômico indexado. Chame /api/index primeiro."}), 400

    data = request.get_json(silent=True) or {}
    question = (data.get("question") or "").strip()
    if not question:
        return jsonify({"error": "Campo 'question' é obrigatório"}), 400

    try:
        pipeline = get_pipeline()
        response = pipeline.answer(question)
    except Exception as e:
        return jsonify({"error": "Falha ao gerar resposta", "details": str(e)}), 500

    return jsonify({
        "answer": response.answer,
        "grounded": response.grounded,
        "sources": [
            {
                "section": rc.chunk.section,
                "subsection": rc.chunk.subsection,
                "text": rc.chunk.text,
                "score": rc.score,
            }
            for rc in response.retrieved_chunks
        ],
    }), 200


if __name__ == "__main__":
    debug_mode = os.getenv("FLASK_ENV") == "development"
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "5000")), debug=debug_mode)
