import {Route, Switch} from 'react-router-dom'
import Home from './components/Home'
import NotFound from './components/NotFound'
import City from './components/City'
import './App.css'

const App = () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/city/:name" component={City} />
    <Route component={NotFound} />
  </Switch>
)

export default App
