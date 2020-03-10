import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Route, Switch, useLocation } from 'react-router-dom';

import './user-main.sass';
import Schedule from './schedule/schedule';


const UserMain = () => {

    const location = useLocation()

    return (
        <div className="user-main">
            <TransitionGroup>
                <CSSTransition
                    key={ location.key }
                    timeout={ 1000 }
                    classNames="fade">
                    <Switch>
                        <Route exact path='/user' component={ Schedule } />
                        <Route path='/user/grades' component={ Schedule } />
                        <Route path='/user/absence' component={ Schedule } />
                        <Route path='/user/settings' component={ Schedule } />
                    </Switch>
                </CSSTransition>
            </TransitionGroup>
        </div>
    )
}


export default UserMain;