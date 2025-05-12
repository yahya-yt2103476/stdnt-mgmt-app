"use client";
import "../../styles/login.css";
import React from "react";
import { signIn } from "next-auth/react";

export default function page() {

  const handleLogin = async (e) => {
    e.preventDefault();
  
    const email = e.target.email.value;
    const password = e.target.password.value;
    const usertype = e.target.usertype.value;
  
    const result = await signIn("credentials", {
      redirect: false, 
      email,
      password,
      usertype,
      callbackUrl: "/pages/statistics-dashboard", 
    });
  
    if (!result.ok) {
      alert("Login failed. Please check your credentials.");
    }else if (result.ok) {
      alert("Login successful!");
      window.location.href = "/pages/statistics-dashboard";

    }
    
    //this should be implemented to redirct the user to the correct page. for now, it goes directly to the admins dashboard
    
    // else if (usertype == "admin") {
    //   alert("Login successful!");
    //   // window.location.href = "/pages/statistics-dashboard";
      
    // }else if (usertype == "instructor") {
    //   alert("Login successful!");
    //   // window.location.href = "/pages/statistics-dashboard";
    // }
    // else if (usertype == "student") {
    //   alert("Login successful!");
    //   // window.location.href = "/pages/statistics-dashboard"; 
    // }
  };

  return (
    <>
      <main>
        <h1>Welcome to Qatar University's CSE Resgistration system</h1>

        <div>
        <form id="form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">
              <p>Email:</p>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="e.g. Student@qu.edu.qa"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">
              <p>Password:</p>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              placeholder="e.g. Pass123"
            />
          </div>
          <div className="form-group">
            <label htmlFor="usertype">
              <p>user type:</p>
            </label>
            <input
              type="text"
              id="usertype"
              name="usertype"
              required
              placeholder="e.g. Admin, Instructor, Student"
            />
          </div>
          <div className="form-group">
            <button type="submit">Sign in</button>
          </div>
          <p id="indicator">Incorrect Email/Password</p>
          <div className="github-login">
          <button onClick={() => signIn("github", { callbackUrl: "/pages/statistics-dashboard" })}>
            <img src="/assets/Github-logo.png" width="40" height="40" alt="GitHub" padding="5"/>
            <span>Sign in with GitHub</span>
          </button>
          </div>
        </form>
        
        </div>
        
      </main>
    </>
  );
}
