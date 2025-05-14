import React, { useEffect, useInsertionEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom'
import './home.css';
import axios from 'axios';

function home() {
  const[loggedInUser,setLoggedInUser] = useState('');
  useEffect(()=>{
    setLoggedInUser(localStorage.getItem('loggedInUser'))
  },[])

  const[users,setUsers] = useState([]);
  useEffect(()=>{
    axios.get('http://localhost:8080/home')
    .then(users => setUsers(users.data))
    .catch(err=>console.log(err))
  },[])

  const navigate = useNavigate();

  const handleLogout= (e) => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    setTimeout(()=>{
      navigate('/login')
    },1000)
  }

  return (
    <div>
      <h1>{loggedInUser}</h1>
      
      
  <button onClick={handleLogout}>LogOut</button>
  <div className="user-cards-container">
  {users.length > 0 ? (
    users.map((user, index) => (
      <div className="user-card" key={index}>
        <img src="/assets/vite.svg"/>
        <h3>Name : {user.name}</h3>
        <h3>email : {user.email}</h3>
        <h3>Location : {user.location}</h3>
      </div>
    ))
  ) : (
    <div className="no-users">
      <p>No users found</p>
    </div>
  )}
  </div>
    </div>
  )
}

export default home;
