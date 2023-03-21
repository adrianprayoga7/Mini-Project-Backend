import express from 'express';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import subforumRoutes from './routes/subforum.js';
import commentRoutes from './routes/comments.js';
import likeRoutes from './routes/likes.js';
import relationshipRoutes from './routes/relationships.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import multer from 'multer';
import { createServer } from 'http';
import { Server } from 'socket.io';
import categoryRoutes from './routes/forumcategories.js';

//inisialisasi menggunakan socket.io
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

io.on('connection', (socket) => {
  io.emit('firstEvent', 'Hello this is test!');
  socket.on('disconnect', () => {});
});

//middlewares
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  next();
});
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
app.use(cookieParser());

//fungsi untuk upload photo menggunakan multer
const storage = multer.diskStorage({
  //memberikan perintah untuk setiap foto yang diupload disimpan di folder client/public/upload
  destination: function (req, file, cb) {
    cb(null, '../client/public/upload');
  },
  //perintah untuk melakukan pemberian nama file yang dikombinasikan dengan tanggal saat itu
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

//tujuan untuk mengupload file ke server dengan menggunakan middlewares multer
const upload = multer({ storage: storage });

//kode ini akan membuat endpoint baru untuk mengupload file
//middleware akan mengambil file yang diupload dan disimpan di folder yang ditentukan
//dan nama file akan dikembalikan sebagai respon
app.post('/api/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename);
});

//route setiap fungsi yang akan diakses
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/relationships', relationshipRoutes);
app.use('/api/subforum', subforumRoutes);
app.use('/api/forumcategories', categoryRoutes);

//mengatur port
httpServer.listen(8800, () => {
  console.log('API working!');
});
