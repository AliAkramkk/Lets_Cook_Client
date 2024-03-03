import React from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import ChefNavbar from "../../../component/Navbar/ChefNavbar";
import Footer from "../../User/Footer/Footer";

const LiveRoom = () => {
  const { roomCode } = useParams();
  function randomID(len) {
    let result = "";
    if (result) return result;
    var chars =
        "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP",
      // "8640a3416ee7edde036c46b1737d4a45f95574670493f897d7c85d6ea3359453",
      maxPos = chars.length,
      i;
    len = len || 5;
    for (i = 0; i < len; i++) {
      result += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return result;
  }

  const myMeeting = async (element) => {
    const appID = 757742058;
    // const appID = 850274082;
    const serverSecret = "d803d8057cd6549a9a97834cd57376cc";
    // const serverSecret = "391d7a0f9f0b749f97284e29c6d34d72";

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomCode,
      randomID(5),
      randomID(5)

      // userId
      // Date.now().toString(),
      // "piyush"
    );
    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zp.joinRoom({
      container: element,
      scenario: {
        mode: ZegoUIKitPrebuilt.LiveStreaming,
        // config: {
        //   role,
        // },
      },
      sharedLinks: [
        {
          name: "copy link",
          url: `https://lets-cook-client.vercel.app/chef/live/${roomCode}`,
        },
      ],
    });
  };
  return (
    <>
      <div className=" bg-gray-100 ">
        <ChefNavbar />
        <div className="mt-10 mb-10">
          <div ref={myMeeting} />
          {/* <h1>Room</h1>
      {roomId} */}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default LiveRoom;
