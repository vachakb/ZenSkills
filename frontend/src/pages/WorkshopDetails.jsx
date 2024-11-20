import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const WorkshopDetails = () => {
  const { workshopId } = useParams(); // Assuming you're passing workshop ID in the route
  const [workshopData, setWorkshopData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    status: false,
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Mock data for the workshop (Replace with actual data fetch logic)
  const workshopData_ = {
    title: "React and Bootstrap Workshop",
    description:
      "Learn the basics of React and how to style your applications using Bootstrap. This workshop is perfect for beginners who want to dive into modern web development.",
    date: "25th November 2024",
    time: "10:00 AM - 4:00 PM",
    venue: "Tech Hall, Main Campus",
    status: false,
  };

  async function fetchWorkshopData() {
    // try{
    //     const responce = await axios.get(`/api/workshops/${workshopId}`, {
    //         params:{
    //             workshopId,
    //             userId
    //         }
    //     })
    //     if(responce.ok){
    //         setWorkshopData(await responce.json());
    //     }
    // }catch(error){
    //     console.error(error)
    // }
    setWorkshopData(workshopData_);
  }

  useEffect(() => {
    fetchWorkshopData();
  }, []);

  const handleBooking = async () => {
    setLoading(true)
    const responce = await fetch(`/api/workshops/${workshopId}`, {
      method: "POST",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify({
        workshopId,
        userId,
      }),
    });
    if (responce.ok) {
      await fetchWorkshopData();
      console.log("session for workshop is booked");
      alert("You have successfully booked the workshop!");
      //   navigate("/workshops"); // Redirect to workshops page after booking
    } else {
      alert("Unable to book seat");
    }
    setLoading(false)
  };

  async function handleCancelBooking() {
    setLoading(true)
    const responce = await fetch(`/api/workshops/${workshopId}`, {
      method: "DELETE",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify({
        workshopId,
        userId,
      }),
    });
    if (responce.ok) {
      await fetchWorkshopData();
      console.log("calceled seat");
      alert("seat canceled");
    } else {
      alert("unable to cancel seat");
    }
    setLoading(false)
  }

  return (
    <div className="container my-5">
      <div className="card">
        <div className="card-header text-center bg-primary text-white">
          <h2>{workshopData.title}</h2>
        </div>
        <div className="card-body">
          <p>
            <strong>Description:</strong> {workshopData.description}
          </p>
          <p>
            <strong>Date:</strong> {workshopData.date}
          </p>
          <p>
            <strong>Time:</strong> {workshopData.time}
          </p>
          <p>
            <strong>Venue:</strong> {workshopData.venue}
          </p>
        </div>
        <div className="card-footer text-center">
          {!workshopData.status ? (
            <button
              className="btn btn-success border"
              onClick={handleBooking}
              disabled={workshopData.status || loading}
            >
              Book seat
            </button>
          ) : (
            <button
              className="btn btn-danger border"
              onClick={handleCancelBooking}
              disabled={workshopData.status || loading}
            >
              Cancel Booking
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkshopDetails;
