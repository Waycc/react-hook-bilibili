import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import routes from './routes'

function NestRoutes() {
  return (
    <Switch>
      {
        routes.map(route => (
          <Route
            key={route.path}
            exact={route.exact === undefined ? true : route.exact}
            component={route.component}
            path={route.path}
          />
        ))
      }
      <Redirect from={'/'} to={'/index'} exact={true}/>
    </Switch>
  )
}

export default NestRoutes
