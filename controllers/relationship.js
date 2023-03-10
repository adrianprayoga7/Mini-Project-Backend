import pool from '../connect.js';
import jwt from 'jsonwebtoken';

//FUNGSI UNTUK MENERIMA RELATIONSHIP DARI USER LAIN
export const getRelationships = (req, res) => {
  pool.query(
    'SELECT "followerUserId" FROM relationships WHERE "followedUserId" = $1',
    [req.query.followedUserId],
    (err, data) => {
      //mengembalikan status 500 jika error
      if (err) return res.status(500).json(err);
      //mengembalikan status 200 jika berhasil
      //dengan melakukan pengambilan data berdasarkan followerUserId dari database
      return res
        .status(200)
        .json(data.rows.map((relationship) => relationship.followerUserId));
    }
  );
};

//FUNGSI UNTUK MELAKUKAN FOLLOW PADA USER LAIN
export const addRelationship = (req, res) => {
  //cek user terlogin berdasarkan token
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json('Not logged in!');

  //verifikasi token
  jwt.verify(token, 'secretkey', (err, userInfo) => {
    if (err) return res.status(403).json('Token is not valid!');

    //melakukan insert data yang diinput ke database
    const values = [userInfo.id, req.body.userId];

    pool.query(
      'INSERT INTO relationships ("followerUserId","followedUserId") VALUES ($1, $2)',
      [...values],
      (err, data) => {
        //mengembalikan respon status 500 jika error
        if (err) return res.status(500).json(err);
        //jika berhasil maka 200
        return res.status(200).json('Following');
      }
    );
  });
};

//FUNGSI UNFOLLOW DENGAN USER LAIN
export const deleteRelationship = (req, res) => {
  //cek user terlogin
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json('Not logged in!');

  //verifikasi token
  jwt.verify(token, 'secretkey', (err, userInfo) => {
    if (err) return res.status(403).json('Token is not valid!');

    //melakukan delete data pada database
    pool.query(
      'DELETE FROM relationships WHERE "followerUserId" = $1 AND "followedUserId" = $2',
      [userInfo.id, req.query.userId],
      (err, data) => {
        //mengembalikan status 500 jika error
        if (err) return res.status(500).json(err);
        //mengembalikan respon 200 jika berhasil
        return res.status(200).json('Unfollow');
      }
    );
  });
};
