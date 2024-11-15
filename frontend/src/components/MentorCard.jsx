import { FaBriefcase } from 'react-icons/fa';
import { FaRegComment } from 'react-icons/fa'
import { FaStar } from 'react-icons/fa';
import demoMentorImage from '../assets/mentorImage.png'

// passed mentor object should be like this
// const mentor = {
//     name:"mentor",
//     rating: 4.5,
//     currentPost:"Test Architecture manager at Align",
//     noOfSessions: 19,
//     noOfReviews: 4,
//     Experience: 23,
//     creditScore: 95
// }

export default function mentorCard({mentor}){
    return <div className="ms-5 rounded shadow p-2 d-flex flex-column justify-content-around" style={{height:"28rem", width:"15rem"}}>
        <img src={demoMentorImage} alt="Mentor Image" style={{width:"100%", borderRadius: "10px"}}/>
        <div className='d-flex justify-content-between align-items-end'>
            <div className='fs-4 fw-bold'>{mentor.name}</div>
            {/* unable to aligning star icon and rating text perectly */}
            <div style={{color:"yellow"}} className=''>
                <FaStar size={15} color="yellow" /> {mentor.rating}
            </div>
        </div>
        <div className='d-flex align-content-center'>
            <FaBriefcase size={30} />
            <span className='ps-2'>{mentor.currentPost}</span>
        </div>
        <div>
            <FaRegComment size={24} />
            <span className='ps-2'>{mentor.noOfSessions} Session ({mentor.noOfReviews} Reviews)</span>
        </div>
        <hr />
        <div className='d-flex justify-content-around'>
            <div className='flex-fill text-center flex-column'>
                <div>Experience</div>
                <div>{mentor.Experience} Years</div>
            </div>
            <div className='flex-fill text-center flex-column'>
                <div>Credit Score</div>
                <div>{mentor.creditScore}</div>
            </div>
        </div>
    </div>
}