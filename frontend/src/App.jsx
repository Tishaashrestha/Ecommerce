import {  Navigate,Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import AdminPage from "./pages/AdminPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import { Toaster } from "react-hot-toast";
import { useUserStore } from "./stores/useUserStore";
import { useEffect } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import Footer from "./components/Footer";
import CategoryPage from "./pages/CategoryPage";
import CartPage from "./pages/CartPage";
import Collection from "./pages/Collection";
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage";
import PurchaseCancel from "./pages/PurchaseCancel";
import { useCartStore } from "./stores/useCartStore";
import ProductPage from "./pages/product";



function App() {
	const  { user,checkAuth,checkingAuth} = useUserStore();
    const{   getCartItems} =useCartStore()
	useEffect(() => {
		checkAuth();
	}, [checkAuth])
	useEffect(() => {
		if(!user) return
		getCartItems()
	},[  getCartItems,user])
    if (checkingAuth) return <LoadingSpinner />;
	return (
		
    // <div className='min-h-screen bg-gradient-to-br from-[#ffffff] via-[#f3f4f6] to-[#e5e7eb] text-[#1E293B] relative overflow-hidden'>
		
		<div className='min-h-screen bg-[#FAE5D3] text-[#1E293B] relative overflow-hidden'>
        <div className='absolute inset-0 overflow-hidden'>
       	<div className='absolute inset-0'>
          </div>
          </div>
    <div className='relative z-50 pt-20'>
			 <Navbar />
			 <Routes>
      
<Route path="/" element = { <HomePage />} />

<Route path="/collection" element = { <Collection />} />
< Route path="/product" element = { <ProductPage /> } />

<Route path="/signup" element={!user ? <SignUpPage /> : <Navigate to="/" />} />
<Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
<Route path="/secret-dashboard" element={user?.role === "admin" ? <AdminPage /> : <Navigate to="/login" />} />
<Route path="/about" element = { user? <About />: <Navigate to= "/login" />} />   
<Route path="/contact" element = { user? <Contact />: <Navigate to= "/login" />} />
<Route path="/cart" element = { user ? <CartPage />: <Navigate to= "/login" />} />
<Route path="/purchase-success" element={user?.role === "customer" ? <PurchaseSuccessPage /> : <Navigate to="/login" />} />
<Route path="/purchase-cancel" element={user?.role === "customer"  ? <PurchaseCancel /> : <Navigate to="/login" />} />

<Route path="/category/:category" element={<CategoryPage />} />


       </Routes>	  
	   <Footer />
		 </div>
		<Toaster />
		</div>
	);
}

export default App;

//in about add it to user? <About /> : <NAvigate to = "/about" /> }