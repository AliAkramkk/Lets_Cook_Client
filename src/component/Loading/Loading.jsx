import React from "react";
import { Vortex } from "react-loader-spinner";

function Loading() {
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="loaders">
        <Vortex
          visible={true}
          height="80"
          width="80"
          ariaLabel="vortex-loading"
          wrapperStyle={{}}
          wrapperClass="vortex-wrapper"
          colors={["red", "green", "blue", "yellow", "orange", "purple"]}
        />
      </div>
    </div>
  );
}

export default Loading;
