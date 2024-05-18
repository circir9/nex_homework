import React from 'react';
import {HashRouter,Route,Routes} from "react-router-dom";
import EmployeePage from "./page/EmployeePage";

function App() {
  return (
    <HashRouter>
        <Routes>
            <Route exact={true} path="/" element={
              <EmployeePage />
            }/>
        </Routes>
    </HashRouter>
  );
}

export default App;
