import React, { useEffect, useState } from "react";
import axios from "axios";

function ExpiryPlanUsers() {
  const [allUsers, setAllUsers] = useState([]); // FULL DATA
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filterOption, setFilterOption] = useState("");

  const limit = 10;

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === "0000-00-00") return "---";
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, "0")}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}-${d.getFullYear()}`;
  };

  // Add 1 year
  const addOneYear = (dateStr) => {
    if (!dateStr) return null;
    const safeDateStr = dateStr.replace(" ", "T");
    const d = new Date(safeDateStr);
    d.setFullYear(d.getFullYear() + 1);
    return d;
  };

  const normalizeDate = (d) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());

  // Load FULL DATA only once
  const loadAllUsers = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/expiry-plans?page=1&limit=99999`
      );

      const sortedData = res.data.data.sort(
        (a, b) => new Date(b.jdate) - new Date(a.jdate)
      );
      setAllUsers(sortedData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadAllUsers();
  }, []);

  // Extend expiry date
  const handleExtend = async (uid) => {
    try {
      await axios.put(`http://localhost:5000/api/expiry-plans/extend/${uid}`);
      alert("Extend date updated successfully!");
      loadAllUsers(); // reload all again
    } catch (err) {
      console.log(err);
    }
  };

  // Filter by expiry
  const filterByExpiry = (expiryDate) => {
    if (!filterOption) return true;

    const normalizedExpiry = normalizeDate(expiryDate);
    const today = normalizeDate(new Date());

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const weekStart = new Date(today);
    const weekEnd = new Date(today);
    weekEnd.setDate(today.getDate() + 7);

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    switch (filterOption) {
      case "today":
        return normalizedExpiry.getTime() === today.getTime();
      case "tomorrow":
        return normalizedExpiry.getTime() === tomorrow.getTime();
      case "week":
        return normalizedExpiry >= weekStart && normalizedExpiry <= weekEnd;
      case "month":
        return normalizedExpiry >= monthStart && normalizedExpiry <= monthEnd;
      default:
        return true;
    }
  };

  // ============================
  // FILTER FULL DATA FIRST
  // ============================
  const filteredUsers = allUsers
    .filter((u) =>
      u.Uname.toLowerCase().includes(search.toLowerCase())
    )
    .filter((u) => filterByExpiry(addOneYear(u.jdate)));

  // ============================
  // PAGINATE FILTERED DATA
  // ============================
  const totalPages = Math.ceil(filteredUsers.length / limit);
  const start = (page - 1) * limit;
  const paginatedUsers = filteredUsers.slice(start, start + limit);

  return (
    <div className="main-content">
      <div className="page-content">
        <div className="container-fluid">
          <h3 className="mb-4">Expiry Plan Users</h3>

          <div className="card shadow-sm">
            <div className="card-header">
              <div className="row align-items-center">
                <div className="col-md-8 d-flex" style={{ gap: "10px" }}>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Search for names..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                  />

                  <select
                    className="form-control"
                    value={filterOption}
                    onChange={(e) => {
                      setFilterOption(e.target.value);
                      setPage(1);
                    }}
                  >
                    <option value="">All</option>
                    <option value="today">Expiring Today</option>
                    <option value="tomorrow">Expiring Tomorrow</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                </div>
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
                      <th>Gender</th>
                      <th>Joining Date</th>
                      <th>Expiry Date</th>
                      <th>Extend Date</th>
                      <th>Extend</th>
                      <th>Active</th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedUsers.map((u) => {
                      const expiryDate = addOneYear(u.jdate);
                      return (
                        <tr key={u.UID}>
                          <td>{u.UID}</td>
                          <td>{u.Uname}</td>
                          <td>{u.Umobile}</td>
                          <td>{u.gender}</td>
                          <td>{formatDate(u.jdate)}</td>
                          <td>{formatDate(expiryDate)}</td>
                          <td>{formatDate(u.extend_date)}</td>
                          <td>
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => handleExtend(u.UID)}
                            >
                              Extend
                            </button>
                          </td>
                          <td>
                            {u.status === 1 ? (
                              <i
                                className="fa fa-check-circle"
                                style={{ color: "green", fontSize: "22px" }}
                              ></i>
                            ) : (
                              <i
                                className="fa fa-times-circle"
                                style={{ color: "red", fontSize: "22px" }}
                              ></i>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="mt-2">
                  <button
                    className="btn btn-primary me-2"
                    onClick={() => setPage(page > 1 ? page - 1 : 1)}
                  >
                    Prev
                  </button>

                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      setPage(page < totalPages ? page + 1 : totalPages)
                    }
                  >
                    Next
                  </button>

                  <div className="mt-2">
                    Page {page} of {totalPages}
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

export default ExpiryPlanUsers;
