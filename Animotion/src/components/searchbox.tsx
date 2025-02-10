import { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SearchBox() {
  const [search, setSearch] = useState<string>("");
  const [suggestion, setSuggestion] = useState<any[]>([]);
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search/${search}`);
    }
    setSearch("");
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    axios
      .get(
        `${
          import.meta.env.VITE_API
        }/api/v2/hianime/search/suggestion?q=${search}`
      )
      .then((res) => {
        setSuggestion(res.data.data.suggestions);
      });
  }, [search]);
 
  const handleNavigation = (e: any) => {
    navigate(`/details/${e}`);
    setSearch("");
  };

  return (
    <div className="w-full fixed flex flex-col justify-start items-center z-10 gap-10">
      <form
        className="fixed w-full flex justify-center backdrop-blur-[2px]"
        onSubmit={handleSubmit}
      >
        <div className="relative lg:w-1/3 flex flex-row items-center justify-center top-3">
          <div>
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500"
              size={18}
            />
          </div>
          <input
            type="text"
            onChange={handleChange}
            placeholder="Search anime..."
            className="w-full text-sm h-[3dvh] p-5 pl-10 border-none rounded-3xl bg-[--bgColor3] text-[--text-color] placeholder:text-zinc-500 shadow-[0px_4px_10px_rgba(0,0,0,0.5)]"
          />
        </div>
      </form>
      {search && (
      <Card className="w-1/2 max-h-[80dvh] p-2 flex flex-col items-center justify-center mt-16 gap-2">
        {suggestion.length > 0?
        suggestion.map((item) => (
          <Button key={item.id} className="flex flex-row items-center justify-start gap-3 w-full h-full p-2" variant="secondary" onClick={() => handleNavigation(item.id)}>
            <img src={item.poster} alt="poster" className="w-12 rounded-md" />
            <div className="flex flex-col items-start w-full">
              <span className="text-sm font-bold text-[--text-color]">{item.name}</span>
              <span className="font-medium text-xs text-neutral-500">{item.jname}</span>
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
