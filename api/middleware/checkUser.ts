import  { NextFunction, Request, Response } from "express"
import userModel from "../Model/MongoModels/userModel"

const checkUser = async (req: Request, res: Response, next: NextFunction) => {

    const { uniqueId } = req.uniqueId
    req.user = await userModel.findById(uniqueId).exec()

    if(!req.user) {
        res.status(403).json({
            error: {
                msg: "No user"
            }
        });
    }
    next()
}

export default checkUser
