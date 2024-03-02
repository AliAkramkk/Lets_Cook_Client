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
        style={{ width: "300px", height: "300px" }}
      />
    </div>
  );
};
export default Homelottie;
