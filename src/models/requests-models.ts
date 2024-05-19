import moongoose from "mongoose";


export interface IRequest {
  name: string;
  profilePicture: string;
  phone: Number;
}

//______________________________________________________________________________________

export interface IReservationRequests {
  day: string;
  hour: string;
  ticketNumber: number;
  reserved: string;
  code: number;
  doctor: string;
}

export const reservationRequestsSchema = new moongoose.Schema<IReservationRequests>({
    day: { type: String, required: true },
    hour: { type: String, required: true },
    ticketNumber: { type: Number, required: true },
    reserved: { type: String, required: true },
    code: { type: Number, required: true },
    doctor: { type: String, required: true }
});
    
export const reservationRequestsModel = moongoose.model<IReservationRequests>("reservationRequests", reservationRequestsSchema);


