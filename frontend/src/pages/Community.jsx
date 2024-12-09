import { Navigate } from "react-router-dom";

export default function Community() {

    const questions = [
        {
            "id": 1,
            "question": "What is the difference between synchronous and asynchronous programming?",
            "asked_time": "2024-12-09T10:15:00Z",
            "no_of_answers": 5,
            "user": {
                "user_id": 101,
                "username": "tech_guru",
                "role": "mentor",
                "profession": "Software Engineer"
            }
        },
        {
            "id": 2,
            "question": "How does virtual memory work, and why is it useful?",
            "asked_time": "2024-12-09T10:20:00Z",
            "no_of_answers": 3,
            "user": {
                "user_id": 102,
                "username": "code_learner",
                "role": "mentee",
                "profession": "Student"
            }
        },
        {
            "id": 3,
            "question": "What is the purpose of lazy loading for images in a React application?",
            "asked_time": "2024-12-09T10:25:00Z",
            "no_of_answers": 7,
            "user": {
                "user_id": 103,
                "username": "frontend_dev",
                "role": "mentee",
                "profession": "Frontend Developer"
            }
        },
        {
            "id": 4,
            "question": "How does SSL/TLS ensure secure communication between a client and a server?",
            "asked_time": "2024-12-09T10:30:00Z",
            "no_of_answers": 4,
            "user": {
                "user_id": 104,
                "username": "security_expert",
                "role": "mentor",
                "profession": "Security Specialist"
            }
        },
        {
            "id": 5,
            "question": "Explain the concept of sensor fusion in autonomous vehicles.",
            "asked_time": "2024-12-09T10:35:00Z",
            "no_of_answers": 6,
            "user": {
                "user_id": 105,
                "username": "ai_enthusiast",
                "role": "mentee",
                "profession": "AI Researcher"
            }
        },
        {
            "id": 6,
            "question": "How does recursion work, and what are its pros and cons?",
            "asked_time": "2024-12-09T10:40:00Z",
            "no_of_answers": 8,
            "user": {
                "user_id": 106,
                "username": "algo_master",
                "role": "mentor",
                "profession": "Algorithm Specialist"
            }
        },
        {
            "id": 7,
            "question": "What is overfitting in machine learning, and how can it be prevented?",
            "asked_time": "2024-12-09T10:45:00Z",
            "no_of_answers": 2,
            "user": {
                "user_id": 107,
                "username": "ml_newbie",
                "role": "mentee",
                "profession": "Machine Learning Enthusiast"
            }
        },
        {
            "id": 8,
            "question": "How does the quicksort algorithm achieve O(n log n) complexity in the average case?",
            "asked_time": "2024-12-09T10:50:00Z",
            "no_of_answers": 5,
            "user": {
                "user_id": 108,
                "username": "sorting_savant",
                "role": "mentor",
                "profession": "Data Scientist"
            }
        },
        {
            "id": 9,
            "question": "What is the role of Kubernetes in managing microservices?",
            "asked_time": "2024-12-09T10:55:00Z",
            "no_of_answers": 1,
            "user": {
                "user_id": 109,
                "username": "devops_dude",
                "role": "mentee",
                "profession": "DevOps Engineer"
            }
        },
        {
            "id": 10,
            "question": "How do you handle technical debt in a project?",
            "asked_time": "2024-12-09T11:00:00Z",
            "no_of_answers": 3,
            "user": {
                "user_id": 110,
                "username": "project_manager",
                "role": "mentor",
                "profession": "Project Manager"
            }
        },
        {
            "id": 11,
            "question": "How does indexing improve query performance, and what are its trade-offs?",
            "asked_time": "2024-12-09T11:05:00Z",
            "no_of_answers": 6,
            "user": {
                "user_id": 111,
                "username": "db_admin",
                "role": "mentor",
                "profession": "Database Administrator"
            }
        },
        {
            "id": 12,
            "question": "What is the difference between REST and GraphQL APIs?",
            "asked_time": "2024-12-09T11:10:00Z",
            "no_of_answers": 4,
            "user": {
                "user_id": 112,
                "username": "api_architect",
                "role": "mentee",
                "profession": "API Architect"
            }
        },
        {
            "id": 13,
            "question": "How do you implement a stack data structure using an array?",
            "asked_time": "2024-12-09T11:15:00Z",
            "no_of_answers": 7,
            "user": {
                "user_id": 113,
                "username": "cs_student",
                "role": "mentor",
                "profession": "Computer Science Student"
            }
        },
        {
            "id": 14,
            "question": "How does gradient descent optimize neural network training?",
            "asked_time": "2024-12-09T11:20:00Z",
            "no_of_answers": 3,
            "user": {
                "user_id": 114,
                "username": "nn_engineer",
                "role": "mentee",
                "profession": "Neural Network Engineer"
            }
        },
        {
            "id": 15,
            "question": "What are the differences between waterfall and agile methodologies?",
            "asked_time": "2024-12-09T11:25:00Z",
            "no_of_answers": 9,
            "user": {
                "user_id": 115,
                "username": "methodology_mentor",
                "role": "mentor",
                "profession": "Agile Methodologist"
            }
        },
        {
            "id": 16,
            "question": "What is the difference between TCP and UDP, and when would you use each?",
            "asked_time": "2024-12-09T11:30:00Z",
            "no_of_answers": 5,
            "user": {
                "user_id": 116,
                "username": "network_novice",
                "role": "mentee",
                "profession": "Network Engineer"
            }
        },
        {
            "id": 17,
            "question": "How does containerization with Docker differ from virtualization with VMs?",
            "asked_time": "2024-12-09T11:35:00Z",
            "no_of_answers": 6,
            "user": {
                "user_id": 117,
                "username": "docker_dabbler",
                "role": "mentor",
                "profession": "Docker Specialist"
            }
        },
        {
            "id": 18,
            "question": "What is the purpose of a foreign key constraint in relational databases?",
            "asked_time": "2024-12-09T11:40:00Z",
            "no_of_answers": 2,
            "user": {
                "user_id": 118,
                "username": "sql_scholar",
                "role": "mentee",
                "profession": "SQL Expert"
            }
        },
        {
            "id": 19,
            "question": "What is the role of a kernel in an operating system?",
            "asked_time": "2024-12-09T11:45:00Z",
            "no_of_answers": 4,
            "user": {
                "user_id": 119,
                "username": "os_explorer",
                "role": "mentor",
                "profession": "Operating Systems Specialist"
            }
        },
        {
            "id": 20,
            "question": "How does natural language processing differ from computer vision?",
            "asked_time": "2024-12-09T11:50:00Z",
            "no_of_answers": 3,
            "user": {
                "user_id": 120,
                "username": "ai_generalist",
                "role": "mentee",
                "profession": "AI Generalist"
            }
        }
    ]

    function getTime(time) {
        const current = new Date()
        time = new Date(time)
        if (time.getFullYear() !== current.getFullYear()) return (current.getFullYear() - time.getFullYear()) + " years";
        if (time.getMonth() !== current.getMonth()) return (current.getMonth() - time.getMonth()) + " months";
        if (time.getDate() !== current.getDate()) return (current.getDate() - time.getDate()) + " days";
        if (time.getHours() !== current.getHours()) return (current.getHours() - time.getHours()) + " hours";
        if (time.getMinutes() !== current.getMinutes()) return (current.getMinutes() - time.getMinutes()) + " minutes";
        if (time.getSeconds() !== current.getSeconds()) return (current.getSeconds() - time.getSeconds()) + " seconds";
    }

    function postClickHandler(questionId) {
        Navigate(`${questionId}`)
    }

    return <div className="container">
        <p className="text-center fs-2 text-primary">Community</p>
        <div className="row mb-3">
            <div className="input-group">
                <input type="text" name="search" id="search" placeholder="Search..." className="form-control" />
                <button className="btn bg-primary text-white">Search</button>
            </div>
        </div>
        <div className="row">
            {questions.map((question) => {
                return <div className="col col-sm-12 col-md-6 col-lg-4 col-xl-3 col-xxl-2 p-2 border rounded d-flex flex-column justify-content-between bg-light" onClick={() => postClickHandler(question.id)}>
                    <p className="fw-medium">{question.question}</p>
                    <div className="ml-auto">
                        <div className="d-flex justify-content-between">
                            <p className="fw-light">{getTime(question.asked_time)} ago</p>
                            <p className="fw-light">{question.no_of_answers} answers</p>
                        </div>
                        <div className="d-flex align-items-center">
                            <img src="https://via.placeholder.com/50" alt={`${question.user.username}'s image`} className="rounded-circle" />
                            <div className="d-flex flex-column justify-content-around">
                                <div>
                                    <span className="mx-2">{question.user.username}</span>
                                    {question.user.role === "mentor" ? <span className="bg-success rounded px-2 text-white">Mentor</span> : null}
                                </div>
                                <span className="fw-light mx-2">{question.user.profession}</span>
                            </div>
                        </div>
                    </div>
                </div>
            })}
        </div>
    </div>
}