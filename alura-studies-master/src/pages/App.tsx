import React from 'react';
import Form from '../components/Form/Form';
import List from '../components/List/List';
import style from './App.module.scss';

function App() {
  return (
    <div className={style.appStyle}>
      <Form />
      <List />
    </div>
  );
}

export default App;
