import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-section">
          <h3>QU Registration Portal</h3>
          <p>Qatar University - CSE Department</p>
        </div>
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <Link href="#">Academic Calendar</Link>
            </li>
            <li>
              <Link href="#">University Website</Link>
            </li>
            <li>
              <Link href="#">CSE Department</Link>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Contact</h3>
          <p>Email: cse-support@qu.edu.qa</p>
          <p>Phone: +974 4403-5555</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Qatar University. All rights reserved.</p>
      </div>
    </footer>
  );
}
