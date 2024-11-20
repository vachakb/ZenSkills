import { useEffect, useState } from "react";
import MentorCard from "../components/MentorCard";
import ReactPaginate from "react-paginate";
import axios from "axios";

// remove mentors_ and allTags aguments when api is live
const API_URL = "http://localhost:5000";
export default function ExploreMentor({ mentors_, demoTags }) {
  const [mentors, setMentors] = useState(mentors_);
  const [searchTerm, setSearchTerm] = useState("");
  const [allTags, setAllTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [noOfMenteesMentored, setNoOfMenteesMentored] = useState(0);
  const [currentPage, setCurrentpage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filterDropdownVisibility, setFilterDropdownVisibility] =
    useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    // fetch cards from backend by api
    async function fetchMentors() {
      const responce = await axios.get(`${API_URL}/api/mentors`, {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm,
          selectedTags: selectedTags,
          noOfMenteesMentored: noOfMenteesMentored,
        },
      });
      setMentors(responce.data.mentors);
      setTotalPages(Math.ceil(responce.data.totalMentorsCount / itemsPerPage));
    }
    fetchMentors();
  }, [currentPage, noOfMenteesMentored]);

  async function handleSearchButtonClick() {
    // if(!searchTerm && selectedTags?.length===0)    return
    try {
      const responce = await axios.get(`${API_URL}/api/mentors`, {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm,
          selectedTags: selectedTags,
          noOfMenteesMentored: noOfMenteesMentored,
        },
      });
      //   return all mentors when all query values are null/undefined
      setMentors(responce.data.mentors || []);
      setTotalPages(Math.ceil(responce.data.totalMentorsCount / itemsPerPage));
    } catch (error) {
      console.error("error fetching data: ", error);
    }
  }

  function handlePageChange(selectedItem) {
    setCurrentpage(selectedItem.selected);
  }

  useEffect(() => {
    async function fetchTags() {
      try {
        const responce = await axios.get(`${API_URL}/api/tags`);
        setAllTags(responce.data.tags || demoTags);
      } catch (error) {
        console.error("error fetching data: ", error);
      }
    }
    fetchTags();
  }, []);

  function toggleFilterDropdownVisibility() {
    if (filterDropdownVisibility) setFilterDropdownVisibility(false);
    else setFilterDropdownVisibility(true);
  }

  function handleTagClick(tag) {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((Tag) => Tag !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
    console.log(selectedTags);
  }

  return (
    <div className="container-fluid px-4 mt-4">
      {/* Search and Filter Section */}
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
            onClick={toggleFilterDropdownVisibility}
          >
            Filter
          </button>
        </div>
      </div>

      {filterDropdownVisibility && (
        <div className="mb-4 border p-2">
          <div className="d-flex justify-content-between">
            <div>Select Tags</div>
            <button
              className="btn-close"
              aria-label="Close"
              onClick={toggleFilterDropdownVisibility}
            ></button>
          </div>
          {allTags.map((tag) => {
            return (
              <button
                className="btn btn-sm rounded-pill m-1"
                style={{
                  backgroundColor: selectedTags.includes(tag)
                    ? "#07d100"
                    : "rgb(233, 236, 239)",
                }}
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </button>
            );
          })}
        </div>
      )}

{selectedTags?.length !== 0 && (
        <div className="">
          Filters applied:
          {/* {selectedTags.map((tag)=>{
                return <button className="btn btn-sm bg-body-secondary rounded-pill m-1" onClick={()=>handleTagClick(tag)}>{tag}</button>;
            })} */}
          {selectedTags.map((tag) => {
            return (
              <div
                className="rounded-pill ps-2 m-1 d-inline-block"
                style={{ backgroundColor: "rgb(233, 236, 239)" }}
              >
                <span>{tag}</span>
                <button
                  type="button"
                  className="btn"
                  style={{
                    background: '',
                    border: 'none',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                    borderRadius: '50%'
                  }}
                  // onMouseEnter={(e) => {
                  //   e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.1)'; // Hover background color
                  // }}
                  // onMouseLeave={(e) => {
                  //   e.target.style.backgroundColor = ''; // Reset background on mouse leave
                  // }}
                  onClick={() => handleTagClick(tag)}
                >
                  &times;
                </button>
                {/* <i
                  className="fas fa-times custom-close"
                  onClick={() => handleTagClick(tag)}
                  aria-label="Close"
                ></i> */}
                {/* font-size: 1.5rem; */}
              </div>
            );
          })}
        </div>
      )}

      {/* Cards Section */}
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

      {/* Pagination */}
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
    </div>
  );
}
