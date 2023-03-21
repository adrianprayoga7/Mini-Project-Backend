import pool from '../connect.js';
import jwt from 'jsonwebtoken';
import moment from 'moment';

//FUNGSI UNTUK MENDAPATKAN COMMENT
//query akan mengambil user berdasarkan id, nama dan profil picture
export const getComments = (req, res) => {
  const q = `SELECT c.*, u.id AS "userId", name, "profilePic" FROM comments AS c JOIN users AS u ON (u.id = c."userId")
    WHERE c."postId" = $1 ORDER BY c."createdAt" DESC`;

  pool.query(q, [req.query.postId], (err, data) => {
    //ketika gagal maka akan merespon dengan status 500
    //tetapi jika berhasil maka akan merespon dengan status 200
    if (err) return res.status(500).json(err);
    return res.status(200).json(data.rows);
  });
};

//FUNGSI UNTUK MEMBERIKAN COMMENT TERHADAP POST USER
export const addComment = (req, res) => {
  //setiap komen di beri token dimana user tidak dapat komen jika belum login
  //dan akan mengembalikan respon 401
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json('Not logged in!');

  //penggunaan jwt untuk verifikasi token
  //dimana secretkey berguna untuk mengecek apakah user menggunakan token yang sama atau tidak
  //jika sama maka user dapat berkomentar pada postingan
  //jika tidak maka user mengembalikan status 403
  jwt.verify(token, 'secretkey', (err, userInfo) => {
    if (err) return res.status(403).json('Token is not valid!');

    //pemanggilan query berdasarkan desc,id dan id post
    const q =
      'INSERT INTO comments("desc", "createdAt", "userId", "postId") VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [
      req.body.desc,
      moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
      userInfo.id,
      req.body.postId,
    ];

    pool.query(q, [...values], (err, data) => {
      //jika gagal maka akan merespon dengan status 500 error
      //jika berhasil maka akan merespon status 200
      if (err) return res.status(500).json(err);
      return res.status(200).json('Comment has been created.');
    });
  });
};

//FUNGSI DELETE COMMENT
export const deleteComment = (req, res) => {
  //setiap komen di beri token dimana user tidak dapat komen jika belum login
  //dan akan mengembalikan respon 401
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json('Not authenticated!');

  //penggunaan jwt untuk verifikasi token
  //dimana secretkey berguna untuk mengecek apakah user menggunakan token yang sama atau tidak
  //jika sama maka user dapat berkomentar pada postingan
  //jika tidak maka user mengembalikan status 403
  jwt.verify(token, 'secretkey', (err, userInfo) => {
    if (err) return res.status(403).json('Token is not valid!');

    //query delete comment
    const commentId = req.params.id;
    const q = 'DELETE FROM comments WHERE id = $1 AND "userId" = $2';

    //melakukan pool terhadap database
    pool.query(q, [commentId, userInfo.id], (err, data) => {
      //jika gagal maka akan merespon dengan status 500 error
      //jika berhasil maka akan mengirim message comment has been deleted
      //status 403 muncul jika user ingin menghapus comment user lain
      if (err) return res.status(500).json(err);
      if (data.rowCount > 0) return res.json('Comment has been deleted!');
      return res.status(403).json('You can delete only your comment!');
    });
  });
};
