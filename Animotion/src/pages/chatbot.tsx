import { useState, useEffect } from "react";
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { supabase } from "../hooks/supabaseClient";

type WatchlistItem = {
  animeTitle: string;
  userID: string;
};

type MessageType = {
  message: string;
  sender: "user" | "ChatGPT";
  direction?: "incoming" | "outgoing";
  position: "normal" | "last" | "single" | "first";
};

const Chatbot: React.FC = () => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [history, setHistory] = useState<WatchlistItem[]>([]);
  const [messages, setMessages] = useState<MessageType[]>([
    {
        message: "Hello, I'm Hiro!",
        sender: "ChatGPT",
        position: "normal",
        direction: "incoming",
    },
  ]);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const token = localStorage.getItem("token");
  const tokenData = token ? JSON.parse(token) : null;
  const userId = tokenData?.user?.id || "";

  useEffect(() => {
    getWatchlist();
    getHistory();
  }, []);

  async function getWatchlist() {
    const { data } = await supabase.from("watchlistAnimotion_alt").select();
    const userData = data ? data.filter((item: WatchlistItem) => item.userID === userId) : [];
    setWatchlist(userData);
  }

  async function getHistory() {
    const historyData = localStorage.getItem("history");
    setHistory(historyData ? JSON.parse(historyData) : []);
  }

  const displayedWatchlist = watchlist.length
    ? watchlist.map((item) => item.animeTitle).join(", ")
    : "No Anime in Watchlist";

  const displayedHistory = history.length
    ? history.map((item) => item.animeTitle).join(", ")
    : "No Anime in History";

  const API_KEY = import.meta.env.VITE_OPENAI_API;
  const systemMessage = {
    role: "system",
    content: `You are Hiro - AI Chatbot hosted on Animotion (an Anime Streaming Platform). You can ask me anything about Anime and Manga. The user gets Anime recommendations based on their watchlist and history. If there is no anime in their watchlist/history, then you can recommend them any anime.
    For your watchlist, you currently have: ${displayedWatchlist}.
    For your history, you currently have: ${displayedHistory}.
    Answer only questions related to anime and manga. Warn users politely not to ask unrelated questions. Thank you!`,
  };

  const handleSend = async (message: string) => {
    const newMessage: MessageType = { message, sender: "user", direction: "outgoing", position: "normal" };
    const updatedMessages = [...messages, newMessage];

    setMessages(updatedMessages);
    setIsTyping(true);
    await processMessageToChatGPT(updatedMessages);
  };

  async function processMessageToChatGPT(chatMessages: MessageType[]) {
    const apiMessages = chatMessages.map(({ message, sender }) => ({
      role: sender === "ChatGPT" ? "assistant" : "user",
      content: message,
    }));

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [systemMessage, ...apiMessages],
    };

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiRequestBody),
      });

      const data = await response.json();
      setMessages([...chatMessages, { message: data.choices[0].message.content, sender: "ChatGPT", position: "normal", direction: "incoming" }]);
    } catch (error) {
      console.error("Error communicating with OpenAI:", error);
    } finally {
      setIsTyping(false);
    }
  }

  console.log(messages);

  return (
    <>
      <div className="w-full flex flex-col items-center justify-center min-h-screen">
        <Card className="w-full max-w-[90dvw] p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Hiro</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Hello, I'm Hiro, your friendly AI chatbot companion on Animotion! I can assist with anime recommendations and answer your questions.
          </p>
          <Separator className="my-4" />
          <div className="relative bg-black text-white h-[70dvh] w-full">
            <MainContainer>
              <ChatContainer>
                <MessageList
                  style={{ backgroundColor: "var(--bgColor2)" }}
                  scrollBehavior="smooth"
                  typingIndicator={isTyping ? <TypingIndicator content="Hiro is typing..." /> : null}
                >
                  {messages.map((message, i) => (
                    <Message key={i}  model={{ message: message.message, sender: message.sender, position: message.position, direction: message.direction || "incoming" }} />
                  ))}
                </MessageList>
                <MessageInput style={{ backgroundColor: "var(--bgColor2)" }} placeholder="Type message here" onSend={handleSend} />
              </ChatContainer>
            </MainContainer>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Chatbot;
