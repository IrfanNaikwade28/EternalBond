import React from "react";
//#c6a899

import { useNavigate } from "react-router-dom";
export function ExperienceSection() {
   const navigate = useNavigate();
   const goRegister = () => {
    navigate("/Register");   // 👉 Login page पर redirect
  };
  return (
    <>
      <style>{`
        .exp-section {
          display: flex;
          align-items: center;
          justify-content: space-between; /* SPACE BETWEEN ADDED */
          background-color: #d6865eff;
          height:500px
          width: 100%;
        }

        .exp-left {
          width: 55%;
          color: white;
        }

        .exp-title {
          font-size: 36px;
          font-weight: 700;
          margin-bottom: 15px;
        }

        .exp-desc {
          font-size: 16px;
          margin-bottom: 25px;
        }

        .exp-list {
          list-style: none;
          padding: 0;
        }

        .exp-list li {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
          font-size: 16px;
        }

        .exp-list li span {
          color: #ffd700;
          font-size: 20px;
          margin-right: 10px;
        }

        .exp-image {
          width: 40%;
        }

        .exp-image img {
          width: 100%;
          border-radius: 10px;
          object-fit: cover;
          height: 600px;
        }

        .register-btn {
          background: white;
          border: 3px solid #d63384;
          padding: 10px 35px;
          border-radius: 25px;
          font-weight: 700;
          color: #d63384;
          cursor: pointer;
          margin-top: 20px;
          transition: 0.3s;
        }

        .register-btn:hover {
          background: #d63384;
          color: white;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .exp-section {
            flex-direction: column;
            padding: 40px;
          }

          .exp-left,
          .exp-image {
            width: 100%;
            text-align: center;
            object-fit:cover
          }

          .exp-list li {
            justify-content: center;
          }
        }
      `}</style>

      <div className="exp-section p-5">

        {/* LEFT SIDE CONTENT */}
        <div className="exp-left">
          <h2 className="exp-title">You Deserve A Matrimony Experience</h2>

          <p className="exp-desc">
            It is not how many you meet but who you meet. And we believe in
            giving you the best start.
          </p>

          <button onClick={goRegister} className="register-btn">REGISTER</button>

          <ul className="exp-list">
            <li><span >💛</span> Fits your busy lifestyle</li>
            <li><span>💛</span> Match reviews across multiple criteria</li>
            <li><span>💛</span> Phone-verified matches</li>
            <li><span>💛</span> Intelligent matchmaking</li>
            <li><span>💛</span> All interactions are private & secure</li>
            <li><span>💛</span> Experienced team backed by technology</li>
          </ul>
        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="exp-image">
          <img src="combo_pic2.jpg" alt="Matrimony Experience" />
        </div>

      </div>
    </>
  );
}
