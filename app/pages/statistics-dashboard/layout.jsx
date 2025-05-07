import React from 'react'
import NavBar from "../../components/NavBar.jsx"
export default function Layout({children}) {
  return (
    <>
    <NavBar></NavBar>
    {children}
    </>
  )
}
