import express from "express";
import doctormodel from "../models/doctor-schema";
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
import { Request, Response, NextFunction } from "express";




const router = express.Router();

// get all doctors
router.get("/", async (req, res) => {
  const doctors = await doctormodel.find();
  res.json(doctors);
});

//create a doctor
router.post("/", async (req, res) => {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const doctorData = {
    ...req.body,
    password: hashedPassword,
  };

  const doctor = await doctormodel.create(doctorData);
  res.json(doctor);
});

// get one doctor
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const doctor = await doctormodel.findById(id);
  res.json(doctor);
});

// update a doctor
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const doctor = await doctormodel.findByIdAndUpdate(id, req.body);
  res.json({
    message: "doctor updated",
    doctor,
  });
});

// delete a doctor
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const doctor = await doctormodel.findByIdAndDelete(id);
  res.json({ message: "doctor deleted" });
});

// login
router.post("/login", async (req, res) => {
  const docname = req.body.name;
  const password = req.body.password;
  const doctor = await doctormodel.findOne({ name: docname });
  if (!doctor) {
    return res.status(400).send("Cannot find user");
  }
  const validation = await bcrypt.compare(password, doctor.password);
  if (!validation) {
    return res.status(400).send("Invalid password");
  } else {
         const token = await jwt.sign({name: docname}, process.env.secret_key);
         res.json({ message: "Logged in", token: token });
  }
});


// authenticateToken
function authenticateToken( req: Request, res: Response, next: NextFunction ): any{
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.sendStatus(401); // send a 401 Unauthorized status if no token is provided
  }

  jwt.verify(token, process.env.secret_key as string, (err: any, user: any) => {
    if (err) {
      return res.sendStatus(403); // send a 403 Forbidden status if the token is invalid
    }

    //req.user = user;
    next();
  });
};








module.exports = router;
