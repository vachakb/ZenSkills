import { useEffect, useState } from "react";
import MentorCard from "../components/MentorCard";
import ReactPaginate from "react-paginate";
import axios from "axios";
import { fetchTags, fetchMentors, fetchMentorsbyAI } from "../apis/explore";
import classNames from "classnames";
import "../styles/style.css"
import { Modal } from 'bootstrap';

export default function ExploreMentor({ mentors_ }) {
  const [mentors, setMentors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [allTags, setAllTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [aiFilterQuery, setAiFilterQuery] = useState(""); // For AI input
  const [currentPage, setCurrentpage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filterDropdownVisibility, setFilterDropdownVisibility] =
    useState(false);
  const [aiError, setAiError] = useState(""); // Add new state for AI error message
  const [isLoading, setIsLoading] = useState(false); // Add new state after other useState declarations
  const itemsPerPage = 4;

  // Fetch tags and mentors
  useEffect(() => {
    (async () => {
      const tagsResponse = await fetchTags();
      setAllTags(tagsResponse?.data?.tags || []);
      const mentorsResponse = await fetchMentors(currentPage, itemsPerPage, searchTerm, selectedTags);
      setMentors(mentorsResponse?.data?.mentors || mentors_);
      setTotalPages(Math.ceil((mentorsResponse?.data?.totalMentorsCount || 0) / itemsPerPage));
    })(); // IIFE: Immediately invoked function expression
  }, []);

  async function handleSearchButtonClick() {
    const response = await fetchMentors(
      currentPage,
      itemsPerPage,
      searchTerm,
      selectedTags
    );
    setMentors(response?.data?.mentors || mentors_);
    setTotalPages(
      Math.ceil((response?.data?.totalMentorsCount || 0) / itemsPerPage)
    );
  }

  async function handleAiFilterQuerySubmit() {
    try {
      setIsLoading(true);
      setAiError("");
      const response = await fetchMentorsbyAI(aiFilterQuery);

      if (response.data.mentors) {
        setMentors(response.data.mentors);
        setTotalPages(Math.ceil((response.data.totalMentorsCount || 0) / itemsPerPage));

        // Close modal and remove backdrop
        const modalElement = document.querySelector('#aiFilterQueryModal');
        const modalInstance = Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
          // Remove modal backdrop
          const backdrop = document.querySelector('.modal-backdrop');
          if (backdrop) {
            backdrop.remove();
          }
          // Remove modal-open class from body
          document.body.classList.remove('modal-open');
          // Remove inline style from body
          document.body.style.removeProperty('padding-right');
        }

        setAiFilterQuery('');
      }
    } catch (error) {
      console.error("AI Recommendation Error:", error);
      setAiError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  function handlePageChange(selectedItem) {
    setCurrentpage(selectedItem.selected);
  }

  // TODO handle this better
  function handleTagClick(tag) {
    for (let i = 0; i < selectedTags.length; i++) {
      if (selectedTags[i].tag_id === tag.tag_id) {
        const copyArr = [...selectedTags];
        copyArr.splice(i, 1);
        setSelectedTags(copyArr);
        return
      }
    }
    setSelectedTags([...selectedTags, tag]);
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
              key={tag.tag_id}
              className={classNames({
                "btn btn-sm rounded-pill m-1": true,
                "bg-success": selectedTags.some((selectedTag) => selectedTag.tag_id === tag.tag_id),
                "bg-secondary": !selectedTags.some((selectedTag) => selectedTag.tag_id === tag.tag_id)
              })}
              onClick={() => handleTagClick(tag)}
            >
              {tag.tag_name}
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
        data-bs-target="#aiFilterQueryModal"
      >
        💬
      </button>

      {/* AI Chat Modal */}
      <div
        className="modal fade"
        id="aiFilterQueryModal"
        tabIndex="-1"
        aria-labelledby="aiFilterQueryModalLabel"
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
              <h5 className="modal-title" id="aiFilterQueryModalLabel">
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
                className="p-3 mb-3"
                style={{
                  backgroundColor: "#e9ecef",
                  borderRadius: "15px",
                  fontSize: "0.9rem",
                  textAlign: "left",
                }}
              >
                Hi! I'm here to help you find the best mentors. Try queries like:
                <ul className="mt-2 mb-0">
                  <li>"I need help with React and Node.js development"</li>
                  <li>"Looking for a mentor skilled in machine learning"</li>
                  <li>"Need guidance in system design and architecture"</li>
                </ul>
              </div>

              <textarea
                className="form-control mb-3"
                rows="3"
                value={aiFilterQuery}
                onChange={(e) => setAiFilterQuery(e.target.value)}
                placeholder="Type your query..."
                disabled={isLoading}
              />

              {aiError && (
                <div
                  className="alert alert-warning mb-3"
                  role="alert"
                >
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {aiError}
                </div>
              )}

              <button
                className="btn btn-primary w-100 position-relative"
                onClick={handleAiFilterQuerySubmit}
                disabled={isLoading || !aiFilterQuery.trim()}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Finding mentors...
                  </>
                ) : (
                  'Send'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
