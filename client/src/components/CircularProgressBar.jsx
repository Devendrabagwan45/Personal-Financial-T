import React from "react";

const CircularProgressBar = ({
  progress,
  size = 50,
  strokeWidth = 6,
  circleOneStroke = "#eee",
  circleTwoStroke = "#00aaff",
}) => {
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  // Calculate stroke dashoffset for progress
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <svg
      width={size}
      height={size}
      style={{ display: "block", margin: "auto" }}
    >
      {/* Background Circle */}
      <circle
        stroke={circleOneStroke}
        fill="transparent"
        strokeWidth={strokeWidth}
        r={radius}
        cx={center}
        cy={center}
      />
      {/* Progress Circle */}
      <circle
        stroke={circleTwoStroke}
        fill="transparent"
        strokeWidth={strokeWidth}
        r={radius}
        cx={center}
        cy={center}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.5s ease" }}
        transform={`rotate(-90 ${center} ${center})`} // Start progress at top
      />
    </svg>
  );
};

export default CircularProgressBar;
