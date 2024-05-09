import { Request, Response } from "express";
import definingModel from "../utils/defining-model";

export const logout = async (req: Request, res: Response) => {
    try {
        const { id, type, tokenVersion } = req.user;
        const model = await definingModel(type);
        const user = await model!.findById(id);
        if (!user) {
            return res.status(404).send("User not found mlginahch");
        }
        if (user.online === true) {
            user.tokenVersion += 1;
            user.token = "";
            user.refreshToken = "";
            user.online = false;
            await user.save();
            res.send(`${user.name} logged out`);
                          
        } else {
            res.send("user is not online");
        }
    } catch (error) {
        res.status(400).send("degat" + error);
    }
}