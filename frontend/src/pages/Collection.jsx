// //import React from 'react'
const categories = [ 
 
    { href: "/ladies", name: "ladies Attire", imageUrl: "/magardress.jpg" },
    { href: "/male", name: "Male Attire", imageUrl: "/male attire.jpg" },
    { href: "/kids", name: "kids Attire", imageUrl: "/magar.jpg" },
    { href: "/jewelry", name: "Jewelery", imageUrl: "/jewelery.jpg" },
    { href: "/Set", name: "set", imageUrl: "/set magar.jpg" },
    //{ href: "/suits", name: "Suits", imageUrl: "/suits.jpg" },
    { href: "/bags", name: "Bags", imageUrl: "/bag.jpg" },
    ]
   import CategoryItem from "../components/CategoryItem"
   import NewsLetterBox from "../components/NewsLetterBox"
   const Collection = () => {
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
   
   export default Collection
   
   //import React from 'react'
   
   // const HomePage = () => {
   //   return (
   //     <div>
   //       HomePage
   //     </div>
   //   )
   // }
   
   // export default HomePage
   