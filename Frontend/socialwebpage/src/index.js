import React from 'react';
import ReactDOM from 'react-dom';

import Login from './Pages/Login';
import Register from './Pages/Register';
import Profile from './Pages/Profile';
import Feed from './Pages/Feed';
import Upload from './Pages/Upload'
import PostText from './Pages/PostText'

import {BrowserRouter, Route, Switch} from 'react-router-dom';

import registerServiceWorker from './registerServiceWorker';

//

ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <Route exact path="/login" component={Login}></Route>
            <Route exact path="/register" component={Register}></Route>
            <Route path="/profile/:username?" component={Profile}></Route>
            <Route exact path="/upload" component={Upload}></Route>
            <Route exact path="/post" component={PostText}></Route>
            <Route exact path="/" component={Feed}></Route>
        </Switch>
    </BrowserRouter>,
root);

registerServiceWorker();
