import pg from 'pg';
const { Pool } = pg;

//Kokeksi ke database postgres sisi backend
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'forum_db',
  password: '1',
  port: 5432,
});

export default pool;
