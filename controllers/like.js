import pool from '../connect.js';
import jwt from 'jsonwebtoken';

//FUNGSI AGAR USER DAPAT LIKE POST
export const getLikes = (req, res) => {
  //query mencari berdasarkan user id
  pool.query(
    'SELECT "userId" FROM likes WHERE "postId" = $1',
    [req.query.postId],
    (err, data) => {
      //jika gagal akan merespon status 500
      if (err) return res.status(500).json(err);
      //jika berhasil maka akan merespon status 200 dengan melakukan metode map pada data
      //tujuannya untuk mengambil semua id dari database dan mengembalikan dalam bentuk array
      return res.status(200).json(data.rows.map((like) => like.userId));
    }
  );
};

//FUNGSI UNTUK MELAKUKAN LIKE PADA POSTINGAN
export const addLike = (req, res) => {
  //fungsi ini bertujuan untuk mengecek apakah ada user login atau tidak
  //dilihat dari token tersedia atau tidak
  //tujuannya untuk memastikan user telah login sebelum melanjutkan
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json('Not logged in!');

  //fungsi untuk memverifikasi token yang disediakan dengan memberikan secretkey
  //jika token tidak valid maka akan mengembalikan status 403
  jwt.verify(token, 'secretkey', (err, userInfo) => {
    if (err) return res.status(403).json('Token is not valid!');

    //tujuannya dari fungsi ini untuk menyimpan data ke database
    const values = [userInfo.id, req.body.postId];

    //query akan melakukan insert data berdasarkan user id dan post id
    pool.query(
      'INSERT INTO likes ("userId","postId") VALUES ($1, $2)',
      [...values],
      (err, data) => {
        //respon akan mengembalikan nilai 500 jika gagal
        //200 jika berhasil
        if (err) return res.status(500).json(err);
        return res.status(200).json('Post has been liked.');
      }
    );
  });
};

//FUNGSI UNTUK MELAKUKAN UNLIKE
export const deleteLike = (req, res) => {
  //mengecek user login atau tidak berdasarkan token
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json('Not logged in!');

  //melakukan verifikasi token dengan secretkey untuk melihat apakah token yang
  //digunakan user valid atau tidak
  jwt.verify(token, 'secretkey', (err, userInfo) => {
    if (err) return res.status(403).json('Token is not valid!');

    //query akan melakukan delete pada database jika user melakukan unlike
    pool.query(
      'DELETE FROM likes WHERE "userId" = $1 AND "postId" = $2',
      [userInfo.id, req.query.postId],
      (err, data) => {
        //mengembalikan respon 500 jika gagal
        //200 jika berhasil
        if (err) return res.status(500).json(err);
        return res.status(200).json('Post has been disliked.');
      }
    );
  });
};
