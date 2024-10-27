import { getServerSession } from "next-auth";
import { Button } from "@/components/ui/button";
import { getUserByEmail } from "../../_lib/data-service";
import ProfileLevelBar from "@/components/ProfileLevelBar";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { BookOpen, Zap, Repeat } from "lucide-react";
import Image from "next/image";

export default async function ProfilePage() {
  const session = await getServerSession();

  const userDataFromDatabase = await getUserByEmail(session.user.email);
  console.log("User from database", userDataFromDatabase);

  function getEmailUsername(email) {
    const regex = /^[^@]+/;
    const match = email.match(regex);
    return match ? match[0] : null;
  }

  const username = getEmailUsername(userDataFromDatabase.email);

  // This would typically come from your authentication system
  const user = {
    name: username,
    email: userDataFromDatabase.email,
    avatarUrl: session.user.image,
    stats: {
      storiesCreated: userDataFromDatabase.num_stories,
      tokensLeft: userDataFromDatabase.token,
      dailyTransitionsLeft: userDataFromDatabase.total_tokens,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-xl rounded-3xl overflow-hidden ">
        <CardHeader className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-500 text-white p-6 text-center">
          <div className="flex gap-4">
            <div>
              <div className="mb-4 ">
                <Image
                  width={100}
                  height={100}
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-24 h-24 rounded-full border-4 border-white mx-auto"
                />
              </div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-sm opacity-80">{user.email}</p>
            </div>
            <ProfileLevelBar
              numStories={userDataFromDatabase.num_stories}
            ></ProfileLevelBar>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-4 mb-6 text-blue-400">
            <StatItem
              icon={<BookOpen className="w-8 h-8 text-green-500" />}
              value={user.stats.storiesCreated}
              label="Stories Created"
            />
            <StatItem
              icon={<Zap className="w-8 h-8 text-yellow-500" />}
              value={user.stats.tokensLeft}
              label="Tokens Left"
            />
            <StatItem
              icon={<Repeat className="w-8 h-8 text-blue-500" />}
              value={user.stats.dailyTransitionsLeft}
              label="Daily Transitions"
            />
          </div>
          <p className="text-center text-lg font-medium text-gray-600 mb-4">
            Great job, {user.name.split(" ")[0]}! Keep up the amazing work! 🎉
          </p>
        </CardContent>
        <CardFooter className="bg-gray-50 p-6 flex justify-center items-center">
          <Link href="/chat">
            <Button className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105">
              Create New Story
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

function StatItem({ icon, value, label }) {
  return (
    <div className="flex flex-col items-center p-2 bg-gray-50 rounded-xl">
      {icon}
      <span className="text-2xl font-bold mt-2">{value}</span>
      <span className="text-xs text-gray-500 text-center">{label}</span>
    </div>
  );
}
