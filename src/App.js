import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import StoryList from '../src/components/StoryList/StoryList'
import Developer from '../src/components/Developer/Developer'
import ScrumMaster from '../src/components/StoryList/StoryList'
import  { FirebaseContext } from './Firebase';

function App() {
  return (
    <FirebaseContext.Consumer>
    {firebase => {
      return <div>I've access to Firebase and render something.</div>;
    }}
  </FirebaseContext.Consumer>
    // <Router>
    //   <Switch>
    //     <Route path="/scrum_master">
    //         <ScrumMaster />
    //     </Route>
    //     <Route path="/developer">
    //         <Developer />
    //     </Route>
    //     <Route path="/">
    //         <StoryList />
    //     </Route>
    //     </Switch>
    // </Router>
  );
}

export default App;
