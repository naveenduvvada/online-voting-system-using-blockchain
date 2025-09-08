
import React from 'react';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Home from './components/Home.js';
import AdminDashboard from './components/AdminDashboard.js';
import Voters from './components/Voters.js';
import VoterRegistration from './components/VoterRegistration.js';
import 'react-toastify/dist/ReactToastify.css';
import CandidateManagement from './components/CandidateManagement.js';
import VotersLogin from "./components/VoterLogin.js";
import Result from './components/Result.js';

const App = () =>(
  <BrowserRouter>
    <Routes>
      <Route path = "/" element = {<Home/>}/>
      <Route path = "/admin/:id" element = {<AdminDashboard/>}/>
      <Route path = "/voters" element = {<Voters/>}/>
      <Route path = "/voter-registration" element = {<VoterRegistration/>}/>
      <Route path = "/login" element =  {<VotersLogin/>}/>
      <Route path = "/res" element = {<Result/>}/>
    </Routes>
  </BrowserRouter>
)
export default App;
