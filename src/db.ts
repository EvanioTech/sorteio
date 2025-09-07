import { openDatabaseSync, type SQLiteDatabase } from "expo-sqlite";

export const db: SQLiteDatabase = openDatabaseSync("app.db");

// Criar tabelas e garantir usuário admin
export const initDB = async () => {
  await db.execAsync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL UNIQUE,
      senha TEXT
    );

    CREATE TABLE IF NOT EXISTS sorteios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tipo TEXT NOT NULL,        -- "nome" ou "numero"
      valor TEXT NOT NULL,       -- pode ser nome ou número em texto
      userId INTEGER,
      FOREIGN KEY(userId) REFERENCES users(id)
    );
  `);

  // Garante que o admin exista
  const admin = await getFirstAsync<{ id: number }>(
    `SELECT id FROM users WHERE nome = ?`,
    ["admin"]
  );

  if (!admin) {
    await insertUser("admin", "admin");
    console.log("Usuário admin criado com sucesso.");
  }
};

// ---- Helpers ----
export const runAsync = async (sql: string, params: any[] = []) => {
  return db.runAsync(sql, params);
};

export const getAllAsync = async <T = any>(
  sql: string,
  params: any[] = []
): Promise<T[]> => {
  const result = await db.getAllAsync<T>(sql, params);
  return result;
};

export const getFirstAsync = async <T = any>(
  sql: string,
  params: any[] = []
): Promise<T | null> => {
  const result = await db.getFirstAsync<T>(sql, params);
  return result ?? null;
};

// ---- Função dedicada para salvar usuário ----
export const insertUser = async (nome: string, senha: string) => {
  const result = await db.runAsync(
    `INSERT INTO users (nome, senha) VALUES (?, ?)`,
    [nome, senha]
  );
  return result.changes ?? 0;
};
