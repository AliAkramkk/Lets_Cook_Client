import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const AddCourseBtn = () => {
  return (
    <div className="w-1/4 p-4">
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
        <div className="p-6">
          <h5 className="text-xl font-medium text-gray-800">Welcome, Chef!</h5>
          <p className="mt-2 text-sm text-gray-600">
            Ready to add a new course to your menu?
          </p>
        </div>
        <div className="p-6 bg-gray-100 border-t border-gray-200">
          <Link to="/chef/add-course">
            <button
              type="button"
              className="inline-block w-full py-2 px-4 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600 transition duration-300 focus:outline-none focus:ring focus:border-blue-400"
            >
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              Add Course
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AddCourseBtn;
