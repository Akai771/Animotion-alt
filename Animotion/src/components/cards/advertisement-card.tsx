// src/components/cards/advertisement-card.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import "../../styling/cards.css"
import { useIsMobile } from "@/hooks/use-mobile";

type AdvCardProps = {
  imageUrl: string;
  link: string;
};

const AdvCard: React.FC<AdvCardProps> = ({ imageUrl, link }) => {
  const isMobile = useIsMobile();

  // Mobile version
  if (isMobile) {
    return (
      <div className="my-4 mx-1">
        <Link to={link}>
          <Card className="relative overflow-hidden rounded-lg shadow-md group transition-shadow duration-300 ease-out hover:shadow-xl">
            <img 
              src={imageUrl} 
              alt="Advertisement" 
              className="w-full h-auto object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              style={{ maxHeight: "120px" }}
            />
          </Card>
        </Link>
      </div>
    );
  }

  // Desktop version with image-only scaling
  return (
    <Link to={link} className="block">
      <Card className="relative w-[70dvw] h-[35dvh] overflow-hidden group transition-shadow duration-300 ease-out hover:shadow-2xl hover:shadow-black/20 ">
        <span className="absolute inline-flex h-full w-full hover:animate-ping bg-sky-400 opacity-75"></span>
        <img 
          src={imageUrl} 
          alt="Advertisement" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
        />
      </Card>
    </Link>
  );
};

export default AdvCard;