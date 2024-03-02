import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { selectCurrentToken } from "../../../context/authReducer";

const ChapterDetails = () => {
  const location = useLocation();
  const chapterId = location.state && location.state.id;

  const [chapter, setChapter] = useState(null);

  return <div>ChapterDetails</div>;
};

export default ChapterDetails;
