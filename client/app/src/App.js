import { Route, Switch } from 'wouter'

import Login from './components/Login'
import Home from './components/Home'
import Register from './components/Register';

function App() {
  return (
    <Switch>
      <Route path="/register" component={Register} />
      <Route path="/login" component={Login} />
      <Route path="/" component={Home} />
      <Route>404, Not Found!</Route>
    </Switch>
  );
}

export default App;
