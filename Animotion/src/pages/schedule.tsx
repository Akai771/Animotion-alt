import React, { useState, useEffect } from "react";
import axios from "axios";
import ScheduleCard from "../components/cards/schedule-card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import "../styling/globals.css";
import { Helmet } from "react-helmet-async";

interface ScheduleItem {
  id: string;
  name: string;
  jname: string;
  time: string;
  episode: number;
}

const Schedule: React.FC = () => {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [day, setDay] = useState<string>("");
  const [weekDates, setWeekDates] = useState<string[]>([]);
  const isMobile = useIsMobile();

  // Day names for tabs
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  useEffect(() => {
    const getWeekDates = () => {
      const today = new Date();
      const currentDayOfWeek = today.getDay();
      const difference = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;

      const startDate = new Date(today);
      startDate.setDate(today.getDate() - difference);

      const dates = Array.from({ length: 7 }, (_, index) => {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + index);
        return date.toISOString().slice(0, 10);
      });

      setWeekDates(dates);
      setDay(dates[currentDayOfWeek]); // Set current day dynamically
    };
    getWeekDates();
  }, []);

  useEffect(() => {
    if (!day) return; // Ensure we have a valid day before making API request
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API}/api/v2/hianime/schedule?date=${day}`)
      .then((res) => setSchedule(res.data.data.scheduledAnimes))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));

    window.scrollTo(0, 0);
  }, [day]);

  return (
    <>
      <Helmet>
        <title>Anime Schedule - Animotion</title>
        <meta name="description" content="Check out the weekly anime schedule on Animotion. Stay updated with the latest airing times and episodes." />
      </Helmet>

      <div className="min-h-screen ml-5 text-white mt-10">
        <div className="max-w-10xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-center">Anime Schedule</h1>
          {weekDates.length > 0 && (
            <Card className={`${isMobile ? 'w-full' : 'w-[90dvw]'} p-2`}>
              <Tabs defaultValue={day} className="mt-3 w-full flex flex-col items-center">
                <Card className="p-2">
                  {isMobile ? (
                    // Mobile version - compact tabs with abbreviated day names
                    <TabsList className="flex overflow-x-auto max-w-full h-12 rounded-lg">
                      {weekDates.map((date, index) => (
                        <TabsTrigger
                          key={date}
                          value={date}
                          className="px-2 py-1 text-xs rounded-lg text-white transition-all whitespace-nowrap data-[state=active]:bg-black"
                          onClick={() => setDay(date)}
                        >
                          {dayNames[index].substring(0, 3)}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  ) : (
                    // Desktop version - original spacious tabs
                    <TabsList className="max-w-3xl space-x-6 h-12 rounded-lg">
                      {weekDates.map((date, index) => (
                        <TabsTrigger
                          key={date}
                          value={date}
                          className="px-4 py-2 rounded-lg text-[--text-color] transition-all data-[state=active]:bg-black data-[state=active]:text-white"
                          onClick={() => setDay(date)}
                        >
                          {dayNames[index]}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  )}
                </Card>
                {weekDates.map((date) => (
                  <TabsContent key={date} value={date} className="mt-4 w-full">
                    <ScrollArea className={`${isMobile ? 'h-[60dvh]' : 'h-[70dvh]'}`}>
                      {loading ? (
                        Array.from({ length: 6 }).map((_, index) => (
                          <Skeleton key={index} className="w-full h-[80px] rounded-md mb-3" />
                        ))
                      ) : schedule.length > 0 ? (
                        schedule.map((anime) => (
                          <ScheduleCard key={anime.id} id={anime.id} title={anime.name} jtitle={anime.jname} time={anime.time} episode={anime.episode}/>
                        ))
                      ) : (
                        <Card className="p-6 text-center">No scheduled anime for this day.</Card>
                      )}
                      <ScrollBar />
                    </ScrollArea>
                  </TabsContent>
                ))}
              </Tabs>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default Schedule;