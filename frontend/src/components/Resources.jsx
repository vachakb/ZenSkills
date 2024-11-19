import React, { useState } from "react";

function ResourcesTab() {
  // Initial resource data
  const initialResources = [
    {
      id: 1,
      title: "React Documentation",
      description: "Official React documentation for beginners.",
      fileType: "link",
      fileUrl: "https://reactjs.org",
      uploadedAt: "2024-11-19 10:30 AM",
    },
    {
      id: 2,
      title: "Mindfulness Image",
      description: "An image to relax your mind.",
      fileType: "image",
      fileUrl: "../../public/meditate-5353620_1280.jpg",
      uploadedAt: "2024-11-19 12:45 PM",
    },
    {
      id: 3,
      title: "Motivational Audio",
      description: "A short audio clip to boost your motivation.",
      fileType: "audio",
      fileUrl: "/path/to/audio.mp3",
      uploadedAt: "2024-11-19 03:00 PM",
    },
    {
      id: 4,
      title: "Productivity Video",
      description: "A video on improving productivity.",
      fileType: "video",
      fileUrl: "/path/to/video.mp4",
      uploadedAt: "2024-11-19 05:15 PM",
    },
    {
      id: 5,
      title: "Project Guidelines PDF",
      description: "Guidelines for completing your project successfully.",
      fileType: "pdf",
      fileUrl: "/path/to/document.pdf",
      uploadedAt: "2024-11-19 06:00 PM",
    },
  ];

  // State to hold resources
  const [resources, setResources] = useState(initialResources);

  return (
    <div className="container py-3">
     

      {resources.map((resource) => (
        <div
          key={resource.id}
          className="card mb-3"
          style={{ maxWidth: "100%", padding: "10px" }}
        >
          <div className="card-body">
            <h5 className="card-title">{resource.title}</h5>
            <p className="card-text">{resource.description}</p>
            <p className="text-muted">
              Uploaded on: {resource.uploadedAt}
            </p>
            <div>
              {resource.fileType === "link" && (
                <a
                  href={resource.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  Open Link
                </a>
              )}

              {resource.fileType === "image" && (
                <img
                  src={resource.fileUrl}
                  alt={resource.title}
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              )}

              {resource.fileType === "audio" && (
                <audio controls style={{ width: "100%" }}>
                  <source src={resource.fileUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              )}

              {resource.fileType === "video" && (
                <video controls style={{ width: "100%" }}>
                  <source src={resource.fileUrl} type="video/mp4" />
                  Your browser does not support the video element.
                </video>
              )}

              {resource.fileType === "pdf" && (
                <a
                  href={resource.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                >
                  View PDF
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ResourcesTab;
