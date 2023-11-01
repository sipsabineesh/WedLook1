const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './assets/img/product-images');
    },
    filename: function (req, file, cb) {
      const fileName = Date.now() + path.extname(file.originalname);
      cb(null, fileName);
    }
  });

  
  const addBanner = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null,'./assets/img/banner-images');
    },
    filename:function (req, file, cb)  {
      const fileName = Date.now() + path.extname(file.originalname);
      cb(null, fileName);
    },
  });

  module.exports = {
    upload: multer({ storage: storage }).array("image"),
    update: multer({ storage: storage }).array("image"),
    bupload: multer({ storage: addBanner }).array("image"),
  }