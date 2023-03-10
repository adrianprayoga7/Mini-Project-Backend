import pool from '../connect.js';
import jwt from 'jsonwebtoken';
// import moment from 'moment';

//FUNGSI UNTUK MENDAPATKAN KOMEN DARI USER
export const getPosts = (req, res) => {
  //digunakan untuk mengambil nilai dari query string berdasarkan userId
  const userId = req.query.userId;

  //untuk cek user login atau tidak dilihat dari akses token
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json('Not logged in!');

  //verifikasi token
  jwt.verify(token, 'secretkey', (err, userInfo) => {
    if (err) return res.status(403).json('Token is not valid!');

    //userId !== undefined untuk memastikan bahwa userId yang dimasukan tidak undefined
    //tujuan query ini untuk mengambil semua data post dari user yang dipilih dan juga user yang diikuti oleh user lain
    const q =
      userId !== 'undefined'
        ? `SELECT p.*, u.id AS "userId", name, "profilePic" FROM posts p JOIN users u ON (u.id = p."userId") WHERE p."userId" = $1 ORDER BY p."createdAt" DESC`
        : `SELECT p.*, u.id AS "userId", name, "profilePic" FROM posts p JOIN users u ON (u.id = p."userId") LEFT JOIN relationships AS r ON (p."userId" = r."followedUserId") WHERE r."followerUserId" = $1 OR p."userId" = $2 ORDER BY p."createdAt" DESC`;

    //fungsi ini bertujuan apakah userId yang dimasukan sama dengan userInfoId atau tidak
    const values =
      userId !== 'undefined' ? [userId] : [userInfo.id, userInfo.id];
    pool.query(q, values, (err, data) => {
      //jika gagal akan merespon status 500
      //jika berhasil akan merespon 200
      if (err) return res.status(500).json(err);
      return res.status(200).json(data.rows);
    });
  });
};

//FUNGSI UNTUK MENAMBAHKAN KOMEN
export const addPost = (req, res) => {
  //untuk cek user login berdasarkan token
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json('Not logged in!');

  //verifikasi token
  jwt.verify(token, 'secretkey', (err, userInfo) => {
    if (err) return res.status(403).json('Token is not valid!');

    //fungsi untuk menambahkan data baru ke dalam tabel posts
    const values = [req.body.desc, req.body.img, userInfo.id];

    pool.query(
      'INSERT INTO posts("desc", img, "userId") VALUES ( $1, $2, $3) RETURNING *',
      [...values],
      (err, data) => {
        //mengembalikan nilai 500 jika error
        if (err) return res.status(500).json(err);
        //jika berhasil maka mengembalikan nilai 200
        return res.status(200).json('Post has been created');
      }
    );
  });
};

//FUNGSI UNTUK MELAKUKAN DELETE POST
export const deletePost = (req, res) => {
  //cek user terlogin berdasarkan token
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json('Not logged in!');

  //verifikasi token
  jwt.verify(token, 'secretkey', (err, userInfo) => {
    if (err) return res.status(403).json('Token is not valid!');

    //fungsi untuk delete post
    pool.query(
      'DELETE FROM posts WHERE id=$1 AND "userId" = $2',
      [req.params.id, userInfo.id],
      (err, data) => {
        //mengembalikan respon status 500 jika error
        if (err) return res.status(500).json(err);

        //fungsi untuk menghapus post yang dibuat oleh user, jika rowcount lebih dari 0
        //maka kembalikan respon status 200
        if (data.rowCount > 0)
          return res.status(200).json('Post has been deleted.');
        //jika rowcount tidak lebih dari 0 atau user ingin menghapus post user lain
        //maka kembalikan status 403
        return res.status(403).json('You can delete only your post!');
      }
    );
  });
};
