// src/components/carousel.tsx
import { useRef } from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import { Play } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface SpotlightAnime {
  rank: string | number;
  id: string;
  name: string;
  description?: string;
  poster: string;
  jname?: string;
  episodes?: {
    sub?: number | null;
    dub?: number | null;
  };
  type?: string;
  otherInfo?: string[];
}

interface CarouselMainProps {
  spotlightAnime: SpotlightAnime[];
}

export default function CarouselMain({ spotlightAnime }: CarouselMainProps) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  function handleClick(id: string) {
    navigate(`/details/${id}`);
  }

  const autoplayPlugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));

  return (
    <Carousel 
      className={`w-full ${isMobile ? 'max-w-full' : 'max-w-[90dvw]'} ${isMobile ? 'h-[40dvh]' : 'h-[60dvh]'}`} 
      plugins={[autoplayPlugin.current]}
    >
      <CarouselContent className="flex w-full h-full">
        {spotlightAnime.map((item) => (
          <CarouselItem key={item.rank}>
            <Card className={`relative ${isMobile ? 'w-full' : 'w-[100dvw]'} ${isMobile ? 'h-[40dvh]' : 'h-[60dvh]'} ${isMobile ? 'mx-2' : 'mx-0'} overflow-x-hidden`}>
              <img 
                src={item.poster} 
                alt={item.name} 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className={`absolute inset-0 flex flex-col items-start justify-end ${isMobile ? 'pl-4 pr-4' : 'pl-[10dvh] pr-[10dvh]'} bg-gradient-to-t from-black via-black/90 to-transparent text-white`}>
                <span className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-bold mt-1 ${isMobile ? 'w-full line-clamp-2' : 'max-w-[50dvw] line-clamp-2'}`}>{item.name}</span>
                <div className="flex flex-row items-center gap-2 text-neutral-400 flex-wrap">
                  <span className="text-xs">
                    {item.episodes?.sub ? `SUB: ${item.episodes.sub}` : ''}{item.episodes?.sub && item.episodes?.dub ? ' | ' : ''}{item.episodes?.dub ? `DUB: ${item.episodes.dub}` : ''}
                  </span>
                  <span className="text-sm text-gray-400">•</span>
                  <span className="text-xs">{item.type}</span>
                  {item.otherInfo && item.otherInfo.length > 2 && (
                    <>
                      <span className="text-sm text-gray-400">•</span>
                      <span className="text-xs">{item.otherInfo[2]}</span>
                    </>
                  )}
                </div>
                <span className={`text-sm mt-2 ${isMobile ? 'w-full line-clamp-2' : 'max-w-[50dvw] line-clamp-3'}`}>
                  {item.description}
                </span>
                <Button 
                  onClick={() => handleClick(item.id)} 
                  className={`${isMobile ? 'mb-5 mt-3' : 'mb-10 mt-5'} bg-[#7000FF] text-white hover:bg-[#4d02ad]`}
                >
                  <Play fill="white" /> Watch Now
                </Button>
              </div>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}