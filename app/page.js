import Link from "next/link";
import VideoWalkthrough from "@/components/VideoWalkthrough";

const HomePage = () => {
  return (
    <>
      <div className="hero bg-base-200">
        <div className="hero-content text-center ">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold special leading-tight tracking-wide">
              LEARN LANGUAGES THE FUN WAY!
            </h1>
            <p className="py-6 text-xl md:text-1xl lg:text-2xl md:text:lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 leading-tight tracking-wide">
              Create your own stories and unlock a new world where you learn
              languages through fun and engaging stories in dual language
              format.
            </p>
            <Link href="/chat" className="btn btn-secondary">
              Get Started
            </Link>
          </div>
        </div>
      </div>
      <VideoWalkthrough />{" "}
    </>
  );
};

export default HomePage;
