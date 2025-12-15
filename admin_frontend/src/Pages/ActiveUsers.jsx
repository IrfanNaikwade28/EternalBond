import React, { useState, useEffect } from "react";
import axios from "axios";

const ActiveUsers = () => {
  const [searchText, setSearchText] = useState("");
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("success"); // success or error

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/active-users?page=${page}&search=${searchText}`
      );
      setUsers(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchText, page]);

  const deactivateUser = async (uid) => {
    const confirmAction = window.confirm("Do you want to deactivate this user?");
    if (!confirmAction) return;

    try {
      const res = await axios.post(
        "http://localhost:5000/api/active-users/update-status",
        { UID: uid }
      );

      if (res.data.success) {
        setMsg("User deactivated successfully!");
        setMsgType("success");
        fetchUsers(); // refresh list
      } else {
        setMsg("Deactivation failed!");
        setMsgType("error");
      }
    } catch (error) {
      console.error(error);
      setMsg("Server error");
      setMsgType("error");
    }

    // Auto-hide message after 3 seconds
    setTimeout(() => setMsg(""), 3000);
  };

  return (
    <div className="main-content">
      <div className="page-content">
        <div className="container-fluid">

          <h3 className="mb-4 text-center">Active Users</h3>

          

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
{/* Message above search box */}
          {msg && (
            <div className="row mb-2">
              <div className="col-12 text-center">
                <div
                  className="py-2 px-3 rounded"
                  style={{
                    display: "inline-block",
                    backgroundColor: msgType === "success" ? "green" : "red",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  {msg}
                </div>
              </div>
            </div>
          )}
            <div className="card-body">
              <div className="table-responsive">

                <table className="table table-bordered table-striped text-center">
                  <thead className="table-dark">
                    <tr>
                      <th>UID</th>
                      <th>User Name</th>
                      <th>Mobile</th>
                      <th>Gender</th>
                      <th>Activate</th>
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
                              onClick={() => deactivateUser(u.UID)}
                              style={{
                                color: "white",
                                width: "35px",
                                height: "35px",
                                borderRadius: "5px",
                                fontSize: "20px",
                                fontWeight: "bold",
                                lineHeight: "20px",
                                backgroundColor: "green", // red background for deactivate
                              }}
                            >
                              <i className="fas fa-check"></i>
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

                {/* Pagination bottom */}
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

        </div>
      </div>
    </div>
  );
};

export default ActiveUsers;
