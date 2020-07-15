import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

  const [ texto, setTexto ] = useState("1111");



  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Texto: {texto}.
        </p>
        <button onClick={()=>setTexto("asd")}>Cambiar texto</button>
      </header>
    </div>
  );
}

export default App;
