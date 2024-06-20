import dotenv from 'dotenv';
import patientModel from "../models/patient-schema";
import { Request, Response, request } from 'express';
import handlePasswordStrength from "../utils/check-password-strength";
import isFieldMissing from "../utils/is-missing-field";
import handleExistingUser from "../utils/check-execisting-user-phemna";
import sendinSignupEmail from "../utils/sending-Signup-email";
import crypto from 'crypto';
import findByEmail from "../utils/find-by-email";
import fs from "fs";
import {
  IRequest,
  IReservationRequests,
  //reservationRequestsModel,
  //AvailableTimeModel,
  IPatientScheduleReservation,
  IDemndeNurseRaquest,
  demandeNurseRaquestModel,
} from "../models/reservations-utils";
import doctormodel from '../models/doctor-schema';
import nurseModel from '../models/nurses-schema';
import { Id } from '@turf/turf';
import bcrypt from 'bcrypt';


dotenv.config();
declare global {
    namespace Express {
        interface Request {
            user: any;
        }
    }
}

//signup
export const signupPatient = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password } = req.body;
    const fields = [name, email, phone, password];
    const type = "patient";
    if (isFieldMissing(fields)) {
      return res.status(400).json({message: "All fields are required"});
    }

    if (!handlePasswordStrength(res, password)) {
      return;
    }

    if (await handleExistingUser(res, email, name, phone)) {
      return;
    }

    const verificationCode = crypto.randomBytes(10).toString("hex");
    const nurse = patientModel.create({
      name,
      email,
      phone,
      password,
      type,
      verificationCode,
    });
    sendinSignupEmail(res, email, type, name);
  } catch (error) {
    res
      .status(400)
      .json({ message: "degat mtrenjistrach marhh", error: error });
  }
};


//______________________________________________________________________________________


//delete a patient
export const deletePatient = async (req: Request, res: Response) => {
    try {
        const name = req.params.name;
        await patientModel.findOneAndDelete({ name: name });
        res.status(200).json({ message: 'Patient deleted successfully' });
    } catch (error) {
        res.json({ message: 'degat matssuprimach', error: error });
    }
}


//______________________________________________________________________________________


//get profile
export const getPatientProfile = async (req: Request, res: Response) => { 
  try {
    const id = req.user.id;
    const user = await patientModel.findById(id);
    if (!user) return res.status(400).send("Cannot find nurse profile");
      const resUser = {
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    res.json(user);
  } catch (error) { 
    res.send("error degat"+ error)
  }
};


//______________________________________________________________________________________


//update password
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const id = req.user.id;
    const { password } = req.body;
    if (!handlePasswordStrength(res, password)) return;
    const user = await patientModel.findById(id);
    if (!user)return res.status(400).json({ message: "Cannot find patient to reset password" });
    //const isMatch = await bcrypt.compare(oldPassword, user.password);
    //if (!isMatch) return res.status(201).json({ message: "your password is incorrect" });
    user.password = password;
    await user.save();
    res.status(200).json({ message: "Password updated" });
  } catch (error) {
    res.send("error degat" + error);
  }
};


//______________________________________________________________________________________


//update profile
export const updatePatientProfile = async (req: Request, res: Response) => {
  try {
    const id = req.user.id;
    const { name, email, phone } = req.body;
    const user = await patientModel.findById(id);
    if (!user) return res.status(400).send("Cannot find Patient to update profile");

    if (await handleExistingUser(res, email, name, phone)) return;

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    await user.save();
    res.json({ message: "Profile updated" });
  } catch (err) {
    res.send("error" + err);
  }
};


//______________________________________________________________________________________


//update email
export const updatePatientEmail = async (req: Request, res: Response) => { 

  try {
    const id = req.user.id;
    const { email, phone, name } = req.body;
    const user = await patientModel.findById(id);
    if (!user) return res.status(400).send("Cannot find patient to update email");

    const exdoctorexuser = await patientModel.findOne({ email });
    if(await findByEmail(res, email)) return;
    //if (await handleExistingUser(res, email, name, phone)) return;

    await sendinSignupEmail(res, email, user.type, user.name);
    
    user.verified = false;
    user.email = email;
    await user.save();
  } catch (err) {
    res.send("error" + err);
  }
}

//______________________________________________________________________________________

//update password
export const updatePassword = async (req: Request, res: Response) => { 
  try {
    const id = req.user.id;
    const { oldPassword, newPassword } = req.body;
    const user = await patientModel.findById(id);
    if (!user)return res.status(401).json({ message: "Cannot find patient to reset password" });
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(201).json({ message: "your password is incorrect" });
    if (!handlePasswordStrength(res, newPassword)) return;
    user.password = newPassword;
    await user.save();
    res.status(200).json({ message: "Password updated" });
  } catch (error) {
    res.status(400).json({ message: "something went wrong", error: error });
  }
}


//______________________________________________________________________________________


//update profile picture
export const updatePatientProfilePicture = (req: Request, res: Response) => updatePicture(req, res, "profilePicture");

//update cover picture
export const updatePatientCoverPicture = (req: Request, res: Response) => updatePicture(req, res, "coverPicture");

//helper function to update picture
async function updatePicture(
  req: Request,
  res: Response,
  pictureField: "profilePicture" | "coverPicture"
) {
  const user = await patientModel.findById(req.user.id);
  if (!user) return res.status(404).json({ message: `User not found` });

  if (user[pictureField]) {
    fs.unlink(user[pictureField], (err) => {
      if (err)
        console.error(
          `Failed to delete old picture at ${user[pictureField]}: `,
          err
        );
    });
  }

  user[pictureField] = req.file!.path;
  await user.save();
  res
    .status(200)
    .json({ message: `${pictureField} updated successfully`, file: req.file! });
}

//______________________________________________________________________________________


//delete all requests
export const deleteAllRequests = async (req: Request, res: Response) => {
  try {
    const id = req.user.id;
    const user = await patientModel.findById(id);
    if (!user) return res.status(400).send("Cannot find patient to delete requests");

// delete from patient
    user.reservationsRequests = [];
    await user.save();

//delete from doctor
   const name = user.name;
   await doctormodel.updateMany(
     {},
     { $pull: { "available.$[].requestList": { name } } }
    );
    
//delete from reservationRequests
    /*await reservationRequestsModel.deleteMany({
      patient: name
    });*/

    //delete from availableTime
    /*await AvailableTimeModel.updateMany(
      {},
      { $pull: { requestList: { name } } }
    );*/

    res.json({ message: `All requests deleted, thank you ${user.name}` });
  } catch (error) {
    res.send("error deleting all requests" + error);
  }
}

//______________________________________________________________________________________


//reservation
export const sendReservationRequest = async (req: Request, res: Response) => {

  try {
    const { doctorName, code } = req.body;

    const id = req.user.id;

    const doctor = await doctormodel.findOne({ name: doctorName });
    if (!doctor) return res.status(400).send("Cannot find doctor to reserve");
    const patient = await patientModel.findById(id);
    if (!patient) return res.status(400).send("Cannot find patient to reserve");
    const availableTimeInDoctor = doctor.available.find((time: any) => time.code === code);
    if (!availableTimeInDoctor) return res.status(400).send("Cannot find available time in doctor to reserve");

    if (availableTimeInDoctor.reserved === "reserved") return res.status(400).send("This time is already reserved");

    availableTimeInDoctor.reserved = "pending";
//save in patient
    const rdvInPatient = {
      day: availableTimeInDoctor.day,
      hour: availableTimeInDoctor.hour,
      ticketNumber: availableTimeInDoctor.ticketNumber,
      reserved: "pending",
      code: availableTimeInDoctor.code,
      doctor: doctorName,
      patient: patient.name
    } as IReservationRequests;
    patient.reservationsRequests.push(rdvInPatient);
    await patient.save();

    //save in reservationRequests
    /*const reservationRequest = new reservationRequestsModel(rdvInPatient);
    await reservationRequest.save();*/

    


//save in doctor
    const patientInfos: IRequest = {
      name: patient.name,
      profilePicture: patient.profilePicture,
      phone: patient.phone
    }
      availableTimeInDoctor.requestList.push(patientInfos);
      await doctor.save();

      //save in availableTime
      /*const availableTime = await AvailableTimeModel.findOne({ code });
      if (!availableTime) return res.status(400).send("Cannot find available time to reserve");
      availableTime.requestList.push(patientInfos);
      availableTime.reserved = "pending";
      await availableTime.save();*/

     

    res.json({ message: `Request sent succesfully please wait doctor to accept, thank you ${patient.name}` });
  } catch (error) {
    res.status(400).send("Cannot send reservation request: " + error);
  }
}

//______________________________________________________________________________________

//reserve schedule ticket
export const reserveScheduleTicket = async (req: Request, res: Response) => {
  try {
    const { doctor, day } = req.body;
    const id = req.user.id;
    const fields = [doctor, day];

    if (isFieldMissing(fields)) return res.status(400).send("All fields are required");
    
    const patient = await patientModel.findById(id);
    if (!patient) return res.status(400).send("Cannot find patient to reserve schedule ticket");
    const doctorr = await doctormodel.findOne({ name: doctor });
    if (!doctorr) return res.status(400).send("Cannot find doctor to reserve schedule ticket");

    let schedule: any = doctorr.schedule.find((time: any) => time.day === day);
    if (!schedule) return res.status(400).send("Cannot find schedule to reserve schedule ticket");

    let freeSlot: any = schedule.freeAt.find((slot: any) => slot.reserved === "free");
    if (!freeSlot) return res.status(400).send("Cannot find free slot to reserve schedule ticket");

    freeSlot.reserved = "true";
    freeSlot.patientName = patient.name;
    freeSlot.patientPhone = patient.phone;
    await doctorr.save();
    const scheduleReservation: IPatientScheduleReservation = {
      day: schedule.day,
      hour: freeSlot.hour,
      ticketNumber: freeSlot.ticketNumber,
      doctor: doctorr.name,
      location: doctorr.location,
      phone: doctorr.phone,
      reservedAt: new Date().getDay() + "/" + new Date().getMonth() + "," + new Date().getHours() + ":" + new Date().getMinutes(),
    };
    patient.scheduleResevations.push(scheduleReservation);
    await patient.save();

    res.json({ message: `your ticket number is  ${freeSlot.ticketNumber}, thank you ${patient.name}` });
    
  } catch (error) {
    res.status(400).send("Cannot reserve schedule ticket: " + error);
  }
}

//_____________________________________________________________________________________

//delete all schedule reservations
export const deleteAllScheduleReservations = async (req: Request, res: Response) => {
  try {
    const id = req.user.id;
    const user = await patientModel.findById(id);
    if (!user) return res.status(400).send("Cannot find patient to delete schedule reservations");

    user.scheduleResevations = [];
    await user.save();

await doctormodel.updateMany(
  { "schedule.freeAt.patient": user.name },
  { $set: { "schedule.$[].freeAt.$[slot].reserved": "free", "schedule.$[].freeAt.$[slot].patient": "" } },
  { arrayFilters: [{ "slot.patient": user.name }] }
);
      
    
    res.json({ message: `All schedule reservations deleted, thank you ${user.name}` });
  } catch (error) {
    res.status(400).send("Cannot delete all schedule reservations: " + error);
  }
}

//_____________________________________________________________________________________

//get neaby nurses
export const getNearbyNurses = async (req: Request, res: Response) => {
  try {
    const { userLocation, service, subService } = req.body;

    const id = req.user.id;
    const user = await patientModel.findById(id);
    if (!user) return res.status(400).send("Cannot find patient to get nearby nurses");
    const fields = [userLocation, service, subService];
    if (isFieldMissing(fields)) return res.status(400).send("All fields are required");
   

    user.location.coordinates = userLocation;

    if (user.patientStatus === "pending") return res.status(400).json({message: `You already sent requests thank you ${user.name} wli mb3d`,});

        //get nearbynurses
    const nearbyNurses = await nurseModel.find({
      workStatus: "free",
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: userLocation,
          },
          $maxDistance: 1000, //in meters
        },
      },
    });

        //
    let nurseList = [];
    let nurseListNames = [];
    let pricee = 499;
    for (let nurse of nearbyNurses) {
      pricee = pricee + 1;
      const nurseInfos = {
        nurseName: nurse.name,
        nurseRate: nurse.averageRating,
        nurseLikes: 80, //
        nurseSpecialite: nurse.specialite,
        patientClients: 90,//
        price: pricee, //
      };
      nurseListNames.push(nurse.name)
      nurseList.push(nurseInfos);
      nurse.workStatus = "pending"
    }

    for (let nurse of nearbyNurses) {
      const request: IDemndeNurseRaquest = {
        patient: user.name,
        nurse: nurse.name,
        status: "pending",
        nursesRequested: nurseListNames,
        price: 500, //
        service: service,
        subService: subService,
        patientRate: user.averageRating,
        distance: 2.6, //
        choosen: false,
        location: {
          type: "Point",
          coordinates: userLocation,
        },
      };
      
      nurse.patientRequests.push(request);
      await nurse.save();
    }
      if (nurseList.length === 0) return res.status(201).json({ message: "Cannot find nearby nurses" });
    
    const UserRequest = {
      patient: user.name,
      status: "pending",
      nursesRequested: nurseList,
      price: 500, //
      service: service,
      subService: subService,
      serviceNurse: "",
    };
    user.patientStatus = "pending";
    user.nurseRequest = UserRequest;
    await user.save();

    const requestData = {  
      service: service,
      subService: subService,
      distance: 2.6, //
      price: 500, //
      patient: user.name,
      patientRate: user.averageRating,
      location: userLocation,
    };

    return res.status(200).json({ message: `thank you ${user.name}`, nurseList, requestData, nurseListNames});


  } catch (error) {
    

  console.error(error);
    res.status(400).json({message:"degat Cannot get nearby nurses: ","error": error});
  }
}

//_____________________________________________________________________________________

//reset patient
export const resetPatient = async (req: Request, res: Response) => {
  try {
    const id = req.user.id;
    const user = await patientModel.findById(id);
    if (!user) return res.status(400).send("Cannot find patient to reset");
    user.patientStatus = false;
    //user.requestTo = [];
    //user.serviceNurse = "";
    user.nurseRequest = {};
    await user.save();
    res.json({ message: `thank you ${user.name}, reseted successfully` });
  } catch (error) {
    res.status(405).send("error degat" + error)
  }
}

//_____________________________________________________________________________________

// rate a nurse
export const rateNurse = async (req: Request, res: Response) => { 
  try {
    const id = req.user.id;
    const { rating, comment, nurseName } = req.body;
    const user = await nurseModel.findOne({ name: nurseName });
    if (!user) return res.status(400).json({ message: "Cannot find nurse to rate" });

    if (rating !== 0) {
      const oldRatingNumber = user.ratingNumber;
      const oldRatingSum = user.ratingSum;
      const newRatingNumber = oldRatingNumber + 1;
      const newRatingSum = oldRatingSum + rating;
      const newAverageRating = (newRatingSum / newRatingNumber).toFixed(1);
      user.ratingNumber = newRatingNumber;
      user.ratingSum = newRatingSum;
      user.averageRating = Number(newAverageRating);
      await user.save();
    }

    if (comment !== "") {
      const commentObj = {
        patient: user.name,
        comment: comment,
      };
      user.patientComments.push(commentObj);
      await user.save();
    }
    res.status(200).json({ message: `You rated ${nurseName} with ${rating} stars` });
  } catch (error) { 
    res.status(400).json({ message: "Error rating nurse", error: error });
  }
}

//_____________________________________________________________________________________

//refuse a nurse
export const refuseNurse = async (req: Request, res: Response) => { 
  try {
    const id = req.user.id;
    const user = await patientModel.findById(id);
    if (!user) return res.status(400).json({ message: "Cannot find patient to refuse nurse" });
    const nurseName = user.nurseRequest.serviceNurse;
    const nurse = await nurseModel.findOne({ name: nurseName });
    if (!nurse) return res.status(400).json({ message: "Cannot find nurse to refuse" });

    user.patientStatus = false;
    user.nurseRequest = {};
    nurse.workStatus = "free";
    nurse.patientRequests = [];
    await user.save();
    await nurse.save();
    res.status(200).json({ message: `You refused ${nurseName}` });




  } catch (error) { 
    res.status(400).json({ message: "degat Error refusing nurse", error: error });
  }
};

//_____________________________________________________________________________________

//choose a nurse
export const chooseNurse = async (req: Request, res: Response) => { 
  try {
    const id = req.user.id;
    const { nurseName, service, subService, userLocation } = req.body;
    
    const fields = [nurseName, service, subService, userLocation];
    if (isFieldMissing(fields)) return res.status(400).json({ message: "All fields are required" });
    const user = await patientModel.findById(id);
    if (!user) return res.status(400).json({ message: "Cannot find patient to choose nurse" });
    const nurse = await nurseModel.findOne({ name: nurseName });
    if (!nurse) return res.status(400).json({ message: "Cannot find nurse to choose" });
   

    if (nurse.workStatus !== "free") return res.status(201).json({ message: `${nurse.name} is not available any more, please choose another one` });

    const request: IDemndeNurseRaquest = {
      patient: user.name,
      nurse: nurseName,
      status: "pending",
      nursesRequested: [nurseName],
      price: 500, //
      service: service,
      subService: subService,
      patientRate: user.averageRating,
      distance: 2.6, //
      choosen: true,
      location: {
        type: "Point",
        coordinates: userLocation,
      },
    };
    nurse.patientRequests.push(request);
    nurse.workStatus = "pending";

        const UserRequest = {
          patient: user.name,
          status: "pending",
          nursesRequested: [
            {
              nurseName: nurseName,
              nurseRate: nurse.averageRating,
              nurseLikes: 80,//
              nurseSpecialite: nurse.specialite,
              patientClients: 90,//
            },
          ],
          price: 500, //
          service: service,
          subService: subService,
          serviceNurse: "",
        };
        user.patientStatus = "pending";
        user.nurseRequest = UserRequest;
    await user.save();
    await nurse.save();
    res.status(200).json({ message: `Request sent to ${nurseName} successfully, please wait for him to accept` });



  } catch (error) { 
    res.status(400).json({ message: "Error degat choosing nurse", error: error });
  }
}




