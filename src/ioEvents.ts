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
  socket.on("sendRequest", (userName, nursenames) => {
    const room = `request of ${userName}`;
      socket.join(room);
      
    nursenames.forEach((nurseName: any) => {
      for (let [id, socket] of io.sockets.sockets) {
        const namedSocket = socket as Socket;
        if (namedSocket.name === nurseName) {
          socket.join(room);
          //console.log(nurseName + " joined room: " + room);
          // Break the loop as we've found the socket we're looking for
          break;
        }
      }
    });
    console.log("2");
    io.to(room).emit("newRequest", "u have recievd a new request");
  });
    
    //accepting the request
    socket.on("acceptRequest", (patient, nurseData) => {
        for (let [id, socket] of io.sockets.sockets) {
            const namedSocket = socket as Socket;
            if (namedSocket.name === patient) {
                io.to(socket.id).emit("requestAccepted", nurseData);
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
