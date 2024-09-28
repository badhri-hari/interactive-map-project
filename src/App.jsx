// Importing packages.
import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Specifying marker icon to show.
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

export default function App() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState({ Name: "", StudentId: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [noStudentsFound, setNoStudentsFound] = useState(false);
  const [showModal, setShowModal] = useState(false); // State for showing/hiding modal.
  const [newStudent, setNewStudent] = useState({
    Name: "",
    StudentId: "",
    RouteNo: "",
    Area: "",
    Address: "",
    Pickup: "",
    Drop: "",
    Grade: "",
    latitude: "",
    longitude: "",
    password: "",
  });
  const [addStudentError, setAddStudentError] = useState(false);

  const fetchStudents = async (params = {}) => {
    setLoading(true); // Starts displaying loading box.
    setError(false); // Reset error state when searching for students.
    setNoStudentsFound(false); // Reset the no students found state when searching for students.

    try {
      console.log("Fetching students with params:", params);
      const response = await axios.get("/api/students", {
        params,
      });
      const sortedStudents = response.data.sort((a, b) =>
        a.Name.localeCompare(b.Name)
      );
      setStudents(sortedStudents); // If no student found
      if (sortedStudents.length === 0) {
        setNoStudentsFound(true);
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSearch = () => {
    fetchStudents(search);
  };

  const handleAddStudent = async () => {
    // Form submission logic for adding a student
    if (newStudent.password !== "badhri") {
      setAddStudentError(true);
      return;
    }
    try {
      setAddStudentError(false);
      setShowModal(false); // Close modal on successful addition
      setNewStudent({
        Name: "",
        StudentId: "",
        RouteNo: "",
        Area: "",
        Address: "",
        Pickup: "",
        Drop: "",
        Grade: "",
        latitude: "",
        longitude: "",
        password: "",
      });
      fetchStudents(); // Fetch the updated students
    } catch (error) {
      setAddStudentError(true); // Show error inside modal
    }
  };

  const formatStudentId = (value) => {
    const cleanValue = value
      .replace(/[^a-zA-Z0-9]/g, "")
      .substring(0, 4)
      .toUpperCase();
    let formattedValue = "";

    if (cleanValue.length > 0) {
      formattedValue += cleanValue.substring(0, 2);
    }
    if (cleanValue.length > 2) {
      formattedValue += cleanValue.substring(2, 4);
    }

    return formattedValue;
  };

  return (
    <>
      <div className="app-container">
        <div className="intro-container">
          <h1>School Transport Students Map</h1>
        </div>
        <div className="search-container">
          {/* Search Inputs and Button */}
          <input
            type="text"
            placeholder="Student ID"
            className="search-input"
            value={search.StudentId}
            maxLength="4"
            onChange={(e) =>
              setSearch({
                ...search,
                StudentId: formatStudentId(e.target.value),
              })
            }
          />
          <input
            type="text"
            placeholder="Student Name"
            className="search-input"
            value={search.Name}
            onChange={(e) => setSearch({ ...search, Name: e.target.value })}
          />
          {/* Other search inputs */}
          <input
            type="number"
            placeholder="Route"
            className="search-input"
            min="1"
            onChange={(e) =>
              setSearch({ ...search, RouteNo: Number(e.target.value) })
            }
          />
          <input
            type="text"
            placeholder="Area"
            className="search-input"
            onChange={(e) => setSearch({ ...search, Area: e.target.value })}
          />
          <input
            type="text"
            placeholder="Address"
            className="search-input"
            onChange={(e) => setSearch({ ...search, Address: e.target.value })}
          />
          <button className="search-button" onClick={handleSearch}>
            Search
          </button>
          {error && <div className="error-message">Error fetching data</div>}
          {noStudentsFound && (
            <div className="error-message">No students found</div>
          )}
        </div>

        {/* Map and Student Markers */}
        {loading && (
          <div className="loading-overlay">
            <div className="loading-container">
              <div className="loading-text">Loading map...</div>
            </div>
          </div>
        )}
        <MapContainer
          center={[12.99520434846565, 80.25563741504301]}
          zoom={10}
          className="map-container"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {students.map(
            (student, index) =>
              student.latitude &&
              student.longitude && (
                <Marker
                  key={index}
                  position={[student.latitude, student.longitude]}
                >
                  <Popup>
                    {/* Popup content */}
                    <div className="popup-intro-container">
                      <p className="popup-text">
                        <strong>
                          {student.Name} ({student.StudentId})
                        </strong>
                      </p>
                      <div className="popup-text student-grade">
                        {student.Grade}
                      </div>
                    </div>
                    <div className="popup-text-container">
                      <p className="popup-text">
                        <strong>
                          <u>Route Number:</u>
                        </strong>{" "}
                        {student.RouteNo}
                      </p>
                      <p className="popup-text">
                        <strong>
                          <u>Address:</u>
                        </strong>{" "}
                        {student.Address}
                      </p>
                      <p className="popup-text">
                        <strong>
                          <u>Pickup Time:</u>
                        </strong>{" "}
                        {student.Pickup}
                      </p>
                      <p className="popup-text">
                        <strong>
                          <u>Drop Time:</u>
                        </strong>{" "}
                        {student.Drop}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              )
          )}
        </MapContainer>

        {/* Add Student Button */}
        <button
          className="add-student-button"
          onClick={() => setShowModal(true)}
        >
          Add a Student
        </button>

        {/* Modal for Adding a Student */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div
              className="modal-container"
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Add a New Student</h2>
              <input
                type="text"
                placeholder="Name"
                className="search-input"
                value={newStudent.Name}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, Name: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Student ID"
                className="search-input"
                value={newStudent.StudentId}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, StudentId: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Route No"
                className="search-input"
                value={newStudent.RouteNo}
                min="1"
                onChange={(e) =>
                  setNewStudent({ ...newStudent, RouteNo: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Area"
                className="search-input"
                value={newStudent.Area}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, Area: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Address"
                className="search-input"
                value={newStudent.Address}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, Address: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Pickup Time"
                className="search-input"
                value={newStudent.Pickup}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, Pickup: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Drop Time"
                className="search-input"
                value={newStudent.Drop}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, Drop: e.target.value })
                }
              />
              <input
                type="password"
                placeholder="Password"
                className="search-input"
                value={newStudent.password}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, password: e.target.value })
                }
              />
              {addStudentError && (
                <div className="error-message">
                  Error adding student. Please check the password.
                </div>
              )}
              <button className="search-button" onClick={handleAddStudent}>
                Add Student
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
