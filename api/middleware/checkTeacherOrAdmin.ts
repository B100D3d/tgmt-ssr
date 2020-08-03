import { NextFunction, Request, Response } from "express"

const checkAdminOrTeacher = async (req: Request, res: Response, next: NextFunction) => {

	const user = req.user

	if (user.role !== "Admin" && user.role !== "Teacher"){
		return res.status(403).json({
			error: {
				msg: "No Admin or Teacher"
			}
			})
	}
	next()

}

export default checkAdminOrTeacher