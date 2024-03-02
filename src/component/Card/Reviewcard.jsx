// import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import { selectCurrentToken } from "../../context/authReducer";

// import {
//   Card,
//   CardHeader,
//   CardBody,
//   CardFooter,
//   Typography,
//   IconButton,
// } from "@material-tailwind/react";
// import { axiosPrivate } from "../../api/axios";

// const Reviewcard = () => {
//   const [reviews, setReviews] = useState([]);
//   const token = useSelector(selectCurrentToken);

//   useEffect(() => {
//     const fetchReview = async () => {
//       try {
//         const response = await axiosPrivate.get("/reviews", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setReviews(response.data);
//       } catch (error) {
//         console.log(error.message);
//       }
//     };
//     fetchReview();
//   }, [token]);

//   return (
//     <div>
//       {reviews?.map((review) => (
//         <Card key={review.date} className="w-full max-w-[26rem] shadow-lg">
//           <CardHeader floated={false} color="blue-gray">
//             {/* You can customize the header content as needed */}
//           </CardHeader>
//           <CardBody>
//             <div className="mb-3 flex items-center justify-between">
//               <Typography
//                 variant="h5"
//                 color="blue-gray"
//                 className="font-medium"
//               >
//                 {review.user}
//               </Typography>
//               <Typography
//                 color="blue-gray"
//                 className="flex items-center gap-1.5 font-normal"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   viewBox="0 0 24 24"
//                   fill="currentColor"
//                   className="-mt-0.5 h-5 w-5 text-yellow-700"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//                 {review.rating}
//               </Typography>
//             </div>
//             <Typography color="gray">{review.review}</Typography>
//           </CardBody>
//           <CardFooter className="pt-3">
//             {/* Add any additional elements you want in the footer */}
//           </CardFooter>
//         </Card>
//       ))}
//     </div>
//   );
// };

// export default Reviewcard;
import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";

const Reviewcard = ({ review }) => {
  // Function to generate stars based on the rating
  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < review.rating; i++) {
      stars.push(
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="-mt-0.5 h-5 w-5 text-yellow-700"
        >
          <path
            fillRule="evenodd"
            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
            clipRule="evenodd"
          />
        </svg>
      );
    }
    return stars;
  };

  return (
    <Card className="w-full max-w-[26rem] shadow-lg">
      <CardHeader floated={false} color="blue-gray">
        <img src={review.coverImage.url} alt="Course Cover" />
      </CardHeader>
      <CardBody>
        <div className="mb-3 flex items-center justify-between">
          <Typography variant="h5" color="blue-gray" className="font-medium">
            {review.user}
          </Typography>
          <div className="flex items-center gap-1.5 font-normal">
            {renderStars()}
          </div>
        </div>
        <Typography color="gray">{review.review}</Typography>
      </CardBody>
      <CardFooter className="pt-3">
        {/* Add any additional elements you want in the footer */}
      </CardFooter>
    </Card>
  );
};

Reviewcard.propTypes = {
  review: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    user: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    review: PropTypes.string.isRequired,
    coverImage: PropTypes.shape({
      url: PropTypes.string.isRequired,
    }).isRequired,
    // Add other properties as needed
  }).isRequired,
};

export default Reviewcard;
