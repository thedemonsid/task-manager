"use client";
import React from "react";

const Greeting = () => {
  const date = new Date();
  const hours = date.getHours(); //* Servers are not india so proble with the time

  let greeting = "Good morning!";

  let emoji = "🌞";

  if (hours >= 12 && hours < 15) {
    greeting = "Good afternoon!";

    emoji = "🌤️";
  } else if (hours >= 15 && hours < 18) {
    greeting = "Hello there!";

    emoji = "☕";
  } else if (hours >= 18 && hours < 22) {
    greeting = "Good evening!";

    emoji = "🌆";
  } else if (hours >= 22 || hours < 1) {
    greeting = "Working late?";

    emoji = "🌙";
  } else if (hours >= 1 && hours < 6) {
    greeting = "Hello Night Owl!";

    emoji = "🦉";
  } else if (hours >= 6 && hours < 9) {
    greeting = "Early bird!";

    emoji = "🐦";
  } else if (hours >= 9 && hours < 12) {
    greeting = "Good morning!";

    emoji = "🌞";
  }
  return (
    <>
      <span className="inline-block text-4xl mb-3 animate-bounce">{emoji}</span>
      <h1 className="text-4xl sm:text-5xl font-bold mb-4">{greeting}!</h1>
    </>
  );
};

export default Greeting;
