import React, { useEffect } from 'react';
import Header from './component/header/header';
import Footer from './component/footer/footer';
import Content from './component/content/Content';
import './App.scss'



function App() {
  return (
    <>

      <Header />
      <Content></Content>
      <Footer />

    </>
  );
}

export default App;