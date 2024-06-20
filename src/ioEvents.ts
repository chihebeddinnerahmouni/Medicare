import { Server, Socket as IOSocket } from "socket.io";

interface Socket extends IOSocket {
  name?: string;
}

export const ioEvents = (io: Server, socket: Socket) => {

  //when he get in
  socket.on("ownRoom", (name: any) => {
    socket.name = name;
  });

  //for sending requests to nurses
  socket.on("sendRequest", (userName, nurseNames, requestData): void => {
    const room = `request of ${userName}`;
    socket.join(room);

    nurseNames.forEach((nurseName: any) => {
      for (let [id, socket] of io.sockets.sockets) {
        const namedSocket = socket as Socket;
        if (namedSocket.name === nurseName) {
          socket.join(room);
          break;
        }
      }
    });
    io.to(room).emit("newRequest", "u have recievd a new request", requestData);
  });
    

    //accepting the request by nurse
    socket.on("acceptRequest", (patient, nurseData) => {
         for (let [id, sockett] of io.sockets.sockets) {
            const namedSocket = sockett as Socket;
           if (namedSocket.name === patient) {
                io.to(sockett.id).emit("requestAccepted", nurseData);
                break;
            } 
        }
    });
  
  //choose another nurse
  socket.on("choose another nurse", (nurseName) => {
    for (let [id, sockett] of io.sockets.sockets) {
      const namedSocket = sockett as Socket;
      if (namedSocket.name === nurseName.nurseName) {
        io.to(sockett.id).emit("rejected nurse", "user rejected u");
        break;
      }
    }
  });

  //nurse end work
  socket.on("nurse end work", (patientName): void => { 
    for (let [id, sockett] of io.sockets.sockets) {
      const namedSocket = sockett as Socket;
      if (namedSocket.name === patientName.patientName) {
        io.to(sockett.id).emit("nurse ended work", "nurse ended work");
        break;
      }
    }
  });
  
    
    
    
    

  socket.on("disconnect", () => {
    socket.rooms.forEach((room) => {
      socket.leave(room);
    });
    console.log("Client disconnected");
  });
};
