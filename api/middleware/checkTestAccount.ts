import  { NextFunction, Request, Response } from "express"

const checkTestAccount = (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    if(user.role === "Admin" && user.login === "test") {
        req.testAccount = true
    }

    next()
}

export default checkTestAccount