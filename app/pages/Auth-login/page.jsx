"use client";
import "../../styles/login.css";
import React from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function page() {
  return (
    <>
      <main>
        <h1>Welcome to Qatar University's CSE Resgistration system</h1>

        <div>
        <form id="form">
          <div className="form-group">
            <p id="usertype">Please choose user type...</p>
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
