import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import ResetPasswordForm from './ResetPasswordForm';
// import ResetNewPasswordForm from './UpdateNewPass';
// import FistComponent from './test/firstComponent';
// import RenameUser from './test/renameUser';
// import UserManagement from './test/userManagement';
import ProductsManagement from './views/test/productsManagement';
// import Products from './test/listProducts';
import Header from './views/test/header/header';
import Auth from './views/test/auth/auth';




function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          {/* <Route path="" element={<><FistComponent /> <RenameUser /></>} /> */}
          {/* <Route path="/products" element={<><Products /></>} /> */}
          {/* <Route path="/user/management" element={<><UserManagement /></>} /> */}
          <Route path="/products/management" element={<><ProductsManagement /></>} />
          {/* <Route path="/password/reset" element={<ResetPasswordForm />} /> */}
          {/* <Route path="/update-new-pass" element={<ResetNewPasswordForm />} /> */}
          <Route path="/auth" element={<><Auth /></>} />
          {/* Các route khác trong ứng dụng của bạn */}
        </Routes>
      </Router>
    </>
  );
}

export default App;