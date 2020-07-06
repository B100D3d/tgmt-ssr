import { Router } from "express"
import graphqlHTTP from "express-graphql"
import resolver from "../graphql/resolver"
import * as schema from "../graphql/schemas"
import checkToken from "../middleware/checkToken"
import checkAdmin from "../middleware/checkAdmin"
import checkAdminOrTeacher from "../middleware/checkTeacherOrAdmin"
import checkFingerprint from "../middleware/checkFingerprint"
import { clearFingerprints } from "../Model/User"

const apiRouter = Router()

const isDev = process.env.PROD === "false"

apiRouter.use("/mainPage", graphqlHTTP({
    graphiql: isDev,
    rootValue: resolver.mainPageResolver,
    schema: schema.mainPageInfo
}
))

apiRouter.use("/createUser", checkToken, checkAdmin, checkFingerprint, (req, res) => graphqlHTTP({
    graphiql: isDev,
    rootValue: resolver.createUsersResolver,
    schema: schema.userCreating,
    context: {req, res}
}
)(req, res))

apiRouter.use("/deleteUser", checkToken, checkAdmin, checkFingerprint, (req, res) => graphqlHTTP({
        graphiql: isDev,
        rootValue: resolver.deleteUsersResolver,
        schema: schema.userDeleting,
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

apiRouter.use("/auth", checkToken, checkFingerprint, (req, res) => graphqlHTTP({
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

apiRouter.use("/clearFingerprints", checkToken, checkFingerprint, async (req, res) => {
    const result = await clearFingerprints({ req, res })
    res.clearCookie("token").status(result ? 200 : 500).send()
})

apiRouter.use("/changeUserInfo", checkToken, checkFingerprint, (req, res) => graphqlHTTP({
    graphiql: isDev,
    rootValue: resolver.changeUserInfoResolver,
    schema: schema.userInfoSettings,
    context: {req, res}
}
)(req, res))

apiRouter.use("/groups", checkToken, checkAdmin, checkFingerprint, (req, res) => graphqlHTTP({
    graphiql: isDev,
    rootValue: resolver.groupsResolver,
    schema: schema.groups,
    context: {req, res}
}
)(req, res))

apiRouter.use("/students", checkToken, checkAdmin, checkFingerprint, (req, res) => graphqlHTTP({
    graphiql: isDev,
    rootValue: resolver.studentsResolver,
    schema: schema.students,
    context: {req, res}
}
)(req, res))

apiRouter.use("/teachers", checkToken, checkAdmin, checkFingerprint, (req, res) => graphqlHTTP({
    graphiql: isDev,
    rootValue: resolver.teachersResolver,
    schema: schema.teachers,
    context: {req, res}
}
)(req, res))

apiRouter.use("/subjects", checkToken, checkAdmin, checkFingerprint, (req, res) => graphqlHTTP({
    graphiql: isDev,
    rootValue: resolver.subjectsResolver,
    schema: schema.subjects,
    context: {req, res}
}
)(req, res))

apiRouter.use("/setSchedule", checkToken, checkAdminOrTeacher, checkFingerprint, (req, res) => graphqlHTTP({
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

apiRouter.use("/records", checkToken, checkAdminOrTeacher, checkFingerprint, (req, res) => graphqlHTTP({
    graphiql: isDev,
    rootValue: resolver.recordsResolver,
    schema: schema.records,
    context: {req, res}
}
)(req, res))

apiRouter.use("/studentRecords", checkToken, (req, res) => graphqlHTTP({
    graphiql: isDev,
    rootValue: resolver.studentRecordsResolver,
    schema: schema.records,
    context: {req, res}
}
)(req, res))

apiRouter.use("/mailing", checkToken, checkAdmin, checkFingerprint, (req, res) => graphqlHTTP({
        graphiql: isDev,
        rootValue: resolver.mailingResolver,
        schema: schema.mailing,
        context: {req, res}
}
)(req, res))

export default apiRouter
