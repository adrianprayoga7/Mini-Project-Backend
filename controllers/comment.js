import pool from '../connect.js';
import jwt from 'jsonwebtoken';

//FUNGSI UNTUK MENDAPATKAN COMMENT
//query akan mengambil user berdasarkan id, nama dan profil picture
export const getComments = (req, res) => {
  pool.query(
    `SELECT c.*, u.id AS "userId", name, "profilePic" FROM comments c JOIN users u ON (u.id = c."userId") WHERE c."postId" = $1 ORDER BY c."createdAt" DESC`,

    [req.query.postId],
    (err, data) => {
      //ketika gagal maka akan merespon dengan status 500
      //tetapi jika berhasil maka akan merespon dengan status 200
      if (err) return res.status(500).json(err);
      return res.status(200).json(data.rows);
    }
  );
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
    const values = [req.body.desc, userInfo.id, req.body.postId];

    pool.query(
      'INSERT INTO comments("desc", "userId","postId") VALUES ($1, $2, $3) RETURNING *',
      [...values],
      (err, data) => {
        //jika gagal maka akan merespon dengan status 500 error
        //jika berhasil maka akan merespon status 200
        if (err) return res.status(500).json(err);
        return res.status(200).json('Comment has been created');
      }
    );
  });
};

// export const deleteComment = (req, res) => {
//   const token = req.cookies.accessToken;
//   if (!token) return res.status(401).json('Not logged in!');

//   jwt.verify(token, 'secretkey', (err, userInfo) => {
//     if (err) return res.status(403).json('Token is not valid!');

//     pool.query(
//       'DELETE FROM comments WHERE id=$1 AND "userId" = $2',
//       [req.params.id, userInfo.id],
//       (err, data) => {
//         if (err) return res.status(500).json(err);
//         if (data.rows.length > 0)
//           return res.status(200).json('Comment has been deleted.');
//         return res.status(403).json('You can delete only your comment!');
//       }
//     );
//   });
// };
