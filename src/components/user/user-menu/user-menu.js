import React, { useContext } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

import './user-menu.sass';
import { UserContext } from '../../../context'
import logout from '/static/logout.svg';
import AdminList from './admin-list/admin-list';
import StudentList from './student-list/student-list';
import TeachertList from './teacher-list/teacher-list';



const LISTS = {
    Admin: <AdminList />,
    Student: <StudentList />,
    Teacher: <TeachertList />
}

const getRole = (user) => {
    if (user.role === 'Admin') {
        return 'Администратор'
    } 
    if (user.role === 'Student') {
        return `Студент | ${user.group.year} курс | группа ${user.group.name}`
    }
    if (user.role === 'Teacher') {
        return 'Преподаватель'
    }
}


const UserMenu = () => {

    const handleClick = async () => {
        await axios.post('https://тгмт.рф/api/logout', {}, { withCredentials: true })
        history.push('/')
    }

    const { user } = useContext(UserContext)
    const list = LISTS[user.role]
    const role = getRole(user)
    const history = useHistory()


    return (
        <div className="user-menu">
            <div className="user-info">
                <div className="user-text">
                    <h3>{ user.name }</h3>
                    <p>{ role }</p>
                </div>
                <div className="logout-con">
                    <img src={ logout } alt="logout" />
                    <button onClick={ handleClick } className="logout-btn" />
                </div>
            </div>
            <hr />
            <ul className="list">
                { list }
            </ul>
        </div>
    )
}

export default UserMenu;