import { Book, BookOpen, ChevronRight, Languages, Plus } from "lucide-react";

function StoryCard({ story }) {
  console.log("The Story is", story);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-100 hover:border-blue-100">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Book className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            {/* <h3 className="font-semibold text-gray-800">STORY TITLE</h3> */}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-500">
                {story.created_at.slice(0, 10)}
              </span>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1">
                <Languages className="w-3 h-3 text-gray-400" />
                <span className="text-sm tracking-wide bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                  {story?.translate_to}
                </span>
              </div>
            </div>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
      <p className="mt-3 text-sm text-gray-600 line-clamp-2">
        {story.translated_story.slice(0, 100)}...
      </p>
    </div>
  );
}

export default StoryCard;
