import React from 'react';
import {Link} from 'react-router-dom';


const handleClick = (event) => {
    document.querySelector('.active').classList.remove('active')
    event.target.classList.add('active')
}

const StudentList = () => {
    return (
        <>
            <Link><li className="active" onClick={handleClick}>Расписание</li></Link>
            <Link><li onClick={handleClick}>Оценки</li></Link>
            <Link><li onClick={handleClick}>Журнал посещаемости</li></Link>
            <Link><li onClick={handleClick}>Настройки</li></Link> 
        </>
    )
}

export default StudentList;