import Link from "next/link";

const HomePage = () => {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-6xl font-bold text-primary">Learn Now</h1>
          <p className="py-6 text-lg leading-loose ">
            Learn languages by stories you are interested in!
          </p>
          <Link href="/sign-up" className="btn btn-secondary">
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
  s;
};

export default HomePage;
