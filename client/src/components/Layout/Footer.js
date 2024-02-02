import React from 'react'
import { Link } from 'react-router-dom'
import "../../styles/headers.css"

const Footer = () => {
  return (
    <div className='footer'>
        <h4 className='text-center'>
            All Rights Reserved &copy;
        </h4>
        <p className="text-center mt-3">
          <Link className='ohhello' to="/about">About</Link>
          <Link className='ohhello' to="/contact">Contact</Link>
          <Link className='ohhello' to="/policy">Policy</Link>
        </p>
        <p className='text-center font-weight-bold fs-4'>
          Made with ❤️ by Dhawal
        </p>
    </div>
  )
}

export default Footer
