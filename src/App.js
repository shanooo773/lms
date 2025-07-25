import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConvexProvider } from 'convex/react';
import { convex } from './convex/client';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import Navbar from './Components/Navbar';
import Courses from './Pages/Courses';
import EnhancedCoursesPage from './Pages/EnhancedCoursesPage';
import Footer from './Components/Footer';
import Pricing from './Pages/Pricing';
import Login from './Pages/LoginSignup/Login';
import Signup from './Pages/LoginSignup/Signup';
import Contact from './Pages/Contact';
import Home from './Pages/Home';
import Info from './Pages/Info';
import Profile from "./Pages/Profile";
import WhatsappIcon from "./Assests/WhatsApp-logo.png";
import CourseDetails from './Pages/CourseDetails';
import PricingPage from './Pages/PricingPage';
import WorkShops from './Pages/WorkShops';
import { Payment } from './Components/Payment';
import EditProfile from "./Components/ProfileEdit";
import Membership from './Components/Membership';
import PurchaseHistory from "./Components/Purchase";
import CreditCard from "./Components/CreditCard";
import Address from './Components/Address';
import ProfileContact from './Components/ProfileContact';
import CoursesSection from './Components/CoursesSection';
import LearningPage from './Pages/LearningPage';
import DashboardPage from './Pages/DashboardPage';
import AdminDashboard from './Components/AdminDashboard';
import InstructorDashboard from './Components/InstructorDashboard';

function App() {
  return (
    <ConvexProvider client={convex}>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Navbar/>
            <Routes>
  <Route path='/' element={<Home />} />
  <Route path='/course/:id' element={<Pricing />} />
  <Route path='/coursedetails/:id' element={<CourseDetails />} />
  <Route path='/course' element={<Courses />} />
  <Route path='/courses' element={<EnhancedCoursesPage />} />
  <Route path='/learn/:courseId' element={<LearningPage />} />
  <Route path='/dashboard' element={<DashboardPage />} />
  <Route path='/admin' element={<AdminDashboard />} />
  <Route path='/instructor' element={<InstructorDashboard />} />
  <Route path='/info' element={<Info />} />
  <Route path='/contact' element={<Contact />} />
  <Route path='/login' element={<Login />} />
  <Route path='/signup' element={<Signup />} />
  <Route path='/userprofile' element={<Profile />} />
  <Route path='/pricing' element={<PricingPage />} />
  <Route path='/workshops' element={<WorkShops />} />
  <Route path='/payment' element={<Payment />} />

  {/* Nested Profile Routes */}
  <Route path="/userprofile-editprofile" element={<EditProfile />} />
  <Route path="/userprofile-membership" element={<Membership />} />
  <Route path="/userprofile-purchase" element={<PurchaseHistory />} />
  <Route path="/userprofile-editcreditcard" element={<CreditCard />} />
  <Route path="/userprofile-address" element={<Address />} />
  <Route path="/userprofile-courses" element={<CoursesSection />} />
  <Route path="/userprofile-profilecontact" element={<ProfileContact />} />
</Routes>

        <img src={WhatsappIcon} alt='WhatsappIcon' className="cursor-pointer hover:scale-110" style={{width:"4rem", height:"2.5rem", position:'fixed', bottom:50, right:15}}/>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  </ToastProvider>
</ConvexProvider>
  );
}

export default App;
