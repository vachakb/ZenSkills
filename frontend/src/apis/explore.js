import { axiosInstance } from "./commons";

// tags
export async function fetchTags() {
  try {
    return await axiosInstance.get(`/tags`);
  } catch (error) {
    console.log("Error fetching mentors: ", error);
  }
}

// mentors
export async function fetchMentors(
  currentPage,
  itemsPerPage,
  searchTerm,
  selectedTags
) {
  try {
    return await axiosInstance.get(`/mentors`, {
      params: {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        selectedTags: selectedTags.map((tag) => tag.tag_name).join(","),
      },
    });
  } catch (error) {
    console.log("Error fetching tags: ", error);
  }
}

// mentors by AI
export async function fetchMentorsbyAI(query) {
  try {
    const response = await axiosInstance.post("/mentors/recommendations/extract-skills", {
      query: {
        message: query,
      },
    });
    
    if (!response.data.mentors) {
      throw new Error("No mentors found in response");
    }
    
    return response;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    if (error.message === "No mentors found in response") {
      throw new Error("No mentors found matching your requirements");
    } else {
      // Network or other errors
      throw new Error("Failed to fetch recommendations. Please try again.");
    }
  }
}

// Jobs
export async function fetchJobs(
  searchTerm,
  locationInput,
  selectedJobTypess,
  minSalary,
  maxSalary,
  currentPage,
  itemsPerPage
) {
  try {
    return await axiosInstance.get("/jobs", {
      params: {
        search: searchTerm,
        location: locationInput,
        jobTypess: selectedJobTypess,
        salaryRange: `${minSalary}-${maxSalary}`,
        page: currentPage + 1,
        limit: itemsPerPage,
      },
    });
  } catch (error) {
    console.error("Error fetching Jobs: ", error);
    return null;
  }
}

// particular job
export async function fetchJobDetails(jobId) {
  return await axiosInstance.get(`http://localhost:5000/api/jobs/${jobId}`);
}
