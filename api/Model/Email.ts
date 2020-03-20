import nodemailer from "nodemailer"
import { UAParser } from "ua-parser-js"
import path from "path"
import getLoginHtml from "./EmailTemplates/Login"
import { UserRegData } from "../types"
import { getDate, getTime } from "./Date"

const ROLES: {[key: string]: string} = {
    Admin: "Администратор",
    Student: "Студент",
    Teacher: "Преподаватель"
}

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    socketTimeout: 5000,
    logger: false,
    auth: {
        user: "info.tuapsegmt@gmail.com",
        pass: "fSociety00"
    }
})

const getUAInfo = (userAgent: string) => {
    const parser = new UAParser(userAgent)
    const model = (parser.getDevice().vendor || "") + (parser.getDevice().vendor || "")
    const os = `${ parser.getOS().name } ${ parser.getOS().version }`
    const browser = `${ parser.getBrowser().name } ${ parser.getBrowser().version }`
    return `${ model } | ${ os } | ${ browser }`
}


export const sendUserCreatingEmail = async (userData: UserRegData): Promise<void> => {
    const {name, login, password, role, email} = userData
    const text = `Пользователь ${name} с ролью "${role}" был успешно создан!\n
    Данные для входа:\n
    Логин: ${login}\n
    Пароль: ${password}\n`
    const mailOptions = {
        from: "info.tuapsegmt@gmail.com",
        to: email,
        subject: "Пользователь был создан",
        text
    }

    try{
        const info = await transporter.sendMail(mailOptions)
        //console.log(info)
    } catch (err) {
        console.log(err)
    }
    
}

export const sendLoginEmail = async (name: string, email: string, role: string, req: any): Promise<void> => {
    const text = `Был выполнен вход в аккаунт "${name}" (${ROLES[role]})\n
    IP: ${req.ip}\n
    ${req.headers["user-agent"]}`

    const device = getUAInfo(req.headers["user-agent"])
    const time = `${getDate()}, ${getTime()}`

    const html = getLoginHtml(device, req.ip, time, name, ROLES[role])
    const mailOptions = {
        from: "info.tuapsegmt@gmail.com",
        to: email,
        subject: "Выполнен вход в аккаунт",
        text,
        html,
        attachments: [
            {
                filename: "logo_back.webp",
                path: path.join(__dirname, "/EmailTemplates/static/logo_back.webp"),
                cid: "logo"
            }
        ]
    }

    try{
        const info = await transporter.sendMail(mailOptions)
        //console.log(info)
    } catch (err) {
        console.log(err)
    }
    
}


export const sendPassChangedEmail = async (name: string, email: string, password: string): Promise<void> => {
    const text = `У аккаунта "${name}" был изменён пароль.\nНовый пароль: ${password}`
    const mailOptions = {
        from: "info.tuapsegmt@gmail.com",
        to: email,
        subject: "Изменение пароля",
        text
    }

    try{
        const info = await transporter.sendMail(mailOptions)
        //console.log(info)
    } catch (err) {
        console.log(err)
    }
    
}

export const sendEmailChangedEmail = async (name: string, email: string): Promise<void> => {
    const text = `Email успешно подключён к учётной записи "${name}"`
    const mailOptions = {
        from: "info.tuapsegmt@gmail.com",
        to: email,
        subject: "Изменение email адреса",
        text
    }

    try{
        const info = await transporter.sendMail(mailOptions)
        //console.log(info)
    } catch (err) {
        console.log(err)
    }
}