import { useEffect, useState } from "react";
import Mentorcard from "../components/MentorCard";
import ReactPaginate from "react-paginate";
import axios from "axios";

// remove mentors_ and allTags aguments when api is live

export default function ExploreMentor({ mentors_, demoTags }) {
  const [mentors, setMentors] = useState(mentors_);
  const [searchTerm, setSearchTerm] = useState("");
  const [allTags, setAllTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [noOfMenteesMentored, setNoOfMenteedMentored] = useState(0);
  const [currentPage, setCurrntpage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filterDropdownVisibility, setFilterDropdownVisibility] = useState(false);
  const itemsPerPage = 10;

  // useEffect(()=>{
  //     // fetch cards from backend by api
  //     async function fetchMentors(){
  //         const responce = await axios.get('/api/mentors', {
  //             params:{
  //                 page: currentPage,
  //                 limit: itemsPerPage,
  //                 search: searchTerm,
  //                 selectedTags: selectedTags,
  //                 noOfMenteesMentored: noOfMenteesMentored
  //             }
  //         })
  //         setMentors(responce.data.mentors)
  //         setTotalPages(Math.ceil(responce.data.totalMentorsCount/itemsPerPage))
  //     }
  //     fetchMentors()
  // }, [currentPage, noOfMenteesMentored])

  async function handleSearchButtonClick() {
    // if(!searchTerm && selectedTags?.length===0)    return
    try {
      const responce = await axios.get("/api/mentors", {
        params: {
          page: currentPage + 1,
          limit: itemsPerPage,
          search: searchTerm,
          selectedTags: selectedTags,
          noOfMenteesMentored: noOfMenteesMentored,
        },
      });
      //   return all mentors when all query values are null/undefined
      setMentors(responce.data.mentors || []);
      setTotalPages(Math.ceil(responce.data.totalMentorsCount / itemsPerPage));
    } catch (error) {
      console.error("error fetching data: ", error);
    }
  }

  function handlePageChange(selectedItem) {
    setCurrntpage(selectedItem.selected);
  }

  useEffect(() => {
    async function fetchTags() {
      try {
        const responce = await axios.get("/api/mentors");
        setAllTags(responce.data.tags || demoTags);
      } catch (error) {
        console.error("error fetching data: ", error);
      }
    }
    fetchTags();
  }, []);

  function toggleFilterDropdownVisibility(){
    if(filterDropdownVisibility)    setFilterDropdownVisibility(false)
    else                            setFilterDropdownVisibility(true)
  }

  function handleTagClick(tag){
    if(selectedTags.includes(tag)){
        setSelectedTags(selectedTags.filter((Tag)=> Tag!==tag))
    }else{
        setSelectedTags([...selectedTags, tag])
    }
    console.log(selectedTags)
  }

  return (
    <div className="container mt-4">
      {/* search and filter bar */}
      <div className="row mb-4">
        <div className="col-12 col-md-8 mb-3 mb-md-0">
          <input
            type="text"
            className="form-control"
            placeholder="Search Mentors ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-12 col-md-2">
          <button
            className="btn btn-primary w-100 border"
            onClick={handleSearchButtonClick}
          >
            Search
          </button>
        </div>
        <div className="col-12 col-md-2">
          <button className="btn btn-primary w-100" onClick={toggleFilterDropdownVisibility}>Filter</button>
        </div>
      </div>

      {filterDropdownVisibility && (
        <div className="mb-4 border p-2">
          Select Tags <br />
          {allTags.map((tag) => {
            return <button className="btn btn-sm bg-body-secondary rounded-pill m-1" onClick={()=>handleTagClick(tag)}>{tag}</button>;
          })}
        </div>
      )}

      {
        selectedTags?.length!==0 &&
        <div>
            Filters applied:
            {selectedTags.map((tag)=>{
                return <button className="btn btn-sm bg-body-secondary rounded-pill m-1" onClick={()=>handleTagClick(tag)}>{tag}</button>;
            })}
        </div>
      }

      {/* card grid */}
      <div className="row">
        {mentors.map((mentor) => {
          return <Mentorcard mentor={mentor} />;
        })}
        {mentors.length === 0 && <p>No mentors found.</p>}
      </div>

      {/* pagination */}
      <div className="mt-4 d-flex justify-content-center">
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          pageCount={totalPages}
          forcePage={currentPage}
          onPageChange={handlePageChange}
          containerClassName={"pagination"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousClassName={"page-item"}
          previousLinkClassName={"page-link"}
          nextClassName={"page-item"}
          nextLinkClassName={"page-link"}
          activeClassName={"active"}
        />
      </div>
    </div>
  );
}
