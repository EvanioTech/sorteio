import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('sorteio.db');

export const initDB = () => {
  try {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL UNIQUE,
        senha TEXT NOT NULL
      );
    `);
  } catch (error) {
    console.error("Erro ao inicializar o banco de dados", error);
  }
};
