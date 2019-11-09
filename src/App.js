import React from 'react';
import {
  BrowserRouter,
  Switch,
  Route,
} from "react-router-dom";
import StoryList from '../src/components/StoryList/StoryList'
import Developer from '../src/components/Developer/Developer'
import ScrumMaster from '../src/components/ScrumMaster/ScrumMaster'

import * as ROUTES from '../src/routes/routes'
import './App.scss';

class App extends React.Component {
  render () {
    return (
      <div className='main-wrapper'>
        <BrowserRouter>
          <Switch>
            <Route exact path={ROUTES.POKER_PLANNING} component={StoryList} />
            <Route exact path={ROUTES.SCRUM_MASTER} component={ScrumMaster} />
            <Route exact path={ROUTES.DEVELOPER} component={Developer} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
