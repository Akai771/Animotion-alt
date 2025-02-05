import React, { useState, useEffect } from "react";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import NewsCard from "@/components/cards/news-card";

interface Article {
  id: string;
  title: string;
  topics: string;
  url: string;
  thumbnail: string;
}

const News: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    axios
      .get("https://animotion-consumet-api.vercel.app/news/ann/recent-feeds")
      .then((res) => {
        setArticles(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching news:", error);
        setLoading(false);
      });

    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className="w-full flex flex-col items-center mt-10">
        <div className="w-full max-w-10xl px-4 py-6">
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white" id="AnimeNews">
            Anime News
          </h1>
          <Separator className="my-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {loading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className="w-[345px] h-[400px] rounded-lg" />
                ))
              : articles.length > 0
              ? articles.map((news) => (
                  <NewsCard
                    key={news.id}
                    title={news.title}
                    description={news.topics}
                    url={news.url}
                    urlToImage={news.thumbnail}
                  />
                ))
              : (
                <NewsCard
                  key={"no-news"}
                  title={"No News Available"}
                  description={"There are currently no news articles to display."}
                  url={"#"}
                  urlToImage={"https://via.placeholder.com/400x400"}
                />
              )}
          </div>
        </div>
      </div>
    </>
  );
};

export default News;
