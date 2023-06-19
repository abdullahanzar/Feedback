import React from 'react'
import './FeedbackSection.css'

export default function FeedbackSection() {
  return (
    <div className='FeedbackSection'>
        <div className="banner">
          <p>Feedback</p>
          <p>Apply Filter</p>
        </div>
        <div className="suggestions">
          <p>Suggestions</p>
          <p>Sort by: <span>Upvotes</span></p>
          <button>+ Add Product</button>
        </div>
    </div>
  )
}
