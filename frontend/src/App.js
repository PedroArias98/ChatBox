import Button from '@mui/material/Button'
import { Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { Chat } from './pages/Chat'
import { Login } from './pages/Login'
import { VideoCall } from './pages/VideoCall'


import "./App.css";
function App() {
  return (
    <div className="App">
      <Route path='/' component={Home} exact />
      <Route path='/login' component={Login} />
      <Route path='/chats' component={Chat} />
      <Route path='/video' component={VideoCall} />

    </div>
  );
}

export default App;
