import { useEffect, useState } from "react";
import MentorCard from "../components/MentorCard";
import ReactPaginate from "react-paginate";
import axios from "axios";

// remove mentors_ and allTags aguments when api is live
// TODO Remove API_URL
// const API_URL = "http://localhost:5000";

export default function ExploreMentor({ mentors_, demoTags }) {
  const [mentors, setMentors] = useState(mentors_);
  const [searchTerm, setSearchTerm] = useState("");
  const [allTags, setAllTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [aiFilter, setAiFilter] = useState(""); // For AI input
  const [currentPage, setCurrentpage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filterDropdownVisibility, setFilterDropdownVisibility] =
    useState(false);
  const itemsPerPage = 10;

// <<<<<<< hv6
//   useEffect(() => {
//     // fetch cards from backend by api
//     async function fetchMentors() {
//       const responce = await axios.get(`${API_URL}/api/mentors`, {
//         params: {
//           page: currentPage,
//           limit: itemsPerPage,
//           search: searchTerm,
//           selectedTags: selectedTags,
//           noOfMenteesMentored: noOfMenteesMentored,
//         },
//       });
//       setMentors(responce.data.mentors);
//       setTotalPages(Math.ceil(responce.data.totalMentorsCount / itemsPerPage));
//     }
//     fetchMentors();
//   }, [currentPage, noOfMenteesMentored]);
// =======
  // Fetch tags and mentors
  useEffect(() => {
    async function fetchTags() {
      try {
        const response = await axios.get("/api/mentors");
        setAllTags(response.data.tags || demoTags);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    }
    fetchTags();
  }, []);
// >>>>>>> main

  async function handleSearchButtonClick() {
    try {
//       const response = await axios.get(`${API_URL}/api/mentors`, {
      const response = await axios.get("/api/mentors", {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm,
          selectedTags: selectedTags,
        },
      });
      setMentors(response.data.mentors || []);
      setTotalPages(Math.ceil(response.data.totalMentorsCount / itemsPerPage));
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  }

// <<<<<<< hv6
//   function handlePageChange(selectedItem) {
//     setCurrentpage(selectedItem.selected);
//   }

//   useEffect(() => {
//     async function fetchTags() {
//       try {
//         const responce = await axios.get(`${API_URL}/api/tags`);
//         setAllTags(responce.data.tags || demoTags);
//       } catch (error) {
//         console.error("error fetching data: ", error);
//       }
// =======
  async function handleAiFilterSubmit() {
    try {
      const response = await axios.post("/api/mentors/filter-ai", {
        aiFilter,
      });
      setMentors(response.data.mentors || []);
      document.getElementById("aiFilterModal").click(); // Close modal
    } catch (error) {
      console.error("Error filtering mentors with AI: ", error);
    }
  }

  function handlePageChange(selectedItem) {
    setCurrentpage(selectedItem.selected);
  }

  function handleTagClick(tag) {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((Tag) => Tag !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  }

  return (
    <div className="container-fluid px-4 mt-4">
      {/* Existing content */}
      <div className="row mb-4">
        <div className="col-12 col-md-8 mb-3 mb-md-0">
          <input
            type="text"
            className="form-control"
            placeholder="Search Mentors ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-12 col-md-2">
          <button
            className="btn btn-primary w-100 border"
            onClick={handleSearchButtonClick}
          >
            Search
          </button>
        </div>
        <div className="col-12 col-md-2">
          <button
            className="btn btn-primary w-100"
            onClick={() =>
              setFilterDropdownVisibility(!filterDropdownVisibility)
            }
          >
            Filter
          </button>
        </div>
      </div>

      {filterDropdownVisibility && (
        <div className="mb-4 border p-2">
          {/* Tag filters */}
          {allTags.map((tag) => (
            <button
// <<<<<<< hv6
//               className="btn-close"
//               aria-label="Close"
//               onClick={toggleFilterDropdownVisibility}
//             ></button>
//           </div>
//           {allTags.map((tag) => {
//             return (
//               <button
//                 className="btn btn-sm rounded-pill m-1"
//                 style={{
//                   backgroundColor: selectedTags.includes(tag)
//                     ? "#07d100"
//                     : "rgb(233, 236, 239)",
//                 }}
//                 onClick={() => handleTagClick(tag)}
//               >
//                 {tag}
//               </button>
//             );
//           })}
//         </div>
//       )}

// {selectedTags?.length !== 0 && (
//         <div className="">
//           Filters applied:
//           {/* {selectedTags.map((tag)=>{
//                 return <button className="btn btn-sm bg-body-secondary rounded-pill m-1" onClick={()=>handleTagClick(tag)}>{tag}</button>;
//             })} */}
//           {selectedTags.map((tag) => {
//             return (
//               <div
//                 className="rounded-pill ps-2 m-1 d-inline-block"
//                 style={{ backgroundColor: "rgb(233, 236, 239)" }}
//               >
//                 <span>{tag}</span>
//                 <button
//                   type="button"
//                   className="btn"
//                   style={{
//                     background: '',
//                     border: 'none',
//                     fontSize: '1rem',
//                     cursor: 'pointer',
//                     transition: 'background-color 0.3s ease',
//                     borderRadius: '50%'
//                   }}
//                   // onMouseEnter={(e) => {
//                   //   e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.1)'; // Hover background color
//                   // }}
//                   // onMouseLeave={(e) => {
//                   //   e.target.style.backgroundColor = ''; // Reset background on mouse leave
//                   // }}
//                   onClick={() => handleTagClick(tag)}
//                 >
//                   &times;
//                 </button>
//                 {/* <i
//                   className="fas fa-times custom-close"
//                   onClick={() => handleTagClick(tag)}
//                   aria-label="Close"
//                 ></i> */}
//                 {/* font-size: 1.5rem; */}
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {/* Cards Section */}
// =======
              key={tag}
              className={`btn btn-sm rounded-pill m-1 ${
                selectedTags.includes(tag) ? "btn-success" : "btn-secondary"
              }`}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
        {mentors.length > 0 ? (
          mentors.map((mentor, index) => (
            <div className="col" key={index}>
              <MentorCard mentor={mentor} />
            </div>
          ))
        ) : (
          <p className="text-center">No mentors found.</p>
        )}
      </div>

      <div className="mt-4 d-flex justify-content-center">
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          pageCount={totalPages}
          forcePage={currentPage}
          onPageChange={handlePageChange}
          containerClassName={"pagination"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousClassName={"page-item"}
          previousLinkClassName={"page-link"}
          nextClassName={"page-item"}
          nextLinkClassName={"page-link"}
          activeClassName={"active"}
        />
      </div>

      {/* AI Floating Chat Button */}
      <button
        className="btn btn-primary rounded-circle position-fixed shadow-lg"
        style={{
          bottom: "20px",
          right: "20px",
          width: "70px",
          height: "70px",
          fontSize: "1.5rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        data-bs-toggle="modal"
        data-bs-target="#aiFilterModal"
      >
        💬
      </button>

      {/* AI Chat Modal */}
      <div
        className="modal fade"
        id="aiFilterModal"
        tabIndex="-1"
        aria-labelledby="aiFilterModalLabel"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-dialog-centered"
          style={{ maxWidth: "400px" }}
        >
          <div className="modal-content">
            <div
              className="modal-header border-0"
              style={{ backgroundColor: "#f8f9fa" }}
            >
              <h5 className="modal-title" id="aiFilterModalLabel">
                Chat with AI
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div
                className="p-3 mb-2"
                style={{
                  backgroundColor: "#e9ecef",
                  borderRadius: "15px",
                  fontSize: "0.9rem",
                  textAlign: "left",
                }}
              >
                Hi! I'm here to help you find the best mentors. What are you
                looking for?
              </div>
              <textarea
                className="form-control mb-2"
                rows="3"
                value={aiFilter}
                onChange={(e) => setAiFilter(e.target.value)}
                placeholder="Type your query..."
              />
              <button
                className="btn btn-primary w-100"
                onClick={handleAiFilterSubmit}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
