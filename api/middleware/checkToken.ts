import  { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import { TokenInfo } from "../types"

const checkToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.cookies.token) {
      return res.status(401).json({
        error: {
          msg: "No cookies"
        }
      })
    }

    const { uniqueId } = jwt.verify(req.cookies.token, process.env.SECRET) as TokenInfo;

    req.uniqueId = { uniqueId }
    next()

  } catch (err) {
    res.status(401).json({
      error: {
        msg: "Invalid token"
      }
    });
    console.log(err)
  }
}

export default checkToken
