import pool from '../connect.js';
import jwt from 'jsonwebtoken';

//FUNGSI UNTUK MENDAPATKAN USER LAIN
export const getUser = (req, res) => {
  const userId = req.params.userId;

  //dengan melakukan fungsi select berdasarkan id
  pool.query('SELECT * FROM users WHERE id = $1', [userId], (err, data) => {
    //jika error maka respon status 500
    if (err) return res.status(500).json(err);
    //fungsi untuk menghapus properti password dari data rows
    //mengembalikan respon nilai info
    const { password, ...info } = data.rows[0];
    return res.json(info);
  });
};

//MELAKUKAN UPDATE PROFIL USER
export const updateUser = (req, res) => {
  //cek user terlogin
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json('Not authenticated!');

  //verifikasi token
  jwt.verify(token, 'secretkey', (err, userInfo) => {
    if (err) return res.status(403).json('Token is not valid!');

    //fungsi update berdasarkan inputan user
    const { name, city, website, coverPic, profilePic } = req.body;

    pool.query(
      'UPDATE users SET name = $1, city = $2, website = $3, "profilePic"= $4, "coverPic"= $5 WHERE id=$6',
      [name[0], city[0], website[0], coverPic, profilePic, userInfo.id],
      (err, data) => {
        //jika gagal mengembalikan respon 500
        if (err) return res.status(500).json(err);
        // jika berhasil bahwa data lebih dari 0 maka respon akan mengembalikan pesan updated
        if (data.rowCount > 0) return res.json('Updated!');
        //jika data tidak lebih dari 0 maka respon akan mengembalikan status 403
        return res.status(403).json('You can update only your post!');
      }
    );
  });
};
