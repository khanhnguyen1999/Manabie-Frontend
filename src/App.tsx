import React from 'react';

import {BrowserRouter, Switch, Route} from 'react-router-dom';

import SignInPage from './features/Login/SignInPage';
import ToDoPage from './features/Todo/ToDoPage';
import Error404 from './features/Error404View/Error404View';

import './App.css';

// routes
import AuthGuard from './guards/AuthGuard';
import GuestGuard from './guards/GuestGuard';

function App() {
  const accessToken = localStorage.getItem("token")
  console.log("accessToken ",accessToken)
  return (
    <main className="App">
      <BrowserRouter>
        <Switch>
          <GuestGuard path="/login" isAuthenticated={accessToken ? true : false} component={SignInPage} />
          <Route path="/todo" isAuthenticated={accessToken ? true : false} component={ToDoPage} />
          <Route path="*" component={Error404} />
        </Switch>
      </BrowserRouter>
    </main>
  );
}

export default App;
