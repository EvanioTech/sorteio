import { openDatabaseSync, type SQLiteDatabase } from "expo-sqlite";

export interface Sorteio {
  id: number;
  tipo: "nome" | "numero";
  valor: string;
  userId: number;
}

export interface HistoricoItem {
  id: number;
  tipo: "nome" | "numero";
  resultado: string;
  dataSorteio: string; // ISO string
  userId: number;
}

export const db: SQLiteDatabase = openDatabaseSync("app.db");

<<<<<<< HEAD
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

  const adminUser = await getFirstAsync<{ id: number }>(
    `SELECT id FROM users WHERE nome = ?`,
    ['admin']
  );

  // 3. Insere o usuário 'admin' se ele não for encontrado
  if (!adminUser) {
    console.log("Usuário 'admin' não encontrado. Inserindo usuário inicial...");
    await insertUser('admin', 'admin');
    console.log("Usuário 'admin' (senha: admin) criado com sucesso.");
  }

  
};

=======
>>>>>>> 2172d3a (projeto finalizado)
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
    
    -- NOVA TABELA PARA HISTÓRICO
    CREATE TABLE IF NOT EXISTS historico (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tipo TEXT NOT NULL,
      resultado TEXT NOT NULL,
      dataSorteio TEXT NOT NULL, 
      userId INTEGER,
      FOREIGN KEY(userId) REFERENCES users(id)
    );
  `);

  // Garante a criação do admin (lógica da iteração anterior)
  const adminExists = await getFirstAsync<{ id: number }>(
    "SELECT id FROM users WHERE nome = 'admin'"
  );

  if (!adminExists) {
    await runAsync(
      "INSERT INTO users (nome, senha) VALUES (?, ?)",
      ["admin", "123"] 
    );
  }
};

// ---- Função dedicada para salvar usuário ----
export const insertUser = async (nome: string, senha: string) => {
  const result = await db.runAsync(
    `INSERT INTO users (nome, senha) VALUES (?, ?)`,
    [nome, senha]
  );
  return result.changes ?? 0;
};

/** Busca um usuário pelo nome. */
export const getUserByNome = async <T = any>(nome: string): Promise<T | null> => {
  return getFirstAsync<T>("SELECT * FROM users WHERE nome = ?", [nome]);
};

/** Busca todos os sorteios de um usuário específico. */
export const getSorteiosByUser = async (userId: number): Promise<Sorteio[]> => {
  return getAllAsync<Sorteio>("SELECT * FROM sorteios WHERE userId = ?", [userId]);
};

// --- NOVAS FUNÇÕES PARA HISTÓRICO ---

/** Insere o resultado de um sorteio no histórico. */
export const insertHistorico = async (
  tipo: "nome" | "numero",
  resultado: string,
  userId: number
) => {
  const dataSorteio = new Date().toISOString();
  await runAsync(
    `INSERT INTO historico (tipo, resultado, dataSorteio, userId) VALUES (?, ?, ?, ?)`,
    [tipo, resultado, dataSorteio, userId]
  );
};

/** Busca os últimos 10 sorteios do usuário. */
export const getHistorico = async (userId: number): Promise<HistoricoItem[]> => {
  return getAllAsync<HistoricoItem>(
    "SELECT * FROM historico WHERE userId = ? ORDER BY dataSorteio DESC LIMIT 10",
    [userId]
  );
};

/** NOVA FUNÇÃO: Limpa todo o histórico de sorteios de um usuário. */
export const clearHistorico = async (userId: number) => {
    return runAsync(`DELETE FROM historico WHERE userId = ?`, [userId]);
};