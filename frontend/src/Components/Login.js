import React, { useState } from 'react';
import './LoginSignup.css';
import Modal from 'react-modal';
import Validation from './Validation.js';
import axios from "axios";
import {Link} from 'react-router-dom';
import {useNavigate} from 'react-router-dom';

function Login() {

  const [values,setValues] = useState({
    email: '',
    password: ''
  })

  const nav = useNavigate();
  axios.defaults.withCredentials = true;

  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loginError, setLoginError] = useState(null);

  const handleInput = (event) => {
    setValues(prev => ({...prev, [event.target.name]: [event.target.value]}))
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors(Validation(values));
  
    try {
      const response = await axios.post("http://localhost:8081/login", values);
      if (response.data === "Success") {
        nav('/homepage');
      } else {
        setLoginError('No account found!');
        setIsModalOpen(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <div className="text">Login</div>
        <div className="underline"></div>
      </div>
      {loginError && (
        <Modal isOpen={isModalOpen} onRequestClose={closeModal} className="login-modal">
          <div>{loginError}</div>
          <button onClick={closeModal}>Close</button>
        </Modal>
      )}
      <form action="" onSubmit={handleSubmit}>
        <div className="inputs">
          <input type="email" name="email" placeholder="Email" onChange={handleInput} required />
          {errors.email && <span className="error">{errors.email}</span>}
          <input type="password" name="password" placeholder="Password" onChange={handleInput} required />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>
        <div className="submit-container">
          <Link to="/signup" className="submit gray">Sign Up</Link>
          <button type="submit" className="submit">Login</button>
        </div>
      </form>
    </div>
  );
}

export default Login;