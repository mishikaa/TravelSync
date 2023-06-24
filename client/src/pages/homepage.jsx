import React from 'react'
import { Navbar } from '../components/Homepage/Navbar'
import './homepage.css';

export const HomePage = () => {
  return (
    <div className='homepage'>
      <Navbar />
      <div className='mainbox'>
        <div className='text'>
          <h2>
            Are you tired of traveling alone or struggling to find like-minded companions 
            for your trips?
          </h2>
          <p className='about'>
            Look no further – TravelSync is here to revolutionize the way 
            you plan, coordinate, and embark on unforgettable journeys.
          </p>
        </div>
        <img src="/assets/homepage.png" alt="homepageImg" />
      </div>
    </div>
  )
}
