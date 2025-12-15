import React, { useState, useEffect } from "react";
import axios from "axios";
import Bio from "./Bio";


const BioData = () => {
  const [searchText, setSearchText] = useState("");
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null); // Selected user for biodata

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/biodata-users?page=${page}&search=${searchText}`
      );
      setUsers(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchText, page]);

  return (
    <div className="main-content">
      <div className="page-content">
        <div className="container-fluid">
          {/* <h3 className="mb-4 text-center">Biodata Users</h3> */}

          {!selectedUser ? (
            <div className="card shadow-sm">
              <div className="card-header">
                <div className="row align-items-center">
                  <div className="d-flex col-md-12 col-lg-6 col-12 col-sm-12" style={{ gap: "10px" }}>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Search for names..."
                      value={searchText}
                      onChange={(e) => {
                        setSearchText(e.target.value);
                        setPage(1);
                      }}
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
              </div>

              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-bordered table-striped text-center">
                    <thead className="table-dark">
                      <tr>
                        <th>UID</th>
                        <th>User Name</th>
                        <th>Mobile</th>
                        <th>Gender</th>
                        <th>View Biodata</th>
                      </tr>
                    </thead>

                    <tbody>
                      {users.length > 0 ? (
                        users.map((u) => (
                          <tr key={u.UID}>
                            <td>{u.UID}</td>
                            <td>{u.Uname}</td>
                            <td>{u.Umobile}</td>
                            <td>{u.Gender}</td>
                            <td>
                              <button
                                className="btn"
                                onClick={() => setSelectedUser(u)} // Open Biodata
                                style={{
                                  color: "green",
                                  width: "35px",
                                  height: "35px",
                                  borderRadius: "5px",
                                  fontSize: "20px",
                                  fontWeight: "bold",
                                  lineHeight: "20px",
                                }}
                              >
                                <i className="fas fa-eye"></i>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6">No Data Found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  {/* Pagination */}
                  <div className="col-md-6 mt-3 d-flex" style={{ gap: "10px" }}>
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
              </div>
            </div>
          ) : (
            <div>
              {/* Back button */}
              <button
                className="btn btn-secondary mb-3"
                onClick={() => setSelectedUser(null)}
              >
                ← Back to Users List
              </button>

              {/* Render Biodata */}
              <Bio user={selectedUser} uid={selectedUser.UID} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BioData;
