import { transliterate } from "transliteration"

const CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_#$%*"

export const range = (size: number, start?: number): Array<number> =>  {
    
    if (!start) return range(size, 0)
    
    return [...Array(size).keys()].map(k => k + start)
} 


const generateStr = (length: number): string => {
    let str = ""
    for (let i = 0; i < length; i++){
        str += CHARS[Math.floor(Math.random() * CHARS.length)];
    }
    return str
}

export const generateLogin = (name: string): string => {
    const lastName = name.split(" ")[0]
    const tLastName = transliterate(lastName)
    const str = generateStr(4)
    return `${tLastName}_${str}`
};

export const generatePassword = (): string => {
    const length = Math.floor(12 + Math.random() * 5)
    return generateStr(length)
};

export const generateGroupID = (name: string): string => {
    return transliterate(name.split(" ").join(""))
}

export const generateSubjectID = (name: string, teacher: string): string => {
    const tName = transliterate(name.split(" ").join("_"))
    const tTeacherLastName = transliterate(teacher.split(" ")[0])
    return `${tName}_${tTeacherLastName}`
}

export const generateStudentID = (name: string, groupName: string): string => {
    const lastName = transliterate(name.split(" ")[0])
    const groupID = generateGroupID(groupName)

    return `${lastName}${groupID}`
}

export const generateTeacherID = (name: string): string => {
    const lastName = transliterate(name.split(" ")[0])

    return lastName
}
