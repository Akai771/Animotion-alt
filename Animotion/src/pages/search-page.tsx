import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";
import DisplayCard from "@/components/cards/display-card";
import { Card } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type Anime = {
  id: string;
  name: string;
  poster: string;
};

type Genre = string;

const SearchPage: React.FC = () => {
  const [browse, setBrowse] = useState<Anime[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [page, setPage] = useState<number>(1);
  const [genreState, setGenreState] = useState<boolean>(true);
  const { searchId } = useParams<{ searchId: string }>();

  const handleGenre = () => setGenreState((prev) => !prev);
  const handleNextPage = () => setPage((prev) => prev + 1);
  const handlePrevPage = () => setPage((prev) => (prev > 1 ? prev - 1 : prev));

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API}/api/v2/hianime/search?q="${searchId}"&page=${page}`)
      .then((res) => setBrowse(res.data.data.animes))
      .catch((err) => console.error("Error fetching search results:", err));
  }, [searchId, page]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API}/api/v2/hianime/home`)
      .then((res) => setGenres(res.data.data.genres))
      .catch((err) => console.error("Error fetching genres:", err));
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
    <div className="w-full mt-10">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-row items-center justify-between">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">Search results for: <span className="text-[--primary-color]">{searchId}</span></span>
                <Card className="p-2">{browse.length} Results found</Card>
            </div>
            <Card className="p-5 mt-5">
                <ScrollArea className="w-full h-[70dvh]">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {browse.length > 0 ? (
                            browse.map((anime) => (
                                <DisplayCard key={anime.id} id={anime.id} title={anime.name} coverImage={anime.poster} />
                            ))
                            ) : (
                            <p className="text-gray-500 dark:text-gray-400 col-span-3">No Results Found</p>
                        )}
                    </div>
                    <ScrollBar/>
                </ScrollArea>
            </Card>
          <Pagination className="mt-6">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious onClick={handlePrevPage} />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink>{page}</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext onClick={handleNextPage} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
        <Separator className="my-8" />
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Genres</h2>
          <div className="flex flex-wrap gap-3">
            {genres.slice(0, genreState ? 21 : genres.length).map((genre) => (
                <Button key={genre} id={genre} title={genre} variant="outline">
                    {genre}
                </Button>
            ))}
          </div>
          <Button className="mt-4 bg-[--primary-color] hover:bg-[--primary-color2]" onClick={handleGenre} variant="secondary">
            {genreState ? "Show More" : "Show Less"}
          </Button>
        </div>
        </div>
    </div>
    </>
  );
};

export default SearchPage;