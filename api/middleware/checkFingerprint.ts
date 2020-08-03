import  { NextFunction, Request, Response } from "express"

const checkFingerprint = async (req: Request, res: Response, next: NextFunction) => {

    const fingerprint = req.body.fingerprint
    if(!fingerprint) {
        return res.status(403).json({
            error: {
                msg: "No fingerprint"
            }
        });
    }

    if (!req.user.isFingerprintValid(fingerprint)) {
        return res.clearCookie("token").status(403).json({
            error: {
                msg: "Fingerprint invalid"
            }
        })
    }

    next()
}

export default checkFingerprint
