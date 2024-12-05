import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { getWorkshopById, bookWorkshop } from "../apis/workshops";
import { formatDateTime } from "../misc/formatDateTime";
import useProfile from "../hooks/useProfile"; // Import the useProfile hook
// TODO Make calls using axios

const WorkshopDetails = () => {
  const { workshopId } = useParams(); 
  const [workshopData, setWorkshopData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    bookStatus: false,
    completionStatus: false,
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Mock data for the workshop (Replace with actual data fetch logic)
  //   const workshopData_ = {
  //     title: "React and Bootstrap Workshop",
  //     host: "Donald Trump",
  //     description:
  //       "Learn the basics of React and how to style your applications using Bootstrap. This workshop is perfect for beginners who want to dive into modern web development.",
  //     date: "25th November 2024",
  //     time: "10:00 AM - 4:00 PM",
  //     venue: "Tech Hall, Main Campus",
  //     bookStatus: false,
  //     completionStatus: false,
  //   };

  const { profile } = useProfile(); // Get the user profile
  const userId = profile?.id; // Extract the userId from the profile
  const { date, time } = formatDateTime(workshopData.date);

  async function fetchWorkshopData() {
    try {
      const response = await getWorkshopById(workshopId);
      setWorkshopData(response.data)
    } catch (error) {
      console.error("Error fetching workshop details:", error);
    }
  }

  useEffect(() => {
    fetchWorkshopData();
  }, [workshopId]);

  const handleBooking = async () => {
    setLoading(true);
    try {
      const response = await bookWorkshop(workshopId, userId);
      if (response.status === 201) {
        await fetchWorkshopData();
        console.log("Session for workshop is booked");
        alert("You have successfully booked the workshop!");
      } else {
        alert("Unable to book seat");
      }
    } catch (error) {
      console.error("Error booking workshop:", error);
      alert("Unable to book seat");
    }
    setLoading(false);
  };

  async function handleCancelBooking() {
    setLoading(true);
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
    setLoading(false);
  }

  return (
    <div className="container my-5">
      <div className="card">
        <div className="card-header text-center bg-primary text-white">
          <h2 className="h4">{workshopData.title}</h2>
        </div>
        <div className="card-body">
          <p>
            <strong>Host:</strong> {workshopData.organizer_name}
          </p>
          <p>
            <strong>Description:</strong> {workshopData.description}
          </p>
          <p>
            <strong>Date:</strong> {date}
          </p>
          <p>
            <strong>Time:</strong> {time}
          </p>
        </div>
        <div className="card-footer text-center">
          {workshopData.status === "upcoming" ? (
            !workshopData.bookStatus ? (
              <button
                className="btn btn-success border w-100"
                onClick={handleBooking}
                disabled={workshopData.bookStatus || loading}
              >
                Book seat
              </button>
            ) : (
              <button
                className="btn btn-danger border w-100"
                onClick={handleCancelBooking}
                disabled={workshopData.bookStatus || loading}
              >
                Cancel Booking
              </button>
            )
          ) : (
            <div className="text-truncate">Workshop is Ended</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkshopDetails;
