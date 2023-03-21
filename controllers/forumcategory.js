import pool from '../connect.js';

//SUB FORUM GAMES
export const forumGames = (req, res) => {
  //query database
  const q = `SELECT posts.*, sub_forum.subforum, users.name, users."profilePic" 
  FROM posts 
  JOIN sub_forum ON posts."subforumId" = sub_forum.id JOIN users ON users.id = posts."userId"
  WHERE sub_forum.subforum = 'Games' ORDER BY "createdAt" DESC`;

  //pool query ke database
  pool.query(q, (err, data) => {
    //respon 500 untuk error
    //200 jika berhasil
    if (err) return res.status(500).json(err);
    return res.status(200).json(data.rows);
  });
};

//SUB FORUM ACCESORIES
export const forumAcc = (req, res) => {
  //query database
  const q = `SELECT posts.*, sub_forum.subforum, users.name, users."profilePic" 
  FROM posts 
  JOIN sub_forum ON posts."subforumId" = sub_forum.id JOIN users ON users.id = posts."userId"
  WHERE sub_forum.subforum = 'Accesorries' ORDER BY "createdAt" DESC`;

  //pool query ke database
  pool.query(q, (err, data) => {
    //respon 500 untuk error
    //200 jika berhasil
    if (err) return res.status(500).json(err);
    return res.status(200).json(data.rows);
  });
};

//SUB FORUM COMPETITION
export const forumComp = (req, res) => {
  //query database
  const q = `SELECT posts.*, sub_forum.subforum, users.name, users."profilePic" 
  FROM posts 
  JOIN sub_forum ON posts."subforumId" = sub_forum.id JOIN users ON users.id = posts."userId"
  WHERE sub_forum.subforum = 'Competition' ORDER BY "createdAt" DESC`;

  //pool query ke database
  pool.query(q, (err, data) => {
    //respon 500 untuk error
    //200 jika berhasil
    if (err) return res.status(500).json(err);
    return res.status(200).json(data.rows);
  });
};

//SUB FORUM EVENT
export const forumEvent = (req, res) => {
  //query database
  const q = `SELECT posts.*, sub_forum.subforum, users.name, users."profilePic" 
  FROM posts 
  JOIN sub_forum ON posts."subforumId" = sub_forum.id JOIN users ON users.id = posts."userId"
  WHERE sub_forum.subforum = 'Event' ORDER BY "createdAt" DESC`;
  //pool query ke database
  pool.query(q, (err, data) => {
    //respon 500 untuk error
    //200 jika berhasil
    if (err) return res.status(500).json(err);
    return res.status(200).json(data.rows);
  });
};

//SUB FORUM HARDWARE
export const forumHardware = (req, res) => {
  //query database
  const q = `SELECT posts.*, sub_forum.subforum, users.name, users."profilePic" 
  FROM posts 
  JOIN sub_forum ON posts."subforumId" = sub_forum.id JOIN users ON users.id = posts."userId"
  WHERE sub_forum.subforum = 'Hardware' ORDER BY "createdAt" DESC`;

  //pool ke database
  pool.query(q, (err, data) => {
    //respon 500 untuk error
    //200 jika berhasil
    if (err) return res.status(500).json(err);
    return res.status(200).json(data.rows);
  });
};
