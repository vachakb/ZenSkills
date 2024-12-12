// BarChartComponent.jsx
import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChartComponent = () => {
  // Define initial data for today's job fields
  const [data, setData] = useState({
    labels: ['Software Engineering', 'Data Science', 'Product Management', 'Design', 'Marketing'],
    datasets: [
      {
        label: "Today's Major Job Fields",
        data: [30, 25, 20, 15, 10], // Example job field counts
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  });

  // Handle the selection of other options (e.g., by week, month, etc.)
  const handleChange = (event) => {
    const selectedOption = event.target.value;

    if (selectedOption === 'week') {
      setData({
        labels: ['Software Engineering', 'Data Science', 'Product Management', 'Design', 'Marketing'],
        datasets: [
          {
            label: "Major Job Fields (Week)",
            data: [40, 30, 15, 10, 5], // Example data for the week
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          },
        ],
      });
    } else if (selectedOption === 'month') {
      setData({
        labels: ['Software Engineering', 'Data Science', 'Product Management', 'Design', 'Marketing'],
        datasets: [
          {
            label: "Major Job Fields (Month)",
            data: [50, 35, 25, 20, 15], // Example data for the month
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      });
    } else {
      setData({
        labels: ['Software Engineering', 'Data Science', 'Product Management', 'Design', 'Marketing'],
        datasets: [
          {
            label: "Today's Major Job Fields",
            data: [30, 25, 20, 15, 10], // Reset to today's data
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      });
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="text-center mb-4">Major Job Fields</h3>
      
      {/* Dropdown to select different time frames */}
      <div className="mb-3">
        <label htmlFor="jobFields" className="form-label">Select Time Frame:</label>
        <select id="jobFields" className="form-select" onChange={handleChange}>
          <option value="today">Today's Major Fields</option>
          <option value="week">This Week's Major Fields</option>
          <option value="month">This Month's Major Fields</option>
        </select>
      </div>

      {/* Bar chart */}
      <div className="chart-container">
        <Bar data={data} />
      </div>
    </div>
  );
};

export default BarChartComponent;
