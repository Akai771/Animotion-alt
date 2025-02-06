import { useState, FormEvent, ChangeEvent } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SearchBox() {
  const [search, setSearch] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search/${search}`);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className="w-full mt-5 fixed flex flex-row justify-center items-center z-10 backdrop-blur-[2px]">
      <form className="fixed w-full flex justify-center" onSubmit={handleSubmit}>
        <div className="relative lg:w-1/3 flex flex-row items-center justify-center top-3">
          <div>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" size={18}/>
          </div>
          <input
            type="text"
            onChange={handleChange}
            placeholder="Search anime..."
            className="w-full text-sm h-[3dvh] p-5 pl-10 border-none rounded-3xl bg-[--bgColor3] text-[--text-color] placeholder:text-zinc-500 shadow-[0px_4px_10px_rgba(0,0,0,0.5)]"
          />
        </div>
      </form>
    </div>
  );
}
