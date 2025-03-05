import Link from "next/link";
import { Button } from "@/components/ui/button";

const Home = () => {
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
    <div className="relative min-h-screen overflow-hidden pt-4">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center ">
          <span className="inline-block text-4xl mb-3 animate-bounce">
            {emoji}
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">{greeting}!</h1>
          <p className="text-xl text-zinc-300 mb-8">
            Welcome to your personal task management system
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90"
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-zinc-700 hover:bg-zinc-800"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-zinc-800/50 p-6 rounded-lg border border-zinc-700/50 backdrop-blur-sm">
            <div className="bg-blue-500/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h2 className="text-xl font-medium mb-2">Task Organization</h2>
            <p className="text-zinc-400">
              Organize your tasks with our intuitive interface and keep track of
              all your projects in one place.
            </p>
          </div>

          <div className="bg-zinc-800/50 p-6 rounded-lg border border-zinc-700/50 backdrop-blur-sm">
            <div className="bg-amber-500/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-amber-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-medium mb-2">Time Management</h2>
            <p className="text-zinc-400">
              Set deadlines, reminders, and prioritize your tasks to make the
              most of your time.
            </p>
          </div>

          <div className="bg-zinc-800/50 p-6 rounded-lg border border-zinc-700/50 backdrop-blur-sm">
            <div className="bg-green-500/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-medium mb-2">Progress Tracking</h2>
            <p className="text-zinc-400">
              Monitor your productivity and track your progress with visual
              charts and statistics.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Ready to boost your productivity?
          </h2>
          <p className="text-zinc-400 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have transformed their workflow and
            taken control of their tasks.
          </p>
          <Link
            href="/tasks"
            className="inline-block bg-white text-zinc-900 font-medium px-6 py-3 rounded-lg hover:bg-zinc-200 transition-colors"
          >
            Try it for free
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
