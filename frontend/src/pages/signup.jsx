import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../../utils';
import './signup.css';

function Signup() {
  const [signupInfo, setSignupInfo] = useState({
    name: '',
    email: '',
    location: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupInfo({ ...signupInfo, [name]: value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, location, password } = signupInfo;

    // Basic front-end validation
    if (!name || !email || !password ||!location) {
      return handleError('All the fileds are mandatory !');
    }

    try {
      const url = "http://localhost:8080/auth/signup";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(signupInfo)
      });

      // Check if response status is OK (2xx)
      if (!response.ok) {
        const errorData = await response.json();
        return handleError(errorData.message || 'Failed to signup');
      }

      const result = await response.json();
      const { success, message, error } = result;

      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate('/login')
        }, 1000)
      }
        else if(error){
          const details = error?.details[0].message;
          handleError(details);
        }
      console.log(result); 
    } catch (err) {
      handleError(err);
    }
  };

  return (
  <>
    <div className="container">
      
      <form onSubmit={handleSignup}>
        <h1 className='form-title'>Signup</h1>
        <div className="unit">
        <div className='nm'>
          <label htmlFor="name">Name</label>
          <br/>
          <input
            onChange={handleChange}
            type="text"
            name="name"
            autoFocus
            placeholder="Enter Your Name !"
            value={signupInfo.name}
          />
        </div>
        <div className='em'>
          <label htmlFor="email">Email</label>
          <br/>
          <input
            onChange={handleChange}
            type="email"  // Changed to 'email' for better validation
            name="email"
            placeholder="Enter your email"
            value={signupInfo.email}
          />
        </div>
        <div className='loc'>
          <label htmlFor="location">Location</label>
          <br/>
          <input
            onChange={handleChange}
            type="location"
            name="location"
            placeholder="Current Location"
            value={signupInfo.location}
            autoComplete="current-location"  // Added for better UX
          />
        </div>
        <div className='ps'>
          <label htmlFor="password">Password</label>
          <br/>
          <input
            onChange={handleChange}
            type="password"
            name="password"
            placeholder="Enter your password"
            value={signupInfo.password}
            autoComplete="current-password"  // Added for better UX
          />
        </div>
        <button type="submit">Sign Up</button>
        <span>
          Already have an account? <Link to="/login">Login</Link>
        </span>
        </div>
      </form>
      <ToastContainer />
    </div>
  </>
  );
}

export default Signup;
