"""
Testes do backend Flask, rodando sempre em modo simulado (WATSON_MOCK=true)
para não depender de credenciais reais do Watson Assistant.

Rodar com: pytest test_api.py
"""

import os

os.environ["WATSON_MOCK"] = "true"

from api import app  # noqa: E402  (precisa vir depois do os.environ acima)


def test_health_modo_mock():
    cliente = app.test_client()
    resposta = cliente.get("/api/health")
    assert resposta.status_code == 200
    assert resposta.get_json()["modo"] == "mock"


def test_chat_retorna_resposta_simulada():
    cliente = app.test_client()
    resposta = cliente.post("/api/chat", json={"sessao_id": 1, "mensagem": "olá"})
    assert resposta.status_code == 200
    assert "resposta" in resposta.get_json()


def test_chat_exige_mensagem():
    cliente = app.test_client()
    resposta = cliente.post("/api/chat", json={"sessao_id": 1, "mensagem": ""})
    assert resposta.status_code == 400


def test_chat_exige_sessao_id():
    cliente = app.test_client()
    resposta = cliente.post("/api/chat", json={"mensagem": "olá"})
    assert resposta.status_code == 400
