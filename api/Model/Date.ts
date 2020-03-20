import { Week } from "../types";

const months: {[key: number]: string} = {
    0: "Января",
    1: "Февраля",
    2: "Марта",
    3: "Апреля",
    4: "Мая",
    5: "Июня",
    6: "Июля",
    7: "Августа",
    8: "Сентября",
    9: "Октября",
    10: "Ноября",
    11: "Декабря"
};

export const getTime = (): string => {
    const date = new Date()
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

export const getDate = (): string => {
    const date = new Date();
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

export const getWeekNum = (): number => {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        const yearOfStart = (currentDate.getMonth() >= 8)
                            ? currentDate.getUTCFullYear()
                            : (currentDate.getUTCFullYear() - 1);
        const firstDayOfSchoolYear = new Date(Date.UTC(yearOfStart, 8, 2));
        firstDayOfSchoolYear.setHours(0, 0, 0, 0);
        const pastDaysOfSchoolYear = ((currentDate.getTime() - firstDayOfSchoolYear.getTime())
                                        / 86400000) + 1;
        return Math.ceil((pastDaysOfSchoolYear + firstDayOfSchoolYear.getDay() - 1) / 7);
};

export const isEven = (): string => (getWeekNum() % 2) ? "нечетная" : "четная";

export default (): Week => ({
    date: getDate(),
    even: isEven(),
    weekNum: getWeekNum()
})
