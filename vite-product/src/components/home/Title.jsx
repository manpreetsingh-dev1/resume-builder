import React from "react";

const Title = ({ title, description }) => {
  return (
    <div className="home-body vintage-text mt-6 text-center">
      <h2 className="home-display text-4xl text-[var(--vintage-walnut)] sm:text-5xl">
        {title}
      </h2>
      <p className="vintage-muted-text mx-auto mt-4 max-w-2xl text-sm leading-7 sm:text-base">
        {description}
      </p>
    </div>
  );
};

export default Title;
