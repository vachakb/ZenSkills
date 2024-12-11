import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { useSearchParams } from 'react-router-dom';
import { axiosInstance } from "../apis/commons";

const API_URL = "http://localhost:5000";

export default function Question() {
  // in reality, get id from url and values form
  const [searchParams] = useSearchParams();
  const questionId = searchParams.get('questionId')
  console.log(questionId)
  const [comment, setComment] = useState("")

  const questionObject = {
    id: 2,
    question:
      "Please can anyone explain the significance of quantum computing in cryptography?",
    asked_time: "2024-12-10T08:15:00Z",
    no_of_answers: 7,
    user: {
      user_id: "user567",
      username: "Sarah Connor",
      role: "mentor",
      profession: "Quantum Researcher",
    },
    answers: [
      {
        id: 1, // Answer ID
        question_id: 2, // Link to the original question ID
        answer:
          "Quantum computing poses a potential threat to traditional cryptographic algorithms like RSA due to its ability to factorize large integers efficiently using algorithms like Shor's algorithm.",
        answered_time: "2024-12-10T09:00:00Z",
        user_id: "user112",
        username: "Emma Watson",
        role: "mentee",
        profession: "Cybersecurity Analyst",
      },
      {
        id: 2, // Answer ID
        question_id: 2, // Link to the original question ID
        answer:
          "Quantum cryptography introduces secure communication methods like Quantum Key Distribution (QKD), which relies on the principles of quantum mechanics to detect eavesdropping.",
        answered_time: "2024-12-10T09:30:00Z",
        user_id: "user245",
        username: "Liam Brown",
        role: "mentor",
        profession: "Mathematician",
      },
      {
        id: 3, // Answer ID
        question_id: 2, // Link to the original question ID
        answer:
          "The development of post-quantum cryptography is crucial as it aims to design algorithms resistant to quantum attacks, ensuring long-term data security.",
        answered_time: "2024-12-10T10:00:00Z",
        user_id: "user889",
        username: "Sophia Green",
        role: "mentee",
        profession: "Software Developer",
      },
      {
        id: 4, // Answer ID
        question_id: 2, // Link to the original question ID
        answer:
          "Quantum computing is still in its infancy, and significant challenges, such as error correction and scalability, must be addressed before its widespread application in cryptography.",
        answered_time: "2024-12-10T10:45:00Z",
        user_id: "user334",
        username: "Ethan King",
        role: "mentor",
        profession: "Quantum Physicist",
      },
      {
        id: 5, // Answer ID
        question_id: 2, // Link to the original question ID
        answer:
          "Quantum computers use qubits, which allow them to perform many calculations simultaneously, making them powerful but also threatening for encryption methods based on computational difficulty.",
        answered_time: "2024-12-10T11:15:00Z",
        user_id: "user678",
        username: "Olivia Smith",
        role: "mentee",
        profession: "Cryptographer",
      },
      {
        id: 6, // Answer ID
        question_id: 2, // Link to the original question ID
        answer:
          "In addition to its challenges, quantum computing could also enable new cryptographic methods that leverage its unique properties for secure data storage and communication.",
        answered_time: "2024-12-10T11:45:00Z",
        user_id: "user901",
        username: "William Johnson",
        role: "mentor",
        profession: "AI Researcher",
      },
      {
        id: 7, // Answer ID
        question_id: 2, // Link to the original question ID
        answer:
          "Quantum supremacy might redefine cryptographic practices globally, necessitating international cooperation to address data security concerns proactively.",
        answered_time: "2024-12-10T12:15:00Z",
        user_id: "user543",
        username: "Mia Davis",
        role: "mentee",
        profession: "Research Scientist",
      },
    ],
  };

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

  let [currentPage, setCurrentPage] = useState(0);
  let [totalPages, setTotalPages] = useState(0);
  let [answers, setAnswers] = useState([]);
  const limit = 3;

  function handlePageChange(selectedItem) {
    setCurrentPage(selectedItem.selected);
  }

  async function getAnswers() {
    // call api for questions/blogs
    try{
      const responce = await axiosInstance.get("", {
        params: {
          questionId, currentPage, limit
        }
      });
      setAnswers(responce.data.answers)
      setTotalPages(responce.data.totalPages)
    }catch(error){
      console.log("error on client: ", error);
    }
  }

  async function postAnswer() {
    try{
      const response = await axiosInstance.post(`${API_URL}/api/community/questions`, {
        answer:comment,
        questionId
      })
    }catch(error){

    }
  }

  async function handleSubmit() {
    // posting comment
    postAnswer()
    setCurrentPage(0)
    getAnswers()
  }

  useEffect(() => {
    getAnswers()
  }, [currentPage]);

  return (
    <div className="p-2">
      {/* question */}
      <div className="bg-body-secondary p-3 rounded">
        <p className="fw-bold fs-3">{questionObject.question}</p>
        <div className="d-flex align-items-center my-2">
          <img
            src="https://via.placeholder.com/50"
            alt={`${questionObject.user.username}'s image`}
            className="rounded-circle"
          />
          <div className="d-flex flex-column justify-content-around">
            <div>
              <span className="mx-2 fw-semibold">
                {questionObject.user.username}
              </span>
              {questionObject.user.role === "mentor" ? (
                <span className="bg-success rounded px-2 text-white">
                  Mentor
                </span>
              ) : null}
            </div>
            <span className="fw-light mx-2">
              {questionObject.user.profession}
            </span>
          </div>
        </div>
      </div>

      {/* user answer */}
      <div className="m-2 d-flex gap-3">
        <img
          src="https://via.placeholder.com/50"
          alt={`user's image`}
          className="rounded-circle"
          style={{ width: "50px", height: "50px" }}
        />
        <textarea
          placeholder="Write your answer here..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={1}
          style={{
            width: '100%',
            padding: '5px 0',
            fontSize: '16px',
            border: 'none',
            borderBottom: '2px solid #ccc',
            resize: 'none', // Prevent manual resizing
            overflow: 'hidden', // Hide scrollbars
            outline: 'none', // Remove focus outline
          }}
          onInput={(e) => {
            e.target.style.height = 'auto'; // Reset height to calculate scroll height
            e.target.style.height = `${e.target.scrollHeight}px`; // Adjust to content
          }}
        />
        <button
          className="btn btn-info border"
          onClick={handleSubmit}
        >Submit</button>
      </div>

      {/* answers */}
      <div className="p-2">
        <p className="fw-medium">{questionObject.no_of_answers} Answers</p>
        <div>
          {answers.map((answer) => {
            return (
              <div>
                <div className="d-flex align-items-center m-2">
                  <img
                    src="https://via.placeholder.com/50"
                    alt={`${answer.username}'s image`}
                    className="rounded-circle"
                  />
                  <div className="d-flex flex-column justify-content-around">
                    <div>
                      <span className="mx-2 fw-semibold">
                        {answer.username}
                      </span>
                      {answer.role === "mentor" ? (
                        <span className="bg-success rounded px-2 me-2 text-white">
                          Mentor
                        </span>
                      ) : null}
                      <span className="fw-lighter">
                        {getTime(answer.answered_time)} ago
                      </span>
                    </div>
                    <span className="fw-light mx-2">{answer.profession}</span>
                  </div>
                </div>
                <div className="ps-5">{answer.answer}</div>
                <hr />
              </div>
            );
          })}
        </div>
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
    </div>
  );
}
