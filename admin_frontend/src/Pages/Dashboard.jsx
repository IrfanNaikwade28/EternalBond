import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [userStats, setUserStats] = useState({
    total: 0,
    totalGirls: 0,
    totalBoys: 0,
  });

  const [totalStories, setTotalStories] = useState(0);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Users stats
        const userRes = await axios.get("http://localhost:5000/api/dashboard/users");
        setUserStats(userRes.data);

        // Success stories count
        const storyRes = await axios.get("http://localhost:5000/api/dashboard/success-stories");
        setTotalStories(storyRes.data.totalStories);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="main-content">
      <div className="page-content">
        <div className="container-fluid">

          {/* Start Page Title */}
          <div className="row">
            <div className="col-12">
              <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                <h4 className="mb-sm-0">Matrimony</h4>
                <div className="page-title-right">
                  <ol className="breadcrumb m-0">
                    <li className="breadcrumb-item">
                      <a href="#">Dashboard</a>
                    </li>
                    <li className="breadcrumb-item active">Matrimony</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          {/* Card Section */}
          <div className="row">

            {/* Total Registration */}
            <div className="col-xl-3 col-md-6">
              <div className="card card-animate">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1 overflow-hidden">
                      <p className="text-uppercase fw-medium text-muted text-truncate mb-0">
                        Total Registration
                      </p>
                    </div>
                  </div>
                  <div className="d-flex align-items-end justify-content-between mt-4">
                    <div>
                      <h4 className="fs-22 fw-semibold ff-secondary mb-4">
                        {userStats.total}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Girls */}
            <div className="col-xl-3 col-md-6">
              <div className="card card-animate">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1 overflow-hidden">
                      <p className="text-uppercase fw-medium text-muted text-truncate mb-0">
                        Total Girls Register
                      </p>
                    </div>
                  </div>
                  <div className="d-flex align-items-end justify-content-between mt-4">
                    <div>
                      <h4 className="fs-22 fw-semibold ff-secondary mb-4">
                        {userStats.totalGirls}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Boys */}
            <div className="col-xl-3 col-md-6">
              <div className="card card-animate">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1 overflow-hidden">
                      <p className="text-uppercase fw-medium text-muted text-truncate mb-0">
                        Total Boys Register
                      </p>
                    </div>
                  </div>
                  <div className="d-flex align-items-end justify-content-between mt-4">
                    <div>
                      <h4 className="fs-22 fw-semibold ff-secondary mb-4">
                        {userStats.totalBoys}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Success Story */}
            <div className="col-xl-3 col-md-6">
              <div className="card card-animate">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1 overflow-hidden">
                      <p className="text-uppercase fw-medium text-muted text-truncate mb-0">
                        Total Success Story
                      </p>
                    </div>
                  </div>
                  <div className="d-flex align-items-end justify-content-between mt-4">
                    <div>
                      <h4 className="fs-22 fw-semibold ff-secondary mb-4">
                        {totalStories}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;
