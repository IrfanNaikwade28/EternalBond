import React, { useState, useEffect } from "react";
import axios from "axios";

function ExtendPlan() {
  const [searchText, setSearchText] = useState("");
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);

  const fetchUsers = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/extendviewcount?page=${page}&search=${searchText}`
    );
    setUsers(res.data.data);
  };

  useEffect(() => {
    fetchUsers();
  }, [searchText, page]);

  const handleSearch = (value) => {
    setSearchText(value);
    setPage(1);
  };
const addCount = async (uid) => {
  const res =await axios.put(`http://localhost:5000/api/extendviewcount/add/${uid}`);
  alert(res.data.message);
  fetchUsers(); // refresh after update
};
  return (
    <div className="main-content">
      <div className="page-content">
        <div className="container-fluid">

          <h3 className="mb-4">Extend View Count</h3>

          <div className="card shadow-sm">

            <div className="card-header">
              <div className="row align-items-center">

                <div className="d-flex col-md-12 col-lg-6 col-12 col-sm-12" style={{ gap: "10px" }}>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Search for names..."
                    value={searchText}
                    onChange={(e) => handleSearch(e.target.value)}
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
                      <th>View Count</th>
                      <th>Profile View Count</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.length > 0 ? (
                      users.map((u) => (
                        <tr key={u.UID}>
                          <td>{u.UID}</td>
                          <td>{u.Uname}</td>
                          <td>{u.Umobile}</td>
                          <td>{u.viewcount}</td>
                          <td>{u.Profile_viewcount}</td>

                          {/* ACTION BUTTON GREEN BOX */}
                          <td>
  <button
    className="btn btn-primary"
    onClick={() => addCount(u.UID)}
    style={{
      //backgroundColor: "green",
      color: "white",
      width: "35px",
      height: "35px",
      borderRadius: "5px",
      fontSize: "20px",
      fontWeight: "bold",
      lineHeight: "20px",
    }}
  >
    +
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
 <div className="row align-items-center">
                <div className="col-md-8 d-flex mt-2" style={{ gap: "10px" }}>
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
                </table>
   
              </div>
            </div>


          </div>

        </div>
      </div>
    </div>
  );
}

export default ExtendPlan;
