import React, { useState, useEffect } from "react";

const TypingEffect = ({ text, speed = 100 }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text[index]);
      index++;
      if (index === text.length) {
        clearInterval(interval); // Stop when the full text is displayed.
      }
    }, speed);

    return () => clearInterval(interval); // Cleanup on unmount.
  }, [text, speed]);

  return <h1>{displayedText}</h1>;
};

export default TypingEffect;
