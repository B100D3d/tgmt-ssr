import resolver from "../graphql/resolver"


export default [
    {
        path: "/",
        exact: true,
        loadData: async (): Promise<any> => {
            const week = resolver.mainPageResolver.week()
            const resources = await resolver.mainPageResolver.resources()

            return { week, resources }
        }
    },
    {
        path: "/user",
        exact: true,
        loadData: async (): Promise<any> => {
            const week = resolver.mainPageResolver.week()
           
            return { week }
        }
    },
    {
        path: "/user/settings",
        loadData: async (): Promise<any> => {
            const week = resolver.mainPageResolver.week()

            return { week }
        }
    }
]