//import React from 'react'
import Title from '../components/Title'
//import Title from '../components/Title'
const About = () => {
  return (
    <div>
      <div className='text-2xl tex-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={'US'} />

      </div>
      <div className='my-10 flex flex-col md:flex-row gap-16'>

    <img src="/all.jpg" alt=""  />

    <div className='flex flex-col justify-center gap-6 md:w-2/4 text-grey-600'>
   <p>Welcome to Attire Alley, your one-stop online store for authentic traditional dresses and jewelry from Nepal. We offer a curated collection of handcrafted ethnic wear and exquisite jewelry that celebrate Nepal’s rich cultural heritage. Shop with us for quality, elegance, and tradition—all at your fingertips!</p>
   <p>At Attire Alley, we are committed to providing a seamless shopping experience, ensuring quality, authenticity, and customer satisfaction. Our collection celebrates the artistry of Nepalese craftsmanship, blending timeless designs with modern convenience. Explore our store to discover exquisite pieces that connect you to Nepal’s heritage and make every moment special. Shop with us today and embrace the elegance of tradition!</p>
    <b className='text-grey-800'>Our Mission</b>
     <p>Our mission is to preserve and promote Nepal’s rich cultural heritage by providing high-quality traditional dresses and handcrafted jewelry to customers worldwide. We are dedicated to supporting local artisans, ensuring authenticity, and delivering exquisite craftsmanship with every piece. Through our platform, we aim to make Nepalese tradition accessible to all while fostering a deep appreciation for its timeless beauty and artistry.</p>
    </div>
      </div>
      <div className='text-xl py-4'>
        <Title text1={'Why'} text2={'CHOOSE US'} />

      </div>
      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Quality Assurance:</b>
            <p>we are committed to offering only the finest traditional dresses and jewelry, crafted with precision and care. Our products undergo strict quality checks to ensure authenticity, durability, and excellence. By sourcing from skilled artisans and using premium materials, we guarantee that every piece reflects Nepal’s rich heritage while maintaining superior craftsmanship.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Convenience:</b>
            <p>We strive to make your shopping experience seamless and hassle-free. Our user-friendly online store allows you to browse, select, and purchase your favorite traditional attire and jewelry from the comfort of your home. With secure payment options, fast delivery, and easy returns, we ensure a smooth and enjoyable shopping journey for our customers.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Expectional Cutomer Service:</b>
           <p>Customer satisfaction is at the heart of everything we do. Our dedicated support team is always ready to assist you with inquiries, order tracking, and personalized recommendations. We value our customers and go the extra mile to provide responsive, friendly, and reliable service, making your experience with us truly exceptional.</p>
        </div>
      </div>
      
    </div>

   // <Newsletter />
  )
}

export default About
