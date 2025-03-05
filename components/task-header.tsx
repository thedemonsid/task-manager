// The Header component remains unchanged
export const Header = () => {
  const date = new Date();
  const hours = date.getHours();

  let greeting = "Good morning!";
  let description = "Let's kick off the day with some productivity!";
  let emoji = "🌞";

  if (hours >= 12 && hours < 15) {
    greeting = "Good afternoon!";
    description = "Power through your tasks before the day ends!";
    emoji = "🌤️";
  } else if (hours >= 15 && hours < 18) {
    greeting = "Hello there!";
    description = "Time for a productive evening ahead!";
    emoji = "☕";
  } else if (hours >= 18 && hours < 22) {
    greeting = "Good evening!";
    description = "Let's wrap up some tasks before the day ends.";
    emoji = "🌆";
  } else if (hours >= 22 || hours < 1) {
    greeting = "Working late?";
    description = "Don't forget to get some rest soon!";
    emoji = "🌙";
  } else if (hours >= 1 && hours < 6) {
    greeting = "Hello Night Owl!";
    description = "The most productive hours for the focused mind.";
    emoji = "🦉";
  } else if (hours >= 6 && hours < 9) {
    greeting = "Early bird!";
    description = "Getting things done before everyone wakes up!";
    emoji = "🐦";
  } else if (hours >= 9 && hours < 12) {
    greeting = "Good morning!";
    description = "Let's make this day count!";
    emoji = "🌞";
  }

  return (
    <div className="mb-6">
      <h1 className="text-xl font-medium text-white flex items-center gap-2">
        {greeting}
        <span className="inline-block cursor-pointer hover:animate-bounce">
          {emoji}
        </span>
      </h1>
      <p className="text-zinc-400">{description}</p>
    </div>
  );
};
