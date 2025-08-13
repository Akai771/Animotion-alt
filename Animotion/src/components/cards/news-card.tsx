import React from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Calendar } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface NewsCardProps {
  title?: string;
  description?: string;
  url: string;
  urlToImage?: string;
  publishedAt?: string;
}

const NewsCard: React.FC<NewsCardProps> = ({ title, description, url, urlToImage, publishedAt }) => {
  const isMobile = useIsMobile();

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Recent";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Mobile version
  if (isMobile) {
    return (
      <div className="mb-4">
        <Card className="overflow-hidden rounded-lg shadow-sm relative bg-card border border-border/50">
          <a href={url} target="_blank" rel="noopener noreferrer" className="block">
            <div className="relative aspect-[16/9]">
              <img 
                src={urlToImage || "https://intellij-support.jetbrains.com/hc/user_images/QZP8LIk0pW3bOuWt1P7HIQ.png"}
                className="w-full h-full object-cover"
                alt="News Image"
              />
              
              {/* Overlay for hover effect */}
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <ExternalLink size={24} className="text-white" />
              </div>
              
              {/* Category badge */}
              {description && (
                <Badge className="absolute top-2 left-2 text-[10px] px-2 py-1 rounded-md bg-red-500 text-white">
                  {description.slice(0, 20)}
                </Badge>
              )}
            </div>
            
            <CardContent className="p-3">
              <CardTitle className="text-sm font-semibold line-clamp-2 mb-2">
                {title || "No Title Available"}
              </CardTitle>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <Calendar size={12} />
                <span>{formatDate(publishedAt)}</span>
              </div>
              <Button size="sm" variant="outline" className="w-full text-xs">
                Read More <ExternalLink size={12} className="ml-1" />
              </Button>
            </CardContent>
          </a>
        </Card>
      </div>
    );
  }

  // Desktop version
  return (
    <Card className="group flex flex-col w-full max-w-sm bg-card border border-border/50 relative overflow-hidden transition-all duration-300 ease-in-out cursor-pointer hover:shadow-lg hover:scale-[1.02]">
      <a href={url} target="_blank" rel="noopener noreferrer" className="block">
        <div className="relative w-full h-48 overflow-hidden">
          <img 
            className="w-full h-full object-cover transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:brightness-75" 
            src={urlToImage || "https://intellij-support.jetbrains.com/hc/user_images/QZP8LIk0pW3bOuWt1P7HIQ.png"}
            alt="News Image"
          />
          
          {/* Category badge */}
          {description && (
            <Badge className="absolute top-3 left-3 text-xs px-2 py-1 rounded-md bg-red-500 text-white backdrop-blur-sm">
              {description}
            </Badge>
          )}
          
          {/* Hover overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
            <ExternalLink size={32} className="text-white" />
          </div>
        </div>
        
        <CardContent className="p-4 flex flex-col justify-between flex-1">
          <div>
            <CardTitle className="text-base font-semibold line-clamp-2 mb-3 group-hover:text-primary transition-colors">
              {title || "No Title Available"}
            </CardTitle>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Calendar size={14} />
              <span>{formatDate(publishedAt)}</span>
            </div>
          </div>
        </CardContent>
      </a>
    </Card>
  );
};

export default NewsCard;
