import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Newspaper, Clock, Filter, Search, SortAsc, SortDesc } from "lucide-react";
import NewsCard from "@/components/cards/news-card";
import { useIsMobile } from "@/hooks/use-mobile";

interface Article {
  id: string;
  title: string;
  topics: string[] | string; // Can be either array or string from API
  url: string;
  thumbnail: string;
  uploadedAt?: string;
}

const News: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTopic, setSelectedTopic] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const isMobile = useIsMobile();

  useEffect(() => {
    axios
      .get("https://animotion-consumet-api-2.vercel.app/news/ann/recent-feeds")
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

  // Get unique topics for filtering
  const uniqueTopics = useMemo(() => {
    const allTopics = articles.flatMap(article => {
      // Handle both string and array formats from API
      if (Array.isArray(article.topics)) {
        return article.topics;
      } else if (typeof article.topics === 'string') {
        return [article.topics];
      }
      return [];
    });
    const uniqueTopicsSet = Array.from(new Set(allTopics)).sort((a, b) => a.localeCompare(b));
    return ["All", ...uniqueTopicsSet];
  }, [articles]);

  // Filter and sort articles
  const filteredAndSortedArticles = useMemo(() => {
    let filtered = [...articles]; // Create a copy to avoid mutations

    // Filter by topic
    if (selectedTopic !== "All") {
      filtered = filtered.filter(article => {
        // Handle both string and array formats from API
        let articleTopics: string[] = [];
        if (Array.isArray(article.topics)) {
          articleTopics = article.topics;
        } else if (typeof article.topics === 'string') {
          articleTopics = [article.topics];
        }
        return articleTopics.includes(selectedTopic);
      });
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(article => {
        const titleMatch = article.title.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Handle both string and array formats for topics search
        let topicsMatch = false;
        if (Array.isArray(article.topics)) {
          topicsMatch = article.topics.some(topic => 
            topic.toLowerCase().includes(searchQuery.toLowerCase())
          );
        } else if (typeof article.topics === 'string') {
          topicsMatch = article.topics.toLowerCase().includes(searchQuery.toLowerCase());
        }
        
        return titleMatch || topicsMatch;
      });
    }

    // Sort articles alphabetically by title
    filtered.sort((a, b) => {
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();
      
      if (sortOrder === "asc") {
        return titleA.localeCompare(titleB);
      } else {
        return titleB.localeCompare(titleA);
      }
    });

    return filtered;
  }, [articles, selectedTopic, searchQuery, sortOrder]);

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {Array.from({ length: isMobile ? 3 : 6 }).map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <div className="flex flex-col space-y-3 p-4">
            <Skeleton className="h-48 w-full rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-b border-border/50">
        <div className="container mx-auto px-4 pt-24 pb-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
              Anime News
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Stay updated with the latest anime news, announcements, and industry updates
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock size={16} />
              <span>Updated regularly throughout the day</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      {!loading && articles.length > 0 && (
        <div className="bg-muted/30 border-b border-border/50">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Topic Filters */}
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-muted-foreground mr-2 flex items-center gap-1">
                  <Filter size={16} />
                  Topics:
                </span>
                {uniqueTopics.slice(0, isMobile ? 4 : 8).map((topic) => (
                  <Button
                    key={topic}
                    variant={selectedTopic === topic ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTopic(topic)}
                    className="text-xs"
                  >
                    {topic === "All" ? "All" : topic.length > 15 ? `${topic.slice(0, 15)}...` : topic}
                  </Button>
                ))}
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort:</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="flex items-center gap-1"
                >
                  {sortOrder === "asc" ? <SortAsc size={16} /> : <SortDesc size={16} />}
                  {sortOrder === "asc" ? "A-Z" : "Z-A"}
                </Button>
              </div>
            </div>

            {/* Results info */}
            <div className="mt-4 text-sm text-muted-foreground">
              Showing {filteredAndSortedArticles.length} of {articles.length} articles
              {selectedTopic !== "All" && (
                <span> • Filtered by: <Badge variant="outline" className="ml-1">{selectedTopic}</Badge></span>
              )}
              {searchQuery && (
                <span> • Search: "{searchQuery}"</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <LoadingSkeleton />
        ) : filteredAndSortedArticles.length > 0 ? (
          <>
            {/* Reset filters if applied */}
            {(selectedTopic !== "All" || searchQuery) && (
              <div className="mb-6 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedTopic("All");
                    setSearchQuery("");
                  }}
                  className="text-xs"
                >
                  Clear all filters
                </Button>
              </div>
            )}
            
            <div className={`grid gap-6 ${
              isMobile 
                ? 'grid-cols-1' 
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            }`}>
              {filteredAndSortedArticles.map((news) => (
                <NewsCard
                  key={news.id}
                  title={news.title}
                  description={
                    Array.isArray(news.topics) 
                      ? news.topics.join(", ") 
                      : typeof news.topics === 'string' 
                        ? news.topics 
                        : "General"
                  }
                  url={news.url}
                  urlToImage={news.thumbnail}
                  publishedAt={news.uploadedAt}
                />
              ))}
            </div>
          </>
        ) : articles.length > 0 ? (
          // Show when no results match filters
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="p-4 bg-muted/50 rounded-full mb-4">
              <Search size={48} className="text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Results Found</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              No articles match your current filters. Try adjusting your search terms or topic selection.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => setSearchQuery("")}
                disabled={!searchQuery}
              >
                Clear Search
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelectedTopic("All")}
                disabled={selectedTopic === "All"}
              >
                Reset Topic Filter
              </Button>
              <Button
                onClick={() => {
                  setSelectedTopic("All");
                  setSearchQuery("");
                }}
              >
                Clear All Filters
              </Button>
            </div>
          </div>
        ) : (
          // Show when no articles at all
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="p-4 bg-muted/50 rounded-full mb-4">
              <Newspaper size={48} className="text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No News Available</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              There are currently no news articles to display. Please check back later for the latest updates.
            </p>
            <Card className="p-6 max-w-md">
              <NewsCard
                key="no-news"
                title="No News Available"
                description="Check back later"
                url="#"
                urlToImage="https://via.placeholder.com/400x400"
              />
            </Card>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      {filteredAndSortedArticles.length > 0 && !loading && (
        <div className="bg-muted/30 border-t border-border/50 mt-16">
          <div className="container mx-auto px-4 py-12 text-center">
            <h3 className="text-2xl font-semibold mb-4">Stay Updated</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Keep track of the latest anime news and never miss an important announcement
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Badge variant="outline" className="px-4 py-2">
                <Clock size={16} className="mr-2" />
                Refreshed every hour
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                <Filter size={16} className="mr-2" />
                {uniqueTopics.length - 1} topics available
              </Badge>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default News;
