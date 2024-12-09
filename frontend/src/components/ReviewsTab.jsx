import React, { useState } from "react";
import ReviewCard from "./ReviewCard";
import { DateTime } from "luxon";
import ReviewInput from "./ReviewInput";
import { FaStar } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { useEffect } from "react";
import { createReview, getAllReviews } from "../apis/mentors";

function ReviewsTab({ mentorId }) {
  // Initial review data
  const reviewData = {
    username: "John Doe",
    date: "2023-04-18",
    rating: 4,
    reviewText:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi molestie.",
  };

  // User info for review input
  const userInfo = {
    username: "User",
    date: DateTime.local(),
    rating: 0,
    reviewText: "",
  };

  // State to manage reviews and pagination
  // const [reviews, setReviews] = useState(Array(6).fill(reviewData)); // Sample 6 reviews
  const [hasReviewed, setHasReviewed] = useState(false);
  const [selectedStar, setSelectedStar] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  const [reviews, setReviews] = useState([]);

  const itemsPerPage = 5;

  const onLoad = () => {
    getAllReviews(mentorId)
      .then((res) => { setReviews(res.data.reviews); setHasReviewed(res.data.hasReviewed) })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    onLoad()
  }, [])

  // Add new review to the list
  const handleAddReview = async (newReview) => {
    createReview(mentorId, newReview).then(res => {
      setReviews([res.data.review, ...reviews]);
      setHasReviewed(true);
    }).catch(err => console.error(err))
  };

  // Handle tag click
  const handleTagClick = (star) => {
    setSelectedStar(star === selectedStar ? null : star); // Toggle filtering for the clicked star
    setCurrentPage(0); // Reset to first page on filter change
  };

  // Filter reviews based on selected star rating
  const filteredReviews =
    selectedStar === null
      ? reviews
      : reviews.filter((review) => review.rating === selectedStar);

  // Calculate pagination details
  const pageCount = Math.ceil(filteredReviews.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentReviews = filteredReviews.slice(offset, offset + itemsPerPage);

  // Handle pagination click
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, review) => acc + review.rating, 0) /
          reviews.length
        ).toFixed(2)
      : "0.00";

  return (
    <div className="m-0 p-0">
      {/* Average Rating Display */}
      <div
        className="d-flex flex-column align-items-center mb-4 py-3"
        style={{ border: "1px solid black" }}
      >
        <h2>{averageRating}</h2>
        <div className="d-flex align-items-center gap-1">
          {[1, 2, 3, 4, 5].map((star, index) => (
            <FaStar
              key={index}
              color={
                index + 1 <= Math.round(averageRating) ? "#ffc107" : "#e4e5e9"
              }
              size={20}
            />
          ))}
        </div>
        <small>({reviews.length} Reviews)</small>
      </div>

      {/* Tags for star ratings */}
      <div className="d-flex mb-3 flex-wrap gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleTagClick(star)}
            className={`btn btn-sm ${
              selectedStar === star ? "btn-primary text-white" : "btn-secondary"
            }`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "5px 10px",
              borderRadius: "20px",
              border: "1px solid black",
            }}
          >
            {star} <FaStar color="#ffc107" size={14} />
          </button>
        ))}
      </div>

      <div className="d-flex flex-column align-items-start justify-content-start m-0 p-0 w-100">
        {/* Review Input */}
        {!hasReviewed && (
          <ReviewInput data={userInfo} onSubmit={handleAddReview} />
        )}

        {/* List of Review Cards */}
        {currentReviews.length > 0 ? (
          currentReviews.map((review, index) => (
            <ReviewCard key={index} data={review} className="w-100" />
          ))
        ) : (
          <p>No reviews available.</p>
        )}
      </div>

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            activeClassName={"active"}
            previousClassName={"page-item"}
            nextClassName={"page-item"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            previousLinkClassName={"page-link"}
            nextLinkClassName={"page-link"}
            breakClassName={"page-item"}
            breakLinkClassName={"page-link"}
          />
        </div>
      )}
    </div>
  );
}

export default ReviewsTab;
