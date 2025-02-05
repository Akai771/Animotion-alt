import React from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";

interface ScheduleCardProps {
  title: string;
  jtitle: string;
  time: string;
  id: string;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({ title, jtitle, time, id }) => {
  return (
    <Card className="p-4 hover:shadow-lg transition-shadow duration-300 mb-3 hover:bg-[--bgColor]">
      <Link to={`/details/${id}`} className="flex items-center space-x-4">
        <div className="flex flex-col items-center">
          <span className="text-lg font-semibold text-gray-900 dark:text-white">{time}</span>
        </div>
        <div className="h-[6dvh] border-l-2" />
        <div className="flex flex-col">
          <span className="text-lg font-semibold text-gray-900 dark:text-white">{title}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">{jtitle}</span>
        </div>
      </Link>
    </Card>
  );
};

export default ScheduleCard;
