import resolver from "../graphql/resolver"


export default [
    {
        path: "/",
        exact: true,
        loadData: async (): Promise<any> => {
            try {
                const week = resolver.mainPageResolver.week()
                const resources = await resolver.mainPageResolver.resources()

                return { week, resources }
            } catch(err) {
                console.log(`loadData error: ${err}`)
            }
            
        }
    },
    {
        path: "*",
        loadData: async (): Promise<any> => {
            try {
                const week = resolver.mainPageResolver.week()

                return { week }
            } catch(err) {
                console.log(`loadData error: ${err}`)
            }

        }
    }
]