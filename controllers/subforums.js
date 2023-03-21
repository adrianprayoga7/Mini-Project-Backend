import pool from '../connect.js';

//FUNGSI UNTUK MENAMPILKAN SUBFORUM TIAP POSTINGAN
export const getSubforums = (req, res) => {
  //query database
  const q = `SELECT posts.*, sub_forum.subforum
  FROM posts
  INNER JOIN sub_forum ON posts."subforumId" = sub_forum.id
  WHERE sub_forum.id = $1;`;

  //pool ke database
  pool.query(q, [req.params.subforumId], (err, data) => {
    //set error
    if (err) return res.status(500).json(err);
    return res.status(200).json(data.rows);
  });
};
