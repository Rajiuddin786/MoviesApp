import React from 'react'

const Search = ({searchTerm,setSearchTerm}) => {
  return (
    <div className='search'>
        <div>
            <img src='./Search-Input.png' alt='search' />
            <input
            type='text'
            placeholder='Search Through thousand of movies'
            value={searchTerm}
            onChange={(event)=>setSearchTerm(event.target.value)}
            ></input>
        </div>
    </div>
  )
}

export default Search