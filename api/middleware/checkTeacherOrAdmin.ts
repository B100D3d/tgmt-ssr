import { NextFunction, Request, Response } from "express";
import userModel from "../Model/MongoModels/userModel"

const checkAdminOrTeacher = async (req: Request, res: Response, next: NextFunction) => {

	const { uniqueId } = req.uniqueId

	const user = await userModel.findById(uniqueId).exec()

	if(!user) {
		res.status(403).json({
			error: {
				msg: "No user"
			}
		});
	}

	if (user.role !== "Admin" && user.role !== "Teacher"){
		return res.status(403).json({
			error: {
				msg: "No Admin or Teacher"
			}
			});
	}
	next()

}

export default checkAdminOrTeacher