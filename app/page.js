import Link from "next/link";
import VideoWalkthrough from "@/components/VideoWalkthrough";

const HomePage = () => {
  return (
    <div className="hero bg-base-200 flex flex-col">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold special leading-tight tracking-wide">
            LEARN LANGUAGES THE FUN WAY!
          </h1>

          <h2 className="py-6 text-lg md:text-xl lg:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 leading-tight tracking-wide">
            Create your own stories and unlock a new world where you learn
            languages through fun and engaging stories in dual language format.
          </h2>

          <Link href="/chat" className="btn btn-secondary">
            Get Started
          </Link>
        </div>
      </div>
      <div className="hero-content">
        <VideoWalkthrough />
      </div>
    </div>
  );
};

export default HomePage;
