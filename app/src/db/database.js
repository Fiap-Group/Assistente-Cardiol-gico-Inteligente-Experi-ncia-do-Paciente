import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'assistente_cardiologico.db';

let dbInstance = null;

async function getDatabase() {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync(DATABASE_NAME);
  }
  return dbInstance;
}

export async function initDatabase() {
  const db = await getDatabase();
  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS sessoes_chat (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      criado_em TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS mensagens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sessao_id INTEGER NOT NULL,
      autor TEXT NOT NULL,
      texto TEXT NOT NULL,
      criado_em TEXT NOT NULL,
      FOREIGN KEY (sessao_id) REFERENCES sessoes_chat(id)
    );
  `);
}

// Retorna a sessão de chat mais recente, ou cria uma nova se ainda não
// existir nenhuma. O app tem uma única conversa contínua com o assistente.
export async function obterSessaoAtual() {
  const db = await getDatabase();
  const sessaoExistente = await db.getFirstAsync(
    'SELECT id FROM sessoes_chat ORDER BY id DESC LIMIT 1'
  );

  if (sessaoExistente) {
    return sessaoExistente.id;
  }

  const resultado = await db.runAsync(
    'INSERT INTO sessoes_chat (criado_em) VALUES (?)',
    [new Date().toISOString()]
  );
  return resultado.lastInsertRowId;
}

export async function salvarMensagem(sessaoId, autor, texto) {
  const db = await getDatabase();
  await db.runAsync(
    'INSERT INTO mensagens (sessao_id, autor, texto, criado_em) VALUES (?, ?, ?, ?)',
    [sessaoId, autor, texto, new Date().toISOString()]
  );
}

export async function buscarMensagens(sessaoId) {
  const db = await getDatabase();
  return db.getAllAsync(
    'SELECT id, autor, texto, criado_em FROM mensagens WHERE sessao_id = ? ORDER BY id ASC',
    [sessaoId]
  );
}
