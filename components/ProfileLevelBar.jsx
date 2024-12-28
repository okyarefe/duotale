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
    let newLevel = Math.floor(numStories / 10) + 1;

    setLevel(newLevel);
    let remainingStories = numStories % 10;
    setStories(remainingStories);
  }, [numStories]);

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Badges are coming soon!</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">{}</CardContent>
    </Card>
  );
}
