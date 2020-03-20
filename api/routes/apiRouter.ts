import { Router } from "express"
import graphqlHTTP from "express-graphql"
import resolver from "../graphql/resolver"
import * as schema from "../graphql/schemas"
import checkToken from "../middleware/checkToken"
import checkAdmin from "../middleware/checkAdmin"
import checkAdminOrTeacher from "../middleware/checkTeacherOrAdmin"

const apiRouter = Router()

const isDev = !(+process.env.PROD)

apiRouter.use("/mainPage", graphqlHTTP({
    graphiql: isDev,
    rootValue: resolver.mainPageResolver,
    schema: schema.mainPageInfo
}
))
apiRouter.use("/createUser", checkAdmin, (req, res) => graphqlHTTP({
    graphiql: isDev,
    rootValue: resolver.createUsersResolver,
    schema: schema.userCreating,
    context: {req, res}
}
)(req, res))

apiRouter.use("/login", (req, res) => graphqlHTTP({
    graphiql: isDev,
    rootValue: resolver.loginResolver,
    schema: schema.login,
    context: {req, res}
}
)(req, res))

apiRouter.use("/auth", checkToken, (req, res) => graphqlHTTP({
    graphiql: isDev,
    rootValue: resolver.authResolver,
    schema: schema.auth,
    context: {req, res}
}
)(req, res))

apiRouter.use("/logout", (req, res) => {
    if (req.cookies.token){
        res.clearCookie("token").status(200).send()
    }
    else {
        res.status(200).send()
    }
})

apiRouter.use("/setUserInfo", checkToken, (req, res) => graphqlHTTP({
    graphiql: isDev,
    rootValue: resolver.setUserInfoResolver,
    schema: schema.userInfoSetting,
    context: {req, res}
}
)(req, res))

apiRouter.use("/groups", checkAdmin, (req, res) => graphqlHTTP({
    graphiql: isDev,
    rootValue: resolver.groupsResolver,
    schema: schema.groups,
    context: {req, res}
}
)(req, res))

apiRouter.use("/students", checkAdmin, (req, res) => graphqlHTTP({
    graphiql: isDev,
    rootValue: resolver.studentsResolver,
    schema: schema.students,
    context: {req, res}
}
)(req, res))

apiRouter.use("/teachers", checkAdmin, (req, res) => graphqlHTTP({
    graphiql: isDev,
    rootValue: resolver.teachersResolver,
    schema: schema.teachers,
    context: {req, res}
}
)(req, res))

apiRouter.use("/subjects", checkAdmin, (req, res) => graphqlHTTP({
    graphiql: isDev,
    rootValue: resolver.subjectsResolver,
    schema: schema.subjects,
    context: {req, res}
}
)(req, res))

apiRouter.use("/setSchedule", checkAdminOrTeacher, (req, res) => graphqlHTTP({
    graphiql: isDev,
    rootValue: resolver.setScheduleResolver,
    schema: schema.schedules,
    context: {req, res}
}
)(req, res))

apiRouter.use("/getSchedule", checkToken, (req, res) => graphqlHTTP({
    graphiql: isDev,
    rootValue: resolver.getScheduleResolver,
    schema: schema.schedules,
    context: {req, res}
}
)(req, res))

apiRouter.use("/grades", checkAdminOrTeacher, (req, res) => graphqlHTTP({
    graphiql: isDev,
    rootValue: resolver.gradesResolver,
    schema: schema.grades,
    context: {req, res}
}
)(req, res))

apiRouter.use("/studentGrades", checkToken, (req, res) => graphqlHTTP({
    graphiql: isDev,
    rootValue: resolver.studentGradesResolver,
    schema: schema.grades,
    context: {req, res}
}
)(req, res))

export default apiRouter
