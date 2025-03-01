// Code for carousel component [src/components/carousel.tsx]
import React, { useState, useEffect, useRef } from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import { Play } from "lucide-react";
import { supabase } from "@/hooks/supabaseClient.js";

interface CarouselDataProps {
  ID: number;
  Logo: string;
  imageUrl: string;
  title: string;
  season: number;
  description: string;
  url: string | null;
  lang_dub: string;
  lang_sub: string;
  genres: string;
  Type: string;
}

export default function CarouselMain() {
  const navigate = useNavigate();
  const [carouselData, setCarouselData] = useState<CarouselDataProps[]>([]);

  function handleClick(url: string | null) {
    if (url) {
      navigate(`/details/${url}`);
    }
  }

  async function getCarousel() {
    try {
      const { data, error } = await supabase.from("TrendingCarousel").select();
      if (error) throw error;
      if (data) {
        setCarouselData(data as CarouselDataProps[]);
      }
    } catch (error) {
      console.error("Error fetching carousel data:", error);
    }
  }

  useEffect(() => {
    getCarousel();
  }, []);

  const autoplayPlugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));

  return (
    <Carousel className="w-full max-w-[90dvw] h-[60dvh]" plugins={[autoplayPlugin.current]}>
      <CarouselContent className="flex w-full h-full">
        {carouselData.map((item) => (
          <CarouselItem key={item.ID}>
            <Card className="relative w-[100dvw] h-[60dvh] overflow-x-hidden">
              <img src={item.imageUrl} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 flex flex-col items-start justify-end pl-[10dvh] bg-gradient-to-t from-black via-black/90 to-transparent text-white">
                <span className="text-4xl font-bold mt-1">{item.title}</span>
                <div className="flex flex-row items-center gap-2 text-neutral-400">
                  <span className="text-xs">
                    {item.lang_sub} | {item.lang_dub}
                  </span>
                  <span className="text-sm text-gray-400">•</span>
                  <span className="text-xs">{item.Type}</span>
                  <span className="text-sm text-gray-400">•</span>
                  <span className="text-xs">{item.genres.split(";").join(", ")}</span>
                </div>
                <span className="text-sm mt-2 w-[30dvw] line-clamp-4">{item.description}</span>
                <Button onClick={() => handleClick(item.url)} className="mb-10 mt-5 bg-[#7000FF] text-white hover:bg-[#4d02ad]">
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
