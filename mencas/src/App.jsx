// src/App.jsx
import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
// import Services from './components/Services'
// import HowItWorks from './components/HowItWorks'
// import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'

function App() {
  return (
    <main className="bg-black text-white">
      <Navbar />
      <Hero />
       {/* <Services /> */}
      {/*<HowItWorks />
      <Testimonials />*/}
      <Contact /> 
      <Footer />
      <ScrollToTop />
    </main>
  )
}

export default App

