"""
=============================================================================
API REST · Assistente Cardiológico
=============================================================================
Repassa mensagens do app React Native para o IBM Watson Assistant e devolve
a resposta gerada pelo assistant configurado no IBM Cloud.

Execução:
    cp .env.example .env   # preencher credenciais do Watson (ver README)
    pip install -r requirements.txt
    python api.py

Sem credenciais configuradas, a API sobe automaticamente em modo simulado
(mock) — ver watson_client.py — permitindo testar o app antes de ter a
instância do Watson Assistant criada.

Endpoints:
    GET  /api/health -> status da API e modo de operação (watson | mock)
    POST /api/chat    -> { "sessao_id": ..., "mensagem": "..." } -> { "resposta": "..." }
=============================================================================
"""

import os

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS

from watson_client import WatsonAssistantClient, FakeWatsonAssistantClient

load_dotenv()

app = Flask(__name__)
CORS(app)

_client = None


def get_client():
    global _client
    if _client is None:
        usar_mock = os.getenv("WATSON_MOCK", "false").lower() == "true"
        api_key = os.getenv("WATSON_API_KEY")
        url = os.getenv("WATSON_URL")
        assistant_id = os.getenv("WATSON_ASSISTANT_ID")
        version = os.getenv("WATSON_VERSION", "2021-11-27")

        if usar_mock or not (api_key and url and assistant_id):
            _client = FakeWatsonAssistantClient()
        else:
            _client = WatsonAssistantClient(api_key, url, assistant_id, version)
    return _client


@app.route("/api/health", methods=["GET"])
def health():
    modo = "mock" if isinstance(get_client(), FakeWatsonAssistantClient) else "watson"
    return jsonify({"status": "ok", "modo": modo}), 200


@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json(silent=True) or {}
    sessao_id = data.get("sessao_id")
    mensagem = (data.get("mensagem") or "").strip()

    if not sessao_id:
        return jsonify({"error": "Campo 'sessao_id' é obrigatório"}), 400
    if not mensagem:
        return jsonify({"error": "Campo 'mensagem' é obrigatório"}), 400

    try:
        resposta = get_client().enviar_mensagem(str(sessao_id), mensagem)
    except Exception as erro:
        return jsonify({"error": "Falha ao consultar o Watson Assistant", "details": str(erro)}), 502

    return jsonify({"resposta": resposta}), 200


if __name__ == "__main__":
    debug_mode = os.getenv("FLASK_ENV") == "development"
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "5000")), debug=debug_mode)
