import GoogleButton from "@/components/GoogleButton";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 blue-100 to-blue-600" />
      <div className="absolute inset-0 opacity-50">
        <svg
          className="h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill="rgba(255,255,255,0.3)"
            fillOpacity="1"
            d="M0,32L48,80C96,128,192,224,288,224C384,224,480,128,576,90.7C672,53,768,75,864,96C960,117,1056,139,1152,149.3C1248,160,1344,160,1392,160L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        <h1 className="text-4xl font-bold text-white mb-8 tracking-wide">
          Welcome to Adventure
        </h1>
        <p className="text-xl text-white mb-12 max-w-md mx-auto">
          Embark on your language learning journey with us
        </p>{" "}
        <GoogleButton />
      </div>
    </div>
  );
}
