import React from "react";
import { Route, Routes } from "react-router-dom";
import RequerAuth from "../features/RequerAuth";
import Loading from "../component/Loading/Loading";

const Classes = React.lazy(() => import("../pages/Chef/Classes/Classes"));
const AddCourse = React.lazy(() => import("../pages/Chef/AddCourse/AddCourse"));
const MyCourse = React.lazy(() => import("../pages/Chef/MyCourse/MyCourse"));
const AddChapters = React.lazy(() =>
  import("../pages/Chef/AddChapters/AddChapters")
);
import VideoDetatils from "../pages/videoDetails/VideoDetatils";
const LiveRoom = React.lazy(() => import("../pages/Chef/LiveRoom/LiveRoom"));
import MyRoom from "../pages/Chef/Myroom/MyRoom";
const EditCourse = React.lazy(() =>
  import("../pages/Chef/EditCourse/EditCourse")
);
import ChefTransactions from "../pages/Chef/ChefTransaction/ChefTransactions";
import LottieLoading from "../component/Loading/LottieLoading";
const ChefHome = React.lazy(() => import("../pages/Chef/ChefHome"));
const ChefVidoes = React.lazy(() =>
  import("../pages/Chef/ChefVideos/ChefVidoes")
);
const ChefProfile = React.lazy(() =>
  import("../pages/Chef/ChefProfile/ChefProfile")
);
const Role = 3000;
function Chef() {
  return (
    <Routes>
      <Route element={<RequerAuth allows={[Role]} />}>
        <Route
          exact
          path="/"
          element={
            <React.Suspense fallback={<LottieLoading />}>
              <ChefHome />
            </React.Suspense>
          }
        />
        <Route
          path="/profile"
          element={
            <React.Suspense fallback={<LottieLoading />}>
              <ChefProfile />
            </React.Suspense>
          }
        />
        <Route
          path="/courseList"
          element={
            <React.Suspense fallback={<LottieLoading />}>
              <Classes />{" "}
            </React.Suspense>
          }
        />

        <Route
          path="/add-course"
          element={
            <React.Suspense fallback={<LottieLoading />}>
              <AddCourse />{" "}
            </React.Suspense>
          }
        />

        <Route
          path="/my-course"
          element={
            <React.Suspense fallback={<LottieLoading />}>
              <MyCourse />{" "}
            </React.Suspense>
          }
        />
        <Route path="/my-room" element={<MyRoom />} />
        <Route
          path="/room/:roomCode"
          element={
            <React.Suspense fallback={<LottieLoading />}>
              <LiveRoom />{" "}
            </React.Suspense>
          }
        />
        <Route
          path="/videos"
          element={
            <React.Suspense fallback={<LottieLoading />}>
              <ChefVidoes />
            </React.Suspense>
          }
        />
        <Route
          path="/add-chapter"
          element={
            <React.Suspense fallback={<LottieLoading />}>
              <AddChapters />{" "}
            </React.Suspense>
          }
        />
        <Route path="/video-details" element={<VideoDetatils />} />
        <Route
          path="/edit-course"
          element={
            <React.Suspense fallback={<LottieLoading />}>
              {" "}
              <EditCourse />{" "}
            </React.Suspense>
          }
        />
        <Route path="/transaction" element={<ChefTransactions />} />
      </Route>
    </Routes>
  );
}

export default Chef;
