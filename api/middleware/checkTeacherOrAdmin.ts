import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { TokenInfo } from "../types";
import userModel from "../Model/MongoModels/userModel"

const checkAdminOrTeacher = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.cookies.token) {
            return res.status(401).json({
              error: {
                msg: "No cookies"
              }
            });
        }

        const { uniqueId } = jwt.verify(req.cookies.token, process.env.SECRET) as TokenInfo;

        const user = await userModel.findById(uniqueId).exec()

        if (user.role !== "Admin" && user.role !== "Teacher"){
            return res.status(403).json({
                error: {
                  msg: "No Admin or Teacher"
                }
              });
        }
        next()
        
    } catch (err) {
        res.status(401).json({
            error: {
              msg: "Invalid token"
            }
          });
          console.log(err);
    }
}

export default checkAdminOrTeacher