import React, { useState } from 'react';
import './LoginSignup.css';
import Validation from './Validation.js';
import axios from "axios";
import {Link} from 'react-router-dom';
import {useNavigate} from 'react-router-dom';

function Signup() {
  
  const [values,setValues] = useState({
    name: '',
    profession: '',
    email: '',
    password: '',
  })
  const nav = useNavigate();
  const [errors, setErrors] = useState({});

  const handleInput = (event) => {
    setValues(prev => ({...prev, [event.target.name]: [event.target.value]}))
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors(Validation(values));
    if(errors.email === "" && errors.password === "") {
      axios.post("http://localhost:8081/signup", values)
      .then(res => {
        nav('/');
      })
      .catch(err => console.log(err));
    }
  }

  return (
    <div className="form-container">
      <div className="form-header">
        <div className="text">Sign Up</div>
        <div className="underline"></div>
      </div>
      <form action="" onSubmit={handleSubmit}>
        <div className="inputs">
          <input type="text" placeholder="Name" name="name" onChange={handleInput} required />
          <input type="text" placeholder="Profession" name="profession" onChange={handleInput} required />
          <input type="email" placeholder="Email" name="email" onChange={handleInput} required />
          {errors.email && <span className="error">{errors.email}</span>}
          <input type="password" placeholder="Password" name="password" onChange={handleInput} required />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>
        <div className="submit-container">
          <button type="submit" className="submit">Sign Up</button>
          <Link to="/" className="submit gray">Login</Link>
        </div>
      </form>
    </div>
  );
}

export default Signup;