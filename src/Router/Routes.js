import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from '../Pages/Home';
import ReadToken from '../Components/ReadToken';
import ReadLink from '../Components/ReadLink';
import ReadLinkPublic from '../Components/ReadLinkPublic';
import Callback from '../callback';
import Refresh from '../refresh';
import Auth from '../Pages/Auth';

const PageNotFound = () => <div>Page not found123</div>;

const Routes = () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route exact path="/auth" component={Auth} />
    <Route path="/callback.html" component={Callback} />
    <Route exact path="/updatetoken.html" component={Refresh} />
    <Route exact path="/app" component={ReadToken} />
    <Route exact path="/web/project" component={ReadLink} />
    <Route exact path="/web/public" component={ReadLinkPublic} />
    <Route component={PageNotFound} />
  </Switch>
);

export default Routes;
