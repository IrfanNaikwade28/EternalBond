import React, { useEffect, useState } from "react";
import axios from "axios";

function RenewPlanUsers() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 10;

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === "0000-00-00") return "---";
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const loadUsers = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/renew-plan-users?page=${page}`);
      setUsers(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [page]);

  return (
    <div className="main-content">
      <div className="page-content">
        <div className="container-fluid">

          <h3 className="mb-4">Renew Plan Users</h3>

          <div className="card shadow-sm">

            <div className="card-header">
              <div className="row align-items-center">
                <div className="col-md-6 d-flex" style={{ gap: "10px" }}>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Search for names..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button className="btn btn-primary me-2" onClick={() => setPage(page > 1 ? page - 1 : 1)}>Previous</button>
                  <button className="btn btn-primary" onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}>Next</button>
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
                      <th>Joining Date</th>
                      <th>Renew Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan="6">No Data Found</td>
                      </tr>
                    ) : (
                      users
                        .filter(u => u.Uname.toLowerCase().includes(search.toLowerCase()))
                        .map(u => (
                          <tr key={u.UID}>
                            <td>{u.UID}</td>
                            <td>{u.Uname}</td>
                            <td>{u.Umobile}</td>
                            <td>{u.gender}</td>
                            <td>{formatDate(u.jdate)}</td>
                            <td>{formatDate(u.extend_date)}</td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>

                <div className="mt-2">
                  Page {page} of {totalPages}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default RenewPlanUsers;
