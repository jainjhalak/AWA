import {Server} from "socket.io";
import {Message} from "../models/message.model.js"

export const initializeSocket = (server) => {
    const io = new Server(server, {
        cors:{
            origin:"http://localhost:3000",
            credentials: true
        }
    });

    const userSockets = new Map(); // {key will be userId: socketId will be value} when user logsin they will automatically get a socketId
    const userActivities = new Map();  // {key will be activity: activity will be value} to keep track of user activity in rightside bar

    io.use((socket, next) => {
        socket.userId = socket.handshake.auth.userId;
        next();
    });


    io.on("connection", (socket) => {

      // socket.on to listen for incoming events
      socket.on("user_connected", (userId) => {
    {/*1*/} userSockets.set(userId, socket.id); // key userId, value socketId
    {/*2*/} userActivities.set(userId, "Idle"); // not listening to anything will show theid ID and state is Idle

    {/*3*/} io.emit("user_connected", userId); // broadcast to all connected sockets/users that this user just logged in {send events from client to server}

    {/*4*/} socket.emit("users_online", Array.from(userSockets.keys())); // once login we want to know who else is online. so getting list of currently connected users {send events from server to client}

    {/*5*/} io.emit("activities", Object.fromEntries(userActivities)); // broadcast connected users activities to all online users

            {/*flow*/}
            // when user connect, update both maps (1) & (2) so we know they have just became online and they are not listening to anything
            // then we will let everyone know that this user just connected (3)
            // tell (1) that hey man u just logged in here the online user list (4) and what they are listening to (5)
        }); 

      socket.on("update_activity", ({userId, activity}) => { // update activity once the user start listening to anything
        console.log("activity updated", userId, activity);
        userActivities.set(socket.userId, activity); // set userId and their activity 
        io.emit("activities", Object.fromEntries(userActivities)); // broadcast their activity and userId to all connected users
      });

      socket.on("send_message", async(data) => { // grab data and make it async to save it to DB
        try {
            const {senderId, receiverId, content} = data // grab senderId, receiverId and content from the data

            // save all three things to database
            const message = await Message.create({
                senderId,
                receiverId,
                content
            })

            // send to receiver in realtime if they are online
            const receiverSocketId = userSockets.get(receiverId);
            if(receiverSocketId) {
                io.to(receiverSocketId).emit("receive_message", message)
            }

            socket.emit("message_sent", message)

           } catch (error) {
            console.log("Message error: ", error);
            socket.emit("message_error ", error.message);
        }
      });

      // when user disconnectes delete all their activites
      socket.on("disconnect", () => {
        let disconnectedUserId;
        // loop through each user
        for(const [userId, socketId] of userSockets.entries()) {
            // find disconnected user
            if(socketId == socket.id){
                disconnectedUserId = userId;
                userSockets.delete(userId);
                userActivities.delete(userId);
                break;
            }
        }
        if (disconnectedUserId) {
            io.emit("user_disconnected", disconnectedUserId); // let everyone this user disconnected
        }
      })
    })
}

// io.to: send the events to specific user
// io.emit: send the events to all connected user