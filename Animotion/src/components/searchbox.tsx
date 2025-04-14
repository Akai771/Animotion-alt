import { useState, FormEvent, ChangeEvent, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export default function SearchBox() {
  const [search, setSearch] = useState<string>("");
  const [suggestion, setSuggestion] = useState<any[]>([]);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const searchBoxRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search/${search}`);
    }
    setSearch("");
    setIsFocused(false);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    if (search) {
      axios
        .get(
          `${
            import.meta.env.VITE_API
          }/api/v2/hianime/search/suggestion?q=${search}`
        )
        .then((res) => {
          setSuggestion(res.data.data.suggestions);
        });
    } else {
      setSuggestion([]);
    }
  }, [search]);
 
  const handleNavigation = (e: any) => {
    navigate(`/details/${e}`);
    setSearch("");
    setIsFocused(false);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div 
      className={`w-full fixed flex flex-col justify-start items-center ${isMobile ? 'pl-8' : 'pl-0'} ${isMobile ? 'z-30' : 'z-10'} gap-10`}
      ref={searchBoxRef}
    >
      <form
        className={`fixed w-full flex justify-center backdrop-blur-[2px] ${isMobile ? 'pt-4' : 'pt-0'}`}
        onSubmit={handleSubmit}
      >
        <div className={`relative ${isMobile ? 'w-[70%]' : 'lg:w-1/3'} flex flex-row items-center justify-center ${isMobile ? 'top-0' : 'top-3'}`}>
          <div>
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500"
              size={18}
            />
          </div>
          <input
            type="text"
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            placeholder="Search anime..."
            className={`w-full text-sm ${isMobile ? 'h-10' : 'h-[3dvh]'} p-5 pl-10 border-none rounded-3xl bg-[--bgColor3] text-[--text-color] placeholder:text-zinc-500 shadow-[0px_4px_10px_rgba(0,0,0,0.5)]`}
          />
        </div>
      </form>
      {search && isFocused && (
      <Card className={`${isMobile ? 'w-[80%]' : 'w-1/2'} max-h-[80dvh] p-2 flex flex-col items-center justify-center ${isMobile ? 'mt-28' : 'mt-16'} gap-2 overflow-y-auto z-20`}>
        {suggestion.length > 0 ? 
        suggestion.map((item) => (
          <Button 
            key={item.id} 
            className="flex flex-row items-center justify-start gap-3 w-full h-full p-2" 
            variant="secondary" 
            onClick={() => handleNavigation(item.id)}
          >
            <img src={item.poster} alt="poster" className="w-12 rounded-md" />
            <div className={`${isMobile ? 'w-[70%]' : 'w-full'} h-16 flex flex-col items-start justify-between`}>
              <div className="flex flex-col items-start justify-start">
                <span className={`text-sm font-bold text-[--text-color] truncate`}>{item.name}</span>
                <span className="font-medium text-xs  text-[--secondary-color] truncate">{item.jname}</span>
              </div>
              <div className="flex flex-row items-center justify-start gap-2">
                {item.moreInfo.map((subitem: any, index: number) => (
                  <span key={index} className="font-medium text-xs text-neutral-400 truncate">
                    {subitem}
                    {index < item.moreInfo.length - 1 && <span className="text-[--text-color] pl-2">•</span>}
                  </span>
                ))}
              </div>
              
            </div>
          </Button>
        )):(
        <span className="">No results found</span>
        )}
      </Card>
      )}
    </div>
  );
}