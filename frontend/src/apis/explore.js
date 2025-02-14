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
    return await axiosInstance.post("/mentors/recommendations/extract-skills", {
      query: {
        message: query,
      },
    });
  } catch (error) {
    console.log("Error fetching recommendations:", error);
    throw error;
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
