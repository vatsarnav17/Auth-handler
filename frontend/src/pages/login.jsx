import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../../utils';

function Login() {
  const [loginInfo, setloginInfo] = useState({
    
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    const copylogininfo = {...loginInfo};
    copylogininfo[name] = value;
    setloginInfo(copylogininfo);
  };

  const handlelogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;

    // Basic front-end validation
    if ( !email || !password) {
      return handleError(' email, and password are required');
    }

    try {
      const url = "http://localhost:8080/auth/login";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginInfo)
      });

      // Check if response status is OK (2xx)
      if (!response.ok) {
        const errorData = await response.json();
        return handleError(errorData.message || 'Failed to login');
      }

      const result = await response.json();
      const { success, message, jwtToken,name, error } = result;

      if (success) {
        handleSuccess(message);
        localStorage.setItem('token',jwtToken);
        setTimeout(() => {
          navigate('/home')
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
    <div className="container">
      <h1>LogIn</h1>
      <form onSubmit={handlelogin}>
        
        <div>
          <label htmlFor="email">Email</label>
          <input
            onChange={handleChange}
            type="email"  // Changed to 'email' for better validation
            name="email"
            placeholder="Enter your email"
            value={loginInfo.email}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            onChange={handleChange}
            type="password"
            name="password"
            placeholder="Enter your password"
            value={loginInfo.password}
            autoComplete="current-password"  // Added for better UX
          />
        </div>
        <button type="submit">Log In</button>
        <span>
         Don't have an account? <Link to="/SignUp">SignUp</Link>
        </span>
      </form>
      <ToastContainer />
    </div>
  );
}

export default Login;
