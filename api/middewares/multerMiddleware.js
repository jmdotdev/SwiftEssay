import multer from "multer";
import { v4 as uuidv4 } from 'uuid';
import path from 'path'

const storage = multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,'orderfiles')
  },
  filename:function(req,file,cb){
    cb(null,file.originalname)
    // cb(null,uuidv4() + '-',Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

export const uploadFiles = upload.fields([
  { name: 'files', maxCount: 5 },
]);

