/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
// import { AiOutlineClose } from "react-icons/ai";
// import { FcFile } from "react-icons/fc";
import toast, { Toaster } from "react-hot-toast";

const FileUpload = ({
  accept,
  acceptTypes,
  handleFileSelect,
  inputId,
  inputName,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInput = useRef();
  const [fileName, setFileName] = useState(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    const selectedFile = files[0];
    if (selectedFile && selectedFile.size <= 1048576) {
      // Check size 1 MB (1,048,576 bytes)
      const fileName = selectedFile.name.toLowerCase();
      if (
        fileName.endsWith(".jpeg") ||
        fileName.endsWith(".png") ||
        fileName.endsWith(".jpg")
      ) {
        handleFileSelect(selectedFile);
        setFileName(selectedFile.name);
      } else {
        toast.error("please choose image file", {
          position: "bottom-center",
          duration: 2000,
          style: { background: "#FFC107", color: "red" },
          icon: "⚠",
        });
      }
    } else {
      toast.error("please choose file below 1 MB size", {
        position: "bottom-center",
        duration: 2000,
        style: { background: "#FFC107", color: "red" },
        icon: "⚠",
      });
    }
  };

  const removeFile = () => {
    fileInput.current.value = "";
    handleFileSelect(inputName, null);
    setFileName(null);
  };

  const handleChange = (e) => {
    const files = e.target.files;
    const file = files[0];
    if (file && file.size <= 1048576) {
      // Check size 1 MB (1,048,576 bytes)
      const allowedFileTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/bmp",
        "image/webp",
      ];

      if (allowedFileTypes.includes(file.type)) {
        handleFileSelect(file);
        setFileName(files[0].name);
      } else {
        toast.error("Please upload image file", {
          position: "bottom-center",
          duration: 2000,
          style: { background: "#FFC107", color: "red" },
          icon: "⚠",
        });
      }
    } else {
      toast.error("please choose file below 1 MB size", {
        position: "bottom-center",
        duration: 2000,
        style: { background: "#FFC107", color: "red" },
        icon: "⚠",
      });
    }
  };

  return (
    <div className="relative">
      <div
        className={`flex items-center justify-center mt-1 w-full ${
          isDragging
            ? "border-blue-500 bg-gray-600 "
            : "border-gray-300 dark:hover:border-gray-500 "
        } border-2 border-dashed rounded-lg cursor-pointer bg-gray-50  dark:bg-gray-700 hover:bg-gray-300 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => {
          fileInput.current.click();
        }}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {!fileName && (
            <>
              <svg
                className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                ></path>
              </svg>

              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {acceptTypes}
              </p>
            </>
          )}
          {fileName && (
            <>
              {/* <FcFile className="text-[30px]" /> */}

              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                {fileName}
              </p>
            </>
          )}
        </div>
        <input
          id={inputId}
          name={inputName}
          type="file"
          className="hidden"
          ref={fileInput}
          accept={accept}
          // onChange={(e) => handleFileSelect(e.target.files)}
          onChange={handleChange}
        />
      </div>

      {fileName && (
        <button
          type="button"
          className="absolute top-1.5 right-0.5 sm:top-5 sm:right-5 text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-full text-sm px-3 py-1.5 text-center mr-2 mb-2"
          onClick={removeFile}
        >
          {" "}
        </button>
      )}

      <Toaster />
    </div>
  );
};

export default FileUpload;
