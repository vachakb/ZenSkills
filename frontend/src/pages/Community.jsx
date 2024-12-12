import { useEffect } from "react";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { fetchTags } from "../apis/explore";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../apis/commons";


const API_URL = "http://localhost:5000";

export default function Community() {
  const navigate = useNavigate();

  const technicalTags = [
    "Quantum Computing",
    "Cryptography",
    "Shor's Algorithm",
    "Post-Quantum Cryptography",
    "Quantum Key Distribution (QKD)",
    "RSA Encryption",
    "Data Security",
    "Quantum Supremacy",
    "Error Correction",
    "Cybersecurity",
    "Qubits",
    "Mathematics in Cryptography",
    "Quantum Mechanics",
    "Scalability Challenges",
    "Secure Communication",
  ];

  function getTime(time) {
    const current = new Date();
    time = new Date(time);
    if (time.getFullYear() !== current.getFullYear())
      return current.getFullYear() - time.getFullYear() + " years";
    if (time.getMonth() !== current.getMonth())
      return current.getMonth() - time.getMonth() + " months";
    if (time.getDate() !== current.getDate())
      return current.getDate() - time.getDate() + " days";
    if (time.getHours() !== current.getHours())
      return current.getHours() - time.getHours() + " hours";
    if (time.getMinutes() !== current.getMinutes())
      return current.getMinutes() - time.getMinutes() + " minutes";
    if (time.getSeconds() !== current.getSeconds())
      return current.getSeconds() - time.getSeconds() + " seconds";
  }

  function postClickHandler(questionId) {
    Navigate(`${questionId}`);
  }

  let [searchTerm, setSearchTerm] = useState("");

  let [currentPage, setCurrentPage] = useState(0);
  let [totalPages, setTotalPages] = useState(0);
  let [questions, setQuestions] = useState([]);
  const limit = 8;
  let [allTags, setAllTags] = useState([]);
  let [selectedTags, setSelectedTags] = useState([]);
  let [filterVisibility, setFilterVisibility] = useState(false);
  let [inputQuestion, setInputQuestion] = useState("");
  const [selectedQuestionTag, setSelectedQuestionTag] = useState();

  function handlePageChange(selectedItem) {
    setCurrentPage(selectedItem.selected);
  }

  useEffect(() => {
    // const responce = fetchTags();
    // setAllTags(responce.data.tags)
    setAllTags(technicalTags);
  }, []);

  async function getQuestions() {
    console.log("calling question")
    try {
      console.log(limit, currentPage, searchTerm)
      const responce = await axiosInstance.get(`${API_URL}/api/community/questions`, {
        params: {
          limit,
          currentPage,
          searchTerm
        }
      })
      console.log("got questions")
      console.log(responce)
      setQuestions(responce.data.questions)
      setTotalPages(responce.data.totalPages)
    } catch (error) {
      console.log("error extracting questions: ", error)
    }
  }

  useEffect(() => {
    getQuestions();
  }, [currentPage]);

  function searchBtnClickHandler() {
    setCurrentPage(0);
    getQuestions();
  }

  function handleTagClick(tag) {
    for (let i = 0; i < selectedTags.length; i++) {
      if (selectedTags[i] === tag) {
        const copyArr = [...selectedTags];
        copyArr.splice(i, 1);
        setSelectedTags(copyArr);
        return;
      }
    }
    setSelectedTags([...selectedTags, tag]);
  }

  async function handleQuestionSubmit() {
    // post question`
    try {
      console.log(inputQuestion)
      const response = await axiosInstance.post(`${API_URL}/api/community/questions`, {inputQuestion, tag: selectedQuestionTag});
      
      if (response.status === 201 || response.status === 200) {
        console.log('Request completed successfully:', response.data);
        alert('Question "' + inputQuestion + '" submitted successfully!');
      } else {
        console.error('Unexpected status:', response.status);
      }
    } catch (error) {
      console.error('Error during POST request:', error);
      alert('Failed to submit the question. Please try again.');
    }

    getQuestions();
  }

  return (
    <div className="container">
      <p className="text-center fs-2 text-primary">Community</p>

      {/* search/filter panel */}
      <div className="row mb-3 g-2">
        <div className="col-12 col-md-10">
          <div className="input-group">
            <input
              type="text"
              name="search"
              id="search"
              placeholder="Search..."
              className="form-control"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="btn btn-primary text-white"
              onClick={searchBtnClickHandler}
            >
              Search
            </button>
          </div>
        </div>

        <div className="col-12 col-md-2">
          <button
            className="btn btn-primary text-white w-100"
            onClick={() => setFilterVisibility(!filterVisibility)}
          >
            Filter
          </button>
        </div>
      </div>

      {/* filter dropdown */}
      {filterVisibility && (
        <div className="border rounded mb-3 p-3">
          <div className="d-flex justify-content-between">
            <p className="fw-semibold">Tags:</p>
            <button
              className="btn btn-close"
              onClick={() => setFilterVisibility(!filterVisibility)}
            ></button>
          </div>
          <div className="d-flex flex-wrap btn-group btn-group-sm">
            {allTags.map((tag) => {
              return (
                <button
                  className={`btn ${selectedTags.includes(tag)
                    ? "btn-success active"
                    : "btn-outline-secondary border border-secondary"
                    } rounded-pill px-2 mx-2 my-1`}
                  onClick={() => handleTagClick(tag)}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* selected tags */}
      {selectedTags.length > 0 && (
        <div className="mb-3 btn-group btn-group-sm">
          {selectedTags.map((tag) => {
            return (
              <button
                className="btn btn-success active rounded-pill px-2 me-2"
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </button>
            );
          })}
        </div>
      )}

      {/* col col-sm-12 col-md-6 col-lg-4 col-xl-3 col-xxl-2 */}
      {/* questions */}
      <div className="row g-2">
        {questions.filter(question => {
          if (selectedTags.length == 0) {
            return true;
          }

          if (!question.question_tag || question.question_tag.length == 0) {
            return false;
          }

          return selectedTags.some(value => value === question.question_tag[0].tag_name);
        }).map((question) => {
          return (
            <div className="col-12" onClick={() => {
              navigate("/community/" + question.id);
            }} style={{ cursor: "pointer" }}>
              <div
                className="p-3 h-100 border rounded d-flex flex-column justify-content-between bg-light"
                onClick={() => postClickHandler(question.id)}
                key={question.id}
              >
                <p className="fw-medium fs-5">{question.question}</p>
                { question.question_tag && question.question_tag.length > 0 && <p className="fs-6">Tag: {question.question_tag[0].tag_name}</p> }
                <div className="ml-auto">
                  <div className="d-flex justify-content-between">
                    <p className="fw-light">
                      {getTime(question.created_at)} ago
                    </p>
                    <p className="fw-light">{question.answers} answers</p>
                  </div>
                  <div className="d-flex align-items-center">
                    <img
                      src="https://via.placeholder.com/50"
                      alt={`${question.user.username}'s image`}
                      className="rounded-circle"
                    />
                    <div className="d-flex flex-column justify-content-around">
                      <div>
                        <span className="mx-2 fw-semibold">{question.user.username}</span>
                        {question.user.role === "mentor" ? (
                          <span className="bg-success rounded px-2 text-white">
                            Mentor
                          </span>
                        ) : null}
                      </div>
                      <span className="fw-light mx-2">
                        {question.user.profession}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* paginate */}
      <div className="mt-4 d-flex justify-content-center">
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel="..."
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

      {/* ask question button */}
      <button
        className="btn btn-primary rounded-circle position-fixed shadow-lg"
        data-bs-toggle="modal"
        data-bs-target="#askQuestionModal"
        style={{
          bottom: "40px",
          right: "40px",
          width: "50px",
          height: "50px",
          fontSize: "1.5rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <i class="fas fa-plus"></i>
      </button>

      {/* ask question modal */}
      <div
        className="modal fade"
        id="askQuestionModal"
        tabIndex="-1"
        aria-labelledby="askQuestionModalLabel"
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
              <h5 className="modal-title" id="askQuestionModalLabel">
                Ask a Question
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <textarea
                className="form-control mb-2"
                rows="3"
                value={inputQuestion}
                onChange={(e) => setInputQuestion(e.target.value)}
                placeholder="Type your query..."
              />
              <select className="form-control mb-2" onChange={ev => {
                const value = ev.currentTarget.value;
                setSelectedQuestionTag(value)
              }}>
                {technicalTags.map(value => <option value={value}>{value}</option>)}
              </select>
              <button
                className="btn btn-primary w-100"
                onClick={handleQuestionSubmit}
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
