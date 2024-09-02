import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Mynavbar from './components/navbar';
import Users from './components/users';

function App() {
  return (
    <>
    <div>
      <Mynavbar />
    </div>
     <div>
     <Users />
   </div>
   </>
  );
}

export default App;