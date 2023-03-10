import pool from '../connect.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

//FUNGSI REGISTER
export const register = (req, res) => {
  //VALIDASI
  //untuk check apakah username tersedia atau sudah ada yang memakai
  pool.query(
    'SELECT * FROM users WHERE username = $1',
    [req.body.username],
    async (err, data) => {
      //error 500 untuk memberitahu bahwa ada masalah di server
      //sehingga tidak dapat mengirim permintaan
      if (err) return res.status(500).json(err);
      //error 409 jika user register menggunakan username yang sudah terpakai
      if (data.rows.length) return res.status(409).json('User already exists!');

      //MEMBUAT AKUN BARU
      //hashing password
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = await bcrypt.hashSync(req.body.password, salt);

      //menyimpan request di variable values
      const values = [
        req.body.username,
        req.body.email,
        hashedPassword,
        req.body.name,
      ];

      //melakukan pool ke database
      pool.query(
        'INSERT INTO users (username,email,password,name) VALUES ($1,$2,$3,$4) RETURNING *',
        [...values],
        (err, data) => {
          if (err) return res.status(500).json(err);
          //mengembalikan status 200 jika user berhasil membuat akun
          return res.status(200).json('User has been created.');
        }
      );
    }
  );
};

//LOGIN
export const login = (req, res) => {
  //melakukan pool ke database
  pool.query(
    'SELECT * FROM users WHERE username = $1',
    [req.body.username],
    async (err, data) => {
      if (err) return res.status(500).json(err);
      //mengembalikan nilai 404 jika username tidak ditemukan
      if (data.rows.length === 0)
        return res.status(404).json('Username not found!');

      //melakukan pengecekan password dengan data yang ada di database
      const checkPassword = await bcrypt.compareSync(
        req.body.password,
        data.rows[0].password
      );

      //jika data tidak sesuai maka kembalikan respon status 400
      if (!checkPassword)
        return res.status(400).json('Wrong password or username!');

      //implementasi token jwt
      //sebagai fungsi otentikasi atau pertukaran data
      const token = jwt.sign({ id: data.rows[0].id }, 'secretkey');

      const { password, ...others } = data.rows[0];

      //jika berhasil maka tampilkan respon status 200
      res
        .cookie('accessToken', token, {
          httpOnly: true,
        })
        .status(200)
        .json(others);
    }
  );
};

//FUNGSI LOGOUT
export const logout = (req, res) => {
  //melakukan clear cookie
  //digunakan untuk menghapus cookie yang ditentukan
  //berdasarkan cookie dari user
  res
    .clearCookie('accessToken', {
      sameSite: 'none',
      secure: true,
    })
    //jika berhasil maka tampilkan status 200
    .status(200)
    .json('User has been logged out.');
};
