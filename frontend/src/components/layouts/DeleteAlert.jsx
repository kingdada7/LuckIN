import React from 'react'

const DeleteAlert = ({content,onDelete}) => {
  return (
    <div>
          <p className="text-sm">{content}</p>
          <div className='flex justify-end mt-6'>
            <button className='flex items-center gap-2 justify-center text-xs md:text-sm font-medium text-rose-500 whitespace-nowrap bg-rose-50 border border-rose-100 rounded-lg px-4 py-2.5 cursor-pointer' type='button' onClick={onDelete}>Delete</button>
          </div>
    </div>
  )
}

export default DeleteAlert
