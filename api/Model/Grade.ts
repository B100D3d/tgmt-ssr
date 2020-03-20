import { 
    GradesGetData, 
    ExpressParams,
    Grades,
    GradesSetData,
    Grade,
    StudentModel,
    SubjectModel
} from "../types"
import userModel from "./MongoModels/userModel"
import studentModel from "./MongoModels/studentModel"
import gradeModel from "./MongoModels/gradeModel"
import subjectModel from "./MongoModels/subjectModel"
import groupModel from "./MongoModels/groupModel"

const getGradesArrayFromMap = (entity: string, _grades: Map<string, number>): Grades => {

    const grades: Array<Grade> = []
    for (const day of _grades.keys()) {
        const grade = {
            day: +day,
            grade: _grades.get(day)
        }

        grades.push(grade)
    }

    return { entity, grades }
}

export const getStudentGrades = async ({ month }: GradesGetData, { req }: ExpressParams): Promise<Array<Grades>> => {

    const { uniqueId: userID } = req.user

    const user = await userModel.findById(userID).exec()

    const student = await studentModel
                            .findOne({ name: user.name })
                            .populate({ path: "grades group", populate: { path: "subject subjects" }})
                            .exec()

    const subjects = student.group.subjects.map(({ name }: SubjectModel) => name)

    const grades = subjects.map(subject => {
        const gradesByMonthAnfSubject = 
            student.grades.find(grade => grade.month === month && grade.subject.name === subject)
            || { grades: new Map<string, number>() }
                                
        const grades = getGradesArrayFromMap(subject, gradesByMonthAnfSubject.grades)

        return grades
    })

    return grades

}


export const getGrades = async (args: GradesGetData, { res }: ExpressParams): Promise<Array<Grades>> => {
   
    const { month, subjectID, groupID } = args

    const subjectDB = await subjectModel.findOne({ id: subjectID }).exec()
    const groupDB = await groupModel
                            .findOne({ id: groupID })
                            .populate({ path: "students", populate: { path: "grades" }})
                            .exec()

    if (!subjectDB || !groupDB) {
        res.status(404)
        return
    }

    const grades = groupDB.students.map(({ name: entity, grades: _grades }: StudentModel) => {
        const gradesByMonthAnfSubject = 
            _grades.find(g => g.month === month && g.subject.equals(subjectDB._id)) 
            || { grades: new Map<string, number>()}

        const grades = getGradesArrayFromMap(entity, gradesByMonthAnfSubject.grades)
        console.log(grades)
        return grades
    })

    return grades
}


export const setGrades = async (args: GradesSetData, ep: ExpressParams): Promise<Array<Grades>> => {
    
    const { month, subjectID, groupID, grades } = args

    const subjectDB = await subjectModel.findOne({ id: subjectID }).exec()

    const gradesDB = await gradeModel.find({ month, subject: subjectDB._id })

    for (const item of grades) {
        const student = await studentModel.findOne({ name: item.student }).exec()

        let studentGrades = gradesDB.find(grade => grade.student.equals(student._id))

        if (!studentGrades) {
            studentGrades = new gradeModel({
                student,
                subject: subjectDB,
                month,
                grades: new Map<string, number>()
            })

            student.grades.push(studentGrades._id)
  
            await studentGrades.save()
            await student.save()

        }

        item.grades.map(grade => {
            grade.grade 
                ? studentGrades.grades.set(grade.day.toString(), grade.grade) 
                : studentGrades.grades.delete(grade.day.toString())
        })

        await studentGrades.save()

    }

    return getGrades({ month, subjectID, groupID }, ep)
}