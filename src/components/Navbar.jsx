import React from 'react'

const Navbar = () => {
  return (
    <nav className="bg-blue-900 text-white px-6 py-4 flex justify-between">
        <h1 className="font-bold text-lg">WaterChain</h1>
        <div className="space-x-4">
          <Link to="/verify">Verify Water</Link>
          <Link to="/report">Report Water</Link>
          <Link to="/about">About</Link>
          <Link to="/login" className="bg-white text-blue-900 px-3 py-1 rounded">
            Login
          </Link>
        </div>
      </nav>
  )
}

export default Navbar
