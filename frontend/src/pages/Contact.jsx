//import React from 'react'
import NewsLetterBox from '../components/NewsLetterBox'
import Title from '../components/Title'
const Contact = () => {
  return (
    <div className="text-center text-xl pt-10 border-t" >
      <Title text1={'CONTACT'} text2={'US'} />
      <div className='my-10 flex flex-col justify-left md:flex-row gap-10 mb-28'>
        
      <img className='w-full md:max-w-[780px]' src="/contact.jpg" alt= "" />
      <div className='flex flex-col justify-right items-start gap-6'>
        <p className='font-semibold text-l text-gray-600'>Our Store</p>
        
        <p className='text-gray-500'>7400 Lalitpur Sanepa<br />Sanepa Height,Nepal</p> 
        <p className='text-gray-500'>Telephone: (+977) 3487897897  <br /> Email:manshikandu@gmail.com</p> <br />
       
      </div>
      </div>
      <NewsLetterBox />
    </div>
  )
}

export default Contact
