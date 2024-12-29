import React from "react";
import {
  Headphones,
  Globe,
  Languages,
  Sparkles,
  BookOpen,
  Mic,
  Brain,
  Target,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Story Generation",
    description:
      "Create engaging, personalized stories that match your interests and learning level",
  },
  {
    icon: Languages,
    title: "Multiple Languages",
    description:
      "Learn in Finnish,Turkish, Spanish, French, German, Italian, and many more languages",
  },
  {
    icon: Headphones,
    title: "Native Audio Playback",
    description:
      "Perfect your pronunciation with high-quality native speaker voice synthesis",
  },
  {
    icon: Target,
    title: "Adaptive Learning",
    description:
      "Stories adapt to your progress, ensuring optimal learning at your pace",
  },
];

const Features = () => {
  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Master Languages Naturally Through Stories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our AI-powered platform creates personalized stories that make
            language learning engaging and effective. Practice reading,
            listening, and speaking with content that matters to you.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white p-8 rounded-xl border-2 border-indigo-100 hover:border-indigo-500 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
            >
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <feature.icon size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
