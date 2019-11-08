import React from 'react';
import './App.css';

import StoryList from '../src/components/StoryList/StoryList'
import Developer from '../src/components/Developer/Developer'
import ScrumMaster from '../src/components/ScrumMaster/ScrumMaster'
import  { FirebaseContext } from './Firebase';

import {
  BrowserRouter,
  Switch,
  Route,
  Link
} from "react-router-dom";
import * as ROUTES from '../src/constants/routes'

class App extends React.Component {
  componentDidMount () {
  //   firebase.database().ref('scrum/').once('value', function (snapshot) {
  //     console.log(snapshot.val())
  // });

  // firebase.database().ref('scrum/').update({
  //   deneme: ['huloo', 'and'],
  // }).then((data)=>{
  //       //success callback
  //       console.log('data ' , data)
  //   }).catch((error)=>{
  //       //error callback
  //       console.log('error ' , error)
  //   })

  // firebase.database().ref('scrum/').set({
  //     deneme: ['csfjdgd', 'a', 'b'],
  // }).then((data)=>{
  //     //success callback
  //     console.log('data ' , data)
  // }).catch((error)=>{
  //     //error callback
  //     console.log('error ' , error)
  // })
  }
  render () {
   
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route exact path={ROUTES.POKER_PLANNING} component={StoryList} />
          <Route exact path={ROUTES.SCRUM_MASTER} component={ScrumMaster} />
          <Route exact path={ROUTES.DEVELOPER} component={Developer} />
        </Switch>
      </BrowserRouter>
      
    </div>
  //   <FirebaseContext.Consumer>
  //   {firebase => {
  //     return <div><StoryList firebase={firebase} /></div>;
  //   }}
  // </FirebaseContext.Consumer>
    // <Router>
    //   <Switch>
    //     <Route path="/scrum_master">
    //         <ScrumMaster />
    //     </Route>
    //     <Route path="/developer">
    //         <Developer />
    //     </Route>
    //     <Route path="/">
    //         
    //     </Route>
    //     </Switch>
    // </Router>
  );
  }
}

export default App;
