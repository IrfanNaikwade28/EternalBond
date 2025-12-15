import React from "react";

const Footer = () => {
  return (
    <footer className="app-footer mt-auto py-3 bg-light border-top">
      <ul className="list-inline mb-2">
        <li className="list-inline-item">
          <a className="text-muted" href="#">Support</a>
        </li>
        <li className="list-inline-item">
          <a className="text-muted" href="#">Help Center</a>
        </li>
        <li className="list-inline-item">
          <a className="text-muted" href="#">Privacy</a>
        </li>
        <li className="list-inline-item">
          <a className="text-muted" href="#">Terms of Service</a>
        </li>
      </ul>
      <div className="text-muted small">Copyright © 2025. All rights reserved.</div>
    </footer>
  );
};

export default Footer;
