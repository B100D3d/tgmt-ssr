import {NextFunction, Request, Response} from "express"

const checkAdmin = async (req: Request, res: Response, next: NextFunction) => {

    const user = req.user

    if (user.role !== "Admin"){
      return res.status(403).json({
          error: {
            msg: "No Admin"
          }
        })
    }
    req.user = user
    next()
}

export default checkAdmin