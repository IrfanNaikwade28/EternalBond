import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";

function ProfileViews() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [viewers, setViewers] = useState({});
  const [activeView, setActiveView] = useState({ userId: null, data: [] });

  const fetchProfiles = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/profile-views?page=${page}&search=${search}`
    );
    setProfiles(res.data.data);
  };

  useEffect(() => {
    fetchProfiles();
  }, [page, search]);

const handleViewClick = async (profileId) => {
  if (activeView.userId === profileId) {
    // Close the current viewers if clicked again
    setActiveView({ userId: null, data: [] });
    return;
  }

  try {
    const res = await axios.get(
      `http://localhost:5000/api/profile-views/viewers/${profileId}`
    );
    setActiveView({ userId: profileId, data: res.data.data });
  } catch (error) {
    console.error(error);
  }
};


  return (
    <div className="main-content">
      <div className="page-content">
        <div className="container-fluid">
          
          <h3 className="mb-4">Profile Views</h3>

          <div className="card shadow-sm">
            <div className="card-header">
              <div className="d-flex col-md-12 col-lg-6 col-12 col-sm-12" style={{ gap: "10px" }}>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Search for names..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />

                <button 
                  className="btn btn-primary me-2" 
                  onClick={() => setPage(page - 1)} 
                  disabled={page === 1}
                >
                  Previous
                </button>

                <button 
                  className="btn btn-primary" 
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </button>
              </div>
            </div>

            <div className="card-body">
  <div className="table-responsive">
    <table className="table table-bordered table-striped text-center">
      <thead className="table-dark">
        <tr>
          <th>Profile Id</th>
          <th>User Name</th>
          <th>Mobile</th>
          <th>View</th>
        </tr>
      </thead>

      <tbody>
        {profiles.length > 0 ? (
          profiles.map((p) => (
            <React.Fragment key={p.UID}>
              <tr>
                <td>{p.UID}</td>
                <td>{p.Uname}</td>
                <td>{p.Umobile}</td>
                <td>
                  <button 
                    className="btn btn-info" 
                    onClick={() => handleViewClick(p.UID)}
                  >
                    View
                  </button>
                </td>
              </tr>

              {/* VIEWERS ROW */}
              {/* VIEWERS ROW */}
{activeView.userId === p.UID && (
  <tr>
    <td colSpan="4" className="p-3">
      <div className="card">
        <div className="card-header bg-light">
          <h6 className="mb-0">Profile viewers of {p.Uname}</h6>
        </div>
        <div className="card-body p-0">
          {activeView.data.length > 0 ? (
            activeView.data.map((v, index) => (
              <div key={v.viewer_id}>
                <div className="d-flex align-items-center p-3">
                  <img
                    src={v.viewer_profile}
                    alt={v.viewer_name}
                    width="50"
                    height="50"
                    className="rounded-circle me-3"
                    style={{ objectFit: "cover" }}
                  />
                  <div style={{ marginLeft: "10px" }}>
                    <p className="mb-1">
                      <strong>
                        {v.viewer_name} <span style={{ paddingLeft: "5px" }}>{"(" + v.viewer_id + ")"}</span>
                      </strong>
                    </p>
                    <p className="mb-0 text-muted">{v.viewer_mobile}</p>
                  </div>
                </div>
                {index !== activeView.data.length - 1 && <hr className="m-0" />}
              </div>
            ))
          ) : (
            <div className="p-3 text-center">
              <p className="mb-0">No views yet.</p>
            </div>
          )}
        </div>
      </div>
    </td>
  </tr>
)}

            </React.Fragment>
          ))
        ) : (
          <tr>
            <td colSpan="4">No Data Found</td>
          </tr>
        )}

       
      </tbody>

       <div className="row align-items-center">
                <div className="col-md-4 d-flex mt-2" style={{ gap: "10px" }}>
                  <button 
        className="btn btn-primary me-2" 
        onClick={() => setPage(page - 1)} 
        disabled={page === 1}
      >
        Previous
      </button>
      <button 
        className="btn btn-primary" 
        onClick={() => setPage(page + 1)}
      >
        Next
      </button>
                  </div></div>
    </table>

   
  </div>
</div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProfileViews;
