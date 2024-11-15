import { Col, Container, Row, Form, Button,Card } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from 'react-router-dom'
import { useLocation } from "react-router-dom";
import { GiHand } from "react-icons/gi";
import { MdKeyboardArrowRight } from "react-icons/md";
import { PiPlantFill } from "react-icons/pi";
import { Link } from "react-router-dom";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import { RiCopperCoinLine } from "react-icons/ri";
import EventCard from "../components/Events";
function MenteeWelcome() {
    const location = useLocation();
    const userName = location.state?.name || "User";
    const sessiondata = [
        /*{name:"test1",date:new Date()},
        {name:"test2",date:new Date()},*/

    ];
    const profilestatus = "Beginner";
    const navigate=useNavigate();
    return(
        <div className="pt-0 fs-2" style={{padding:'70px'}}>
        Hello, {userName}! <GiHand size={'0.9em'} color="#ffa426" />
        {sessiondata.length === 0 ? (
    <div className="fs-6">You have no upcoming sessions.</div>
) : (
    null
)}
<div className="d-flex flex-column" style={{ position: 'fixed', right: '20px' }}>
  <Card bg="primary" className="mb-5" style={{ width: '320px', height: '130px', color: '#ffa426' }}>
    <Card.Title className="mx-4 mt-4 py-0 mb-0" style={{ fontSize: '15px' }}>
      Your profile strength
      <MdKeyboardArrowRight
              size={"30px"}
              style={{ verticalAlign: "middle", marginLeft: "90px" }}
              onClick={() => navigate("/upcoming")}
/>
      
      
    </Card.Title>
    <Card.Text className="mx-4 mt-2 fs-4">{profilestatus}
    <PiPlantFill className="mx-2" style={{color:'#33a70d'}} />
    </Card.Text>
  </Card>
  <Card text="primary" bg="white" border="primary" style={{ width: '320px', height: '130px' }}>
    <Card.Title className="mt-4 py-0 mb-0" style={{ fontSize: '15px', marginLeft:'20px' }}>
      <u>Complete your first session</u>
     <MdOutlineKeyboardDoubleArrowRight size={'2em'} style={{ verticalAlign: 'middle', marginLeft:'50px' }} onClick={() => navigate("/")}/> 
      
      
    </Card.Title>
    <Card.Text className="mx-3 mt-2" style={{fontSize:'13px'}}>
    <RiCopperCoinLine size={'2em'} style={{color:'#f1dc2e', marginRight:'10px'}} />
    Unlock other milestones
    </Card.Text>
  </Card>
</div>


    </div>

  
    
    

    );
    
}
export default MenteeWelcome;