"""
=============================================================================
Observabilidade — logs estruturados e métricas em memória
=============================================================================
Registra eventos da operação (indexação, perguntas respondidas, erros) em
JSON, um evento por linha, em `logs/app.log` (com rotação) e no console.

Regra de privacidade (ver docs/POLITICA_GOVERNANCA_IA.md): o texto das
perguntas e o conteúdo do relatório NUNCA entram no log. Registra-se só um
hash curto da pergunta, o tamanho, a seção recuperada e métricas técnicas.
=============================================================================
"""

import hashlib
import json
import logging
import os
import threading
import time
from collections import deque
from logging.handlers import RotatingFileHandler

PASTA_LOGS = os.path.join(os.path.dirname(os.path.abspath(__file__)), "logs")
ARQUIVO_LOG = os.path.join(PASTA_LOGS, "app.log")


class FormatadorJSON(logging.Formatter):
    def format(self, registro):
        evento = {
            "ts": time.strftime("%Y-%m-%dT%H:%M:%S", time.localtime(registro.created)),
            "nivel": registro.levelname,
            "logger": registro.name,
            "mensagem": registro.getMessage(),
        }
        # Campos extras passados via `extra={...}` nas chamadas de log.
        for chave in ("evento", "pergunta_hash", "pergunta_chars", "secoes",
                      "grounded", "latencia_ms", "chunks", "erro_tipo"):
            if hasattr(registro, chave):
                evento[chave] = getattr(registro, chave)
        return json.dumps(evento, ensure_ascii=False)


def configurar_logs():
    os.makedirs(PASTA_LOGS, exist_ok=True)
    raiz = logging.getLogger()
    raiz.setLevel(logging.INFO)
    if getattr(raiz, "_observabilidade_ok", False):
        return
    arquivo = RotatingFileHandler(ARQUIVO_LOG, maxBytes=5_000_000, backupCount=3, encoding="utf-8")
    arquivo.setFormatter(FormatadorJSON())
    console = logging.StreamHandler()
    console.setFormatter(FormatadorJSON())
    raiz.addHandler(arquivo)
    raiz.addHandler(console)
    raiz._observabilidade_ok = True


def hash_pergunta(texto: str) -> str:
    """Identificador curto e não reversível de uma pergunta (para correlacionar logs)."""
    return hashlib.sha256(texto.encode("utf-8")).hexdigest()[:12]


class Metricas:
    """Contadores e latências em memória. Zeram ao reiniciar o backend."""

    def __init__(self, tamanho_janela: int = 500):
        self._lock = threading.Lock()
        self.iniciado_em = time.time()
        self.contadores = {
            "indexacoes": 0,
            "perguntas": 0,
            "erros_pergunta": 0,
            "respostas_sem_ancoragem": 0,
            "resets": 0,
        }
        self.latencias_ms = deque(maxlen=tamanho_janela)
        self.ultimo_erro = None

    def incrementar(self, nome: str):
        with self._lock:
            self.contadores[nome] = self.contadores.get(nome, 0) + 1

    def registrar_latencia(self, ms: float):
        with self._lock:
            self.latencias_ms.append(ms)

    def registrar_erro(self, mensagem: str):
        with self._lock:
            self.ultimo_erro = {"em": time.strftime("%Y-%m-%dT%H:%M:%S"), "mensagem": mensagem}

    def resumo(self) -> dict:
        with self._lock:
            ordenadas = sorted(self.latencias_ms)
            def percentil(p):
                if not ordenadas:
                    return None
                return round(ordenadas[min(len(ordenadas) - 1, int(p * len(ordenadas)))], 1)
            return {
                "uptime_s": round(time.time() - self.iniciado_em),
                "contadores": dict(self.contadores),
                "latencia_ms": {"p50": percentil(0.50), "p95": percentil(0.95), "amostras": len(ordenadas)},
                "ultimo_erro": self.ultimo_erro,
            }


metricas = Metricas()
