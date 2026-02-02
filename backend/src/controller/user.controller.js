import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js"

export const getAllUsers = async (req, res, next) => {
  try {
    const userId = req.auth?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const users = await User.find({ clerkId: { $ne: userId } });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getMessage = async (req,res,next) => {
    try {
      const myId = req.auth.userId;
      const {userId} = req.params;

      const messages = await Message.find({
        $or: [
          {senderId:userId, receiverId:myId},
          {senderId:myId, receiverId:userId}
        ]
      }).sort({ createdAt: 1 });

      res.status(200).json(messages);
    } catch (error) {
      next(error);
    }
}
