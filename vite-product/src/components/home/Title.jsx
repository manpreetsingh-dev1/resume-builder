import React from "react";

const Title = ({ title, description }) => {
  return (
    <div className="home-body mt-6 text-center text-[#5e4f3d]">
      <h2 className="home-display text-4xl text-[#4c3f31] sm:text-5xl">
        {title}
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#76634d] sm:text-base">
        {description}
      </p>
    </div>
  );
};

export default Title;
