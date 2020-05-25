import  {NextFunction, Request, Response } from "express";
import userModel from "../Model/MongoModels/userModel";

const checkFingerprint = async (req: Request, res: Response, next: NextFunction) => {

    const fingerprint = req.body.fingerprint
    if(!fingerprint) {
        return res.status(403).json({
            error: {
                msg: "No fingerprint"
            }
        });
    }

    const { uniqueId } = req.uniqueId
    req.user = req.user || await userModel.findById(uniqueId).exec()
    const user = req.user

    if (!user.isFingerprintValid(fingerprint)) {
        return res.clearCookie("token").status(403).json({
            error: {
                msg: "Fingerprint invalid"
            }
        });
    }

    next();
};

export default checkFingerprint;
