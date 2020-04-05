import React, { useContext } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Route, Switch, useLocation } from 'react-router-dom';

import './user-main.sass';
import Schedule from './schedule/schedule';
import { UserContext } from '/context';
import Selector from './selector/selector';


const UserMain = () => {

    const location = useLocation()
    const { user: { role } } = useContext(UserContext)

    return (
        <div className="user-main">
            <TransitionGroup>
                <CSSTransition
                    key={ location.key }
                    timeout={ 1000 }
                    classNames="fade">
                    { role === 'Student' ? 
                        <Switch location={location}>
                            <Route exact path='/user' component={ Schedule } />
                            <Route path='/user/grades' component={ Schedule } />
                            <Route path='/user/absence' component={ Schedule } />
                            <Route path='/user/settings' component={ Schedule } />
                        </Switch>
                    : role === 'Admin' ? 
                        <Switch location={location}>
                            {/*
                            * TODO: изменить component на render с сохранением "бага" цвета :D
                            */}
                            <Route exact path='/user' component={ () => <Selector type='year' /> } />
                            <Route exact path='/user/:year' component={ () => <Selector type='group' /> } />
                            <Route exact path='/user/:year/:group' component={ Schedule } />
                        </Switch>
                    : 
                        <Switch location={location}>
                            <Route exact path='/user' component={ Schedule } />
                        </Switch> }
                </CSSTransition>
            </TransitionGroup>
        </div>
    )
}


export default UserMain;