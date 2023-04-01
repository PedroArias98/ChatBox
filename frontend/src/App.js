import Button from '@mui/material/Button'
import { Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { Chat } from './pages/Chat'
import { Login } from './pages/Login'


import "./App.css";
function App() {
  return (
    <div className="App">
      <Route path='/' component={Home} exact />
      <Route path='/login' component={Login} />
      <Route path='/chats' component={Chat} />

    </div>
  );
}

export default App;
