// tags
export async function fetchTags() {
  try {
    return await axios.get("/api/tags");
  } catch (error) {
    console.log("Error fetching tags: ", error);
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
    return await axios.get("/api/mentors", {
      params: {
        page: currentPage + 1,
        limit: itemsPerPage,
        search: searchTerm,
        selectedTags: selectedTags,
      },
    });
  } catch (error) {
    console.log("Error fetching tags: ", error);
  }
}

// mentors by AI
export async function fetchMentorsbyAI(query) {
  try {
    return await axios.post("/api/mentors/filter-ai", {
      query,
    });
  } catch (error) {
    console.log("Error fetching tags: ", error);
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
    return await xios.get("/api/jobs", {
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
  try {
    return await axios.get(`/api/jobs/${jobId}`);
  } catch (error) {
    console.error("Error fetching job details", error);
    return null;
  }
}
