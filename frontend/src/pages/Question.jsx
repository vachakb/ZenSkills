export default function Question() {
    // in reality, get id from url and values form

    const questionObject = {
        id: 1,
        question: "What is the capital of France?",
        asked_time: "2024-12-09T10:30:00Z",
        no_of_answers: 5,
        user: {
            user_id: "user123",
            username: "John Doe",
            role: "mentor",
            profession: "Software Engineer",
        },
        answers: [
            {
                id: 1,  // Answer ID
                question_id: 1,  // Link to the original question ID
                answer: "The capital of France is Paris.",
                asked_time: "2024-12-09T11:00:00Z",
                no_of_answers: 3,  // Number of follow-up answers (if any)
                user_id: "user456",
                username: "Jane Smith",
                role: "mentee",
                profession: "Data Scientist", // Added profession for the answerer
            },
            {
                id: 2,  // Answer ID
                question_id: 1,  // Link to the original question ID
                answer: "Paris is also known for its iconic landmarks.",
                asked_time: "2024-12-09T12:00:00Z",
                no_of_answers: 2,  // Number of follow-up answers (if any)
                user_id: "user789",
                username: "Mark Lee",
                role: "mentor",
                profession: "Mechanical Engineer", // Added profession for the answerer
            },
            {
                id: 3,  // Answer ID
                question_id: 1,  // Link to the original question ID
                answer: "Paris is the most populous city in France.",
                asked_time: "2024-12-09T12:30:00Z",
                no_of_answers: 1,  // Number of follow-up answers (if any)
                user_id: "user987",
                username: "Alice Johnson",
                role: "mentee",
                profession: "Teacher", // Added profession for the answerer
            }
        ]
    };

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

    return <div className="p-2">
        {/* question */}
        <p className="fw-bold fs-3">{questionObject.question}</p>
        <div className="d-flex align-items-center my-2">
            <img src="https://via.placeholder.com/50" alt={`${questionObject.user.username}'s image`} className="rounded-circle" />
            <div className="d-flex flex-column justify-content-around">
                <div>
                    <span className="mx-2">{questionObject.user.username}</span>
                    {questionObject.user.role === "mentor" ? <span className="bg-success rounded px-2 text-white">Mentor</span> : null}
                </div>
                <span className="fw-light mx-2">{questionObject.user.profession}</span>
            </div>
        </div>
        <p className="fw-medium">{questionObject.no_of_answers} Answers</p>
        <div>
            {questionObject.answers.map((answer) => {
                return <div>
                    <div className="d-flex align-items-center m-2">
                        <img src="https://via.placeholder.com/50" alt={`${answer.username}'s image`} className="rounded-circle" />
                        <div className="d-flex flex-column justify-content-around">
                            <div>
                                <span className="mx-2 fw-semibold">{answer.username}</span>
                                {answer.role === "mentor" ? <span className="bg-success rounded px-2 me-2 text-white">Mentor</span> : null}
                                <span className="fw-lighter">{getTime(answer.asked_time)} ago</span>
                            </div>
                            <span className="fw-light mx-2">{answer.profession}</span>
                        </div>
                    </div>
                    <div className="ps-5">{answer.answer}</div>
                    <hr />
                </div>
            })}
        </div>
    </div>
}