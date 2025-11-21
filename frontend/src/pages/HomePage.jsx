// //import React from 'react'
const categories = [ 
 
 { href: "/ladies", name: "ladies Attire", imageUrl: "https://i.ebayimg.com/thumbs/images/g/P1AAAOSwiMxmISkY/s-l1000.jpg" },
 { href: "/male", name: "Male Attire", imageUrl: "https://i5.walmartimages.com/seo/black-hoodies-for-men-mens-autumn-and-winter-casual-loose-solid-hooded-sweater-top_54ffdedd-50b7-40ed-b544-a5090f9978d3.016bae9bd5bda976b748b11f072fd1b5.jpeg" },
 { href: "/kids", name: "kids Attire", imageUrl: "https://i.pinimg.com/736x/60/55/e4/6055e4984529edd5b1130829f8a59177.jpg" },
 { href: "/accessories", name: "Jewelery", imageUrl: "https://m.media-amazon.com/images/I/71ROGW+69KL._AC_UF1000,1000_QL80_.jpg" },
 { href: "/bags", name: "Bags", imageUrl: "https://images-cdn.ubuy.co.in/65f29bb3194112168d5f08a5-4pcs-women-fashion-handbags-purses.jpg" },
 { href: "/Set", name: "set", imageUrl: "https://huesfab.com/cdn/shop/files/1_8_1.webp?v=1750938977&width=2048" },
 //{ href: "/suits", name: "Suits", imageUrl: "/suits.jpg" },
 
 ]
import CategoryItem from "../components/CategoryItem"
import NewsLetterBox from "../components/NewsLetterBox"
const HomePage = () => {
  return (
    <div className="relative min-h-screen text-black overflow-hidden">
     <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
     <h1 className='text-center text-5xl sm:text-6xl font-bold text-gray-800'>
					Explore Our Categories
				</h1>
				<p className='text-center text-xl text-gray-600 mb-12'>
					Discover the traditional and  eco-friendly fashion
				</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(category => (
            <CategoryItem
            category = { category}
            key = {category.name}
            />
          ))}
        </div>
     </div>
     <NewsLetterBox/>
    </div>
  )
}

export default HomePage




