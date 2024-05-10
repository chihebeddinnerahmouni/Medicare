import multer, { StorageEngine } from "multer";
import path from "path";
import { Request } from "express";



const storage: StorageEngine = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    const dir = path.join(__dirname, "../images");
    cb(null, dir);
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    //cb(null, file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + "-" + file.originalname );
  },
});
const upload = multer({ storage: storage });

export default upload;
