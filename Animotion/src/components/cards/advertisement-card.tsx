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
          <Card className="relative overflow-hidden rounded-lg shadow-md">
            <img 
              src={imageUrl} 
              alt="Advertisement" 
              className="w-full h-auto object-cover"
              style={{ maxHeight: "120px" }}
            />
          </Card>
        </Link>
      </div>
    );
  }

  // Desktop version - original implementation
  return (
    <Link to={link}>
      <Card className="relative w-[70dvw] h-[35dvh] overflow-x-hidden">
        <img src={imageUrl} alt="Advertisement" className="absolute inset-0 w-full h-full object-cover" />
      </Card>
    </Link>
  );
};

export default AdvCard;