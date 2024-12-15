"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Component({ numStories }) {
  const [stories, setStories] = useState(numStories);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    console.log("Being called");
    let newLevel = Math.floor(numStories / 10) + 1;
    console.log("New level is", newLevel);

    setLevel(newLevel);
    let remainingStories = numStories % 10;
    setStories(remainingStories);
  }, [numStories]);

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Story Creator Level</CardTitle>
        <CardDescription>Create stories to level up!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Level {level}</span>
          <span className="text-sm font-medium">
            {stories}/10 stories to next level
          </span>
        </div>
        <Progress
          value={(stories / 10) * 100}
          className="w-full bg-gray-200"
          style={{
            "--tw-progress-bar-color": "var(--color-primary-blue)",
            "--tw-progress-bar-bg": "var(--color-primary-black)",
          }}
        />
      </CardContent>
    </Card>
  );
}
