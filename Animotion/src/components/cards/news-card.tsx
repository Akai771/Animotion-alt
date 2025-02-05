import React from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface NewsCardProps {
  title?: string;
  description?: string;
  url: string;
  urlToImage?: string;
}

const NewsCard: React.FC<NewsCardProps> = ({ title, description, url, urlToImage }) => {
  return (
    <Card className="w-78 relative mr-4">
      <a href={url} target="_blank" rel="noopener noreferrer" className="relative">
        <img
          src={urlToImage ? urlToImage : "https://intellij-support.jetbrains.com/hc/user_images/QZP8LIk0pW3bOuWt1P7HIQ.png"}
          className="w-full h-[300px] object-cover rounded-t-lg p-3"
          alt="NewsImage"
        />
        <Badge className="absolute top-4 left-4 px-2 py-1 text-xs rounded-md bg-red-500 text-white">{description ? description : "N/A"}</Badge>
      </a>
      <CardContent className="flex flex-col items-start justify-between">
        <CardTitle className="text-lg font-semibold">{title ? title.slice(0, 50) : "No Data"}</CardTitle>
        <Button asChild variant="default" className="mt-2 bg-[--primary-color] text-white hover:bg-[--primary-color2]">
          <a href={url} target="_blank" rel="noopener noreferrer">Read More <ExternalLink size={16} className="ml-1" /></a>
        </Button>
      </CardContent>
    </Card>
  );
};

export default NewsCard;
