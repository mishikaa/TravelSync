import { useEffect, useState } from 'react'
import './SearchBar.css'
import { errorPopup } from '../popup'
import { ChatState } from '../../Context_API/chatProvider'
import axios from 'axios'

const SearchBar = ({search, setSearch, setLoading, setSearchResult}) => {
  const {user} = ChatState()
  
  useEffect(() => {
    const delayDebounceFn = setTimeout(async() => {
    
    try {
      setLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
      // Fetching the data from the backend
      const {data} = await axios.get(`/api/user?search=${search}`,config)
      setLoading(false)
    
      if(data.length > 0) {
      setSearchResult(data) //storing the fetched data in searchResult
      } else {
        setSearchResult(["No results"])
      }

    } catch (error) {
      errorPopup("Error Occured! Failed to Load the Search Results")
      setLoading(false)
    }
  })
  return () => clearTimeout(delayDebounceFn)
  }, [search])
  
  
  return (
    <div className="search-container">
      <input 
        type="text" 
        name="search" 
        onChange={(event) => setSearch(event.target.value)}
        value={search}
        placeholder="Search users to chat" 
        className="search-input"/>
      
        <i className="fas fa-search"></i>      
    </div>
  )
}

export default SearchBar
