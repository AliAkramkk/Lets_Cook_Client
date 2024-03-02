import React from "react";
import { auth } from "../../../context/authReducer";
import { useSelector } from "react-redux";
import UserNavbar from "../../../component/Navbar/UserNavbar";
import ChefNavbar from "../../../component/Navbar/ChefNavbar";
import AdminNavbar from "../../../component/Navbar/AdminNavbar";
import Footer from "./Footer";
import backgroundImage from "../../../../public/signin.jpg"; // Adjust the image path
import letsCookLogo from "../../../assets/Lets cook/log1.png"; // Add your application logo

const PrivacyPage = () => {
  const user = useSelector(auth);
  const getNavbar = () => {
    if (user.role === 1000) {
      return <AdminNavbar />;
    } else if (user.role === 3000) {
      return <ChefNavbar />;
    } else {
      return <UserNavbar />;
    }
  };

  return (
    <>
      <div className="bg-gray-100">
        {getNavbar()}
        <div
          className="min-h-screen flex flex-col items-start justify-start bg-cover bg-center"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <h1 className="text-center text-gray-100 justify-center text-5xl p-2 font-extrabold">
            Privacy Policy
          </h1>
          <div className="p-3 text-white flex flex-col md:flex-row items-center md:items-start">
            <img
              src={letsCookLogo}
              alt="Let's Cook Logo"
              className="mb-4 max-w-xs md:mr-6 md:mb-0"
            />
            <h3 className="text-lg md:text-xl lg:text-2xl mt-4 md:mt-20 mb-20 text-center md:text-left">
              Welcome to <strong>Let's Cook</strong>! We are passionate about
              bringing the joy of cooking to your fingertips.
            </h3>
          </div>
          <div className="bg-gray-100 p-8 text-gray-800">
            <p className="text-lg md:text-xl lg:text-2xl mb-4">
              Our Privacy Policy
            </p>
            <p className="mb-4">
              At <strong>Let's Cook</strong>, we believe that everyone should
              have the opportunity to explore the art of cooking. Our mission is
              to empower culinary enthusiasts of all levels, from beginners to
              seasoned cooks, by providing accessible and engaging cooking
              courses.Curated Courses by Experts: Our platform offers a diverse
              range of cooking courses curated by industry experts and
              experienced chefs. Whether you're a novice or an experienced cook
              looking to refine your skills, we have courses tailored to suit
              your needs. What Sets Us Apart Interactive Learning Experience:
              Immerse yourself in a hands-on learning experience with our
              interactive video lessons, detailed recipes, and step-by-step
              instructions. Gain practical insights and techniques that you can
              apply immediately in your own kitchen. Varied Culinary Themes:
              Explore a rich variety of culinary themes, from international
              cuisines to specialized techniques. Our courses cover a wide
              spectrum, ensuring there's something for everyone, no matter your
              taste or preference. Community and Collaboration: Join a vibrant
              community of cooking enthusiasts! Share your culinary creations,
              exchange tips, and connect with fellow learners. Our platform
              fosters a collaborative environment where the joy of cooking is
              celebrated together. Why Choose [Your Application Name] Flexible
              Learning: Learn at your own pace, on your own schedule. Our
              platform allows you to access courses anytime, anywhere. Whether
              you're a busy professional or a stay-at-home parent, our flexible
              learning approach fits seamlessly into your lifestyle. Quality
              Content: Our courses are crafted with meticulous attention to
              detail. Benefit from high-quality video production, comprehensive
              course materials, and engaging content designed to enhance your
              cooking skills. Continuous Support: Our commitment to your
              culinary journey doesn't end with the course. Enjoy ongoing
              support from our community and access to additional resources that
              will keep you inspired and motivated.
            </p>
            {/* ... (continue with the rest of the content) ... */}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default PrivacyPage;
