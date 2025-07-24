import React from "react";
import Lottie from "lottie-react";
import homeLottie from "../../lottie/home.json";
const Homelottie = () => {
  return (
    <div>
      <Lottie
        animationData={homeLottie}
        loop={true}
        autoplay={true}
        rendererSettings={{
          preserveAspectRatio: "xMidYMid slice",
        }}
        className=""
        // style={{ width: "600px", height: "600px" }}
      />
    </div>
  );
};
export default Homelottie;
