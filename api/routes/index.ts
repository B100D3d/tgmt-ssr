import resolver from "../graphql/resolver"


export default [
    {
        path: "/",
        exact: true,
        loadData: async (): Promise<any> => {
            const week = resolver.mainPageResolver.week()
            const resources = await resolver.mainPageResolver.resources()

            return new Promise(resolve => resolve({ week, resources }))
        }
    },
    {
        path: "/user"
    }
]