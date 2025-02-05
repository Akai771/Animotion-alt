import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import "../../styling/cards.css"

type AdvCardProps = {
  imageUrl: string;
link: string;
};

const AdvCard: React.FC<AdvCardProps> = ({ imageUrl, link }) => {
  return (
    <Link to={link}>
        <Card className="relative w-[70dvw] h-[35dvh] overflow-x-hidden">
            <img src={imageUrl} alt="Advertisement" className="absolute inset-0 w-full h-full object-cover" />
        </Card>
    </Link>
  );
};

export default AdvCard;
