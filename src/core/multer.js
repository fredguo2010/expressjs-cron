const fs = require('fs');
const multer = require('multer');

const { NODE_ENV } = process.env;

let storage = multer.diskStorage({
  destination(req, file, done) {
    const uploadsDir = 'uploads';
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
    return done(null, uploadsDir);
  },
  filename(req, file, done) {
    done(null, file.originalname);
  },
});

const storageavatar = multer.diskStorage({
  destination(req, file, done) {
    const uploadsDir = 'uploads';
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
    const avatarDir = 'uploads/avatar';
    if (!fs.existsSync(avatarDir)) fs.mkdirSync(avatarDir);
    return done(null, avatarDir);
  },
  filename(req, file, done) {
    done(null, file.originalname);
  },
});


const storagesubsitute = multer.diskStorage({
  destination(req, file, done) {
    const uploadsDir = 'uploads';
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
    const avatarDir = 'uploads/subsitute';
    if (!fs.existsSync(avatarDir)) fs.mkdirSync(avatarDir);
    return done(null, avatarDir);
  },
  filename(req, file, done) {
    done(null, file.originalname);
  },
});

if (NODE_ENV === 'production') {
  storage = multer.diskStorage({
    destination(req, file, done) {
      const uploadsDir = 'uploads';
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
      return done(null, uploadsDir);
    },
    filename(req, file, done) {
      done(null, file.originalname);
    },
  });
}

module.exports = {
  defaultstorage: multer({ storage }),
  avatorstorage: multer({ storage: storageavatar }),
  subsitutestorage: multer({ storage: storagesubsitute }),

};
