
export const subjectFields = `
    id
    name
    teacher
`

export const scheduleFields = `
    classNumber
    weekday
    subject {
        ${ subjectFields }
    }
`

export const recordsFields = `
    name
    records
`

export const groupFields = `
    name
    id
    year
`


export const studentsFields = `
    id
    name
    email
    group {
        ${ groupFields }
    }
`

export const studentFields = `
    name
    email
    group
    login
    password
    role
`

export const teachersFields = `
    id
    name
    email
`

export const techerFields = `
    name
    email
    login
    password
    role
`

export const weekFields = `
    date
    weekNumber
    even
`

export const resourcesFields = `
    img
    text
    url
`

export const userFields = `
    ...on Admin {
        login
        name
        role
        email
        groups {
            id
            name
            year
        }
    }
    ...on Teacher {
        login
        name
        role
        email
        groups {
            id
            name
            year
            subjects {
                id
            }
        }
        subjects {
            id
            name
        }
    }
    ...on Student {
        login
        name
        role
        email
        group {
            id
            name
            year
        }
        schedule {
            subject {
                id
                name
                teacher
            }
            weekday
            classNumber
        }
    }
`