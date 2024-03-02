import React from "react";
import Lottie from "lottie-react";
import { Vortex } from "react-loader-spinner";
import homeLottie from "../../lottie/omlet lottie.json";
const LottieLoading = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="loaders">
        <Lottie
          animationData={homeLottie}
          loop={true}
          autoplay={true}
          rendererSettings={{
            preserveAspectRatio: "YMid slice",
          }}
          style={{ width: "400px", height: "300px" }}
        />
      </div>
    </div>
  );
};

export default LottieLoading;
