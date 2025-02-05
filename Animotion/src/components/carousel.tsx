// Code for carousel component [src/components/carousel.tsx]
"use client"

import React from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay"
import data from "../data/carousel.js";
import { Play } from "lucide-react";

export default function CarouselMain() {
    const navigate = useNavigate();

    function handleClick(id: string) {
        navigate(`/details/${id}`);
    }

    const plugin = React.useRef(
        Autoplay({ delay: 3000, stopOnInteraction: true })
      )

    return (<>
    <Carousel  className="w-full max-w-[90dvw] h-[60dvh]" plugins={[plugin.current]}>
    <CarouselContent className="flex w-full h-full">
        {data.map((item, index) => {
        return(
        <CarouselItem key={index}>
            <Card className="relative w-[100dvw] h-[60dvh] overflow-x-hidden">
                <img src={item.imageUrl} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 flex flex-col items-start justify-end pl-[10dvh] bg-gradient-to-t from-black via-black/90 to-transparent text-white">

                    {/* <img src={item.Logo} alt="Anime logo" className="max-w-22 max-h-16 object-contain border border-red-600"/> */}
                    <span className="text-4xl font-bold mt-1">{item.title}</span>
                    <div className="flex flex-row items-center gap-2 text-neutral-400">
                        <span className="text-xs">{item.lang.sub} | {item.lang.dub}</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-xs">{item.Type}</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-xs">{item.genres.join(", ")}</span>
        
                    </div>
                    <span className="text-sm mt-2 w-[30dvw] line-clamp-4">{item.description}</span>
                    <Button onClick={() => handleClick(item.url)} className="mb-10 mt-5 bg-[#7000FF] text-white hover:bg-[#4d02ad]"><Play fill="white"/>Watch Now</Button>
                </div>
            </Card>
        </CarouselItem>
        );
        })}
    </CarouselContent>
    </Carousel>
    </>);
}