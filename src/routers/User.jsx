import React from "react";
import { Route, Routes } from "react-router-dom";
import RequerAuth from "../features/RequerAuth";
import LottieLoading from "../component/Loading/LottieLoading";
import Profile from "../pages/User/UserProfile/Profile";
const MyLearning = React.lazy(() =>
  import("../pages/User/MyLearnings/MyLearning")
);
import UserRoom from "../pages/User/UserRoom/UserRoom";
import VideoSection from "../pages/User/VideoSection/VideoSection";
const Blog = React.lazy(() => import("../pages/User/Blog/Blog"));
import MyBlog from "../pages/User/MyBlog";
import BlogDetails from "../pages/User/Blog/BlogDetails";

const Role = 2000;
function User() {
  return (
    <Routes>
      <Route element={<RequerAuth allows={[Role]} />}>
        <Route exact path="/profile" element={<Profile />} />
        <Route
          path="/my-learning"
          element={
            <React.Suspense fallback={<LottieLoading />}>
              <MyLearning />{" "}
            </React.Suspense>
          }
        />
        <Route path="/live-room/:roomCode" element={<UserRoom />} />
        <Route path="/coursefullvideos" element={<VideoSection />} />
        <Route
          path="/blog"
          element={
            <React.Suspense fallback={<LottieLoading />}>
              <Blog />{" "}
            </React.Suspense>
          }
        />
        <Route path="/blogDetails" element={<BlogDetails />} />
        <Route path="/my-blog" element={<MyBlog />} />
      </Route>
    </Routes>
  );
}

export default User;
