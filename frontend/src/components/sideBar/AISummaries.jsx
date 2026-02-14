import { useState, useRef, useEffect } from "react";
import { analyzeText, updateChatTitle } from "../../api/analysis";
import { generateChatTitle } from "../../utils/titleGenerator";

import { IoMdSend } from "react-icons/io";
import { IoAddSharp, IoMicOutline } from "react-icons/io5";
import { CgDanger } from "react-icons/cg";
import { MdOutlineTaskAlt } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import { TiPinOutline } from "react-icons/ti";
import { PiArchiveThin } from "react-icons/pi";
import { FaRobot, FaCommentDots } from "react-icons/fa"; // Only added these two icons
import Icon from '../../assets/Icon.svg';
import { PiUserFocus } from "react-icons/pi";
import { MdOutlineErrorOutline } from "react-icons/md";
import { MdOutlineAnalytics } from "react-icons/md";

export default function AISummaries({
  messages,
  setMessages,
  activeChatId,
  onDeleteChat,
  onPinChat,
  onArchiveChat,
  onChatTitleUpdate,
  searchQuery,
}) {

  console.log("🔥 AISummaries rendered with props:", {
    onChatTitleUpdate: onChatTitleUpdate,
    type: typeof onChatTitleUpdate,
    activeChatId,
    messagesCount: messages.length
  });
  
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [more, setMore] = useState(false);
  const [menu, setMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    if (!activeChatId) {
      setError("Please click New Chat first");
      return;
    }

    const isFirstMessage = messages.length === 0;

    setMessages((prev) => [...prev, { type: "user", text: input }]);
    setError("");
    setIsLoading(true);

    try {
      if (isFirstMessage) {
        const newTitle = generateChatTitle(input);
        await updateChatTitle(activeChatId, newTitle);
        if (onChatTitleUpdate) {
          onChatTitleUpdate(activeChatId, newTitle);
        }
      }

      const res = await analyzeText(input, activeChatId);

      let aiMessage = { type: "ai" };
      if (res.type === "human_response") {
        aiMessage.text = res.response;
      }
      if (res.type === "analysis_response") {
        aiMessage = {
          type: "ai",
          summary: res.summary,
          sentiment: res.sentiment,
          topics: res.topics,
          feedback: res.feedback,
          risk: res.risk,
        };
      }

      setMessages((prev) => [...prev, aiMessage]);
      setInput("");
    } catch (err) {
      console.error(err);
      setError("Failed to get AI response. Check backend.");
    } finally {
      setIsLoading(false);
    }
  };

  const highlightText = (text) => {
    if (!searchQuery || !text) return text;
    
    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === searchQuery.toLowerCase() 
        ? <mark key={i} className="bg-yellow-200">{part}</mark>
        : part
    );
  };

  // If no active chat, show beautiful empty state
  if (!activeChatId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-4 bg-white">
        <div className="relative mb-6">
          <div className="w-32 h-32 bg-gradient-to-br from-[#E013CC] to-purple-400 rounded-full flex items-center justify-center animate-pulse">
            <FaRobot className="text-white text-6xl" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
            <FaCommentDots className="text-[#E013CC] text-2xl" />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-gray-800 mb-3">
          Welcome to PulseAI! 👋
        </h2>
        
        <p className="text-gray-600 text-lg mb-8 max-w-md">
          Start a conversation with your AI assistant. Analyze sentiment, detect risks, and get intelligent insights from your messages.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mb-8">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl">
            <div className="w-10 h-10 bg-[#E013CC] rounded-full flex items-center justify-center mb-3 mx-auto">
              <span className="text-white text-xl">
                <PiUserFocus />
              </span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Sentiment Analysis</h3>
            <p className="text-sm text-gray-600">Detect emotions and tone in your text</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl">
            <div className="w-10 h-10 bg-[#E013CC] rounded-full flex items-center justify-center mb-3 mx-auto">
              <span className="text-white text-xl">
                <MdOutlineErrorOutline />
              </span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Risk Detection</h3>
            <p className="text-sm text-gray-600">Identify potentially harmful content</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl">
            <div className="w-10 h-10 bg-[#E013CC] rounded-full flex items-center justify-center mb-3 mx-auto">
              <span className="text-white text-xl">
                <MdOutlineAnalytics />
              </span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Smart Summaries</h3>
            <p className="text-sm text-gray-600">Get concise summaries of your messages</p>
          </div>
        </div>
        
        <p className="text-xs text-gray-400 mt-6">
          PulseAI v1.0 - Powered by advanced AI
        </p>
      </div>
    );
  }

  // Your existing UI remains EXACTLY the same from here
  return (
    <div className="flex flex-col w-full h-full bg-white px-4 pb-4">

      {/* TOP ACTIONS */}
      <div className="flex justify-end items-center gap-2 w-full h-auto">
        <span className="bg-red-200 text-xs text-red-600 px-2 py-1 rounded-md border border-red-500">N</span>
        <span className="bg-green-200 text-xs text-green-600 px-2 py-1 rounded-md border border-green-500">P</span>
        <div className="relative">
          <button onClick={() => setMenu((p) => !p)}
            className="flex justify-center items-center hover:rotate-15 duration-300 transition-all p-1 cursor-pointer rounded-md">
            <img src={Icon} alt="Icon" className="w-11" />
          </button>

          {menu && (
            <div className="absolute right-0 top-full mt-2 w-60 h-auto bg-white border border-[#83828246] rounded-lg shadow-sm p-3 z-50">
              <button
                onClick={() => { onPinChat(activeChatId); setMenu(false); }}
                className="flex items-center gap-2 text-gray-500 hover:bg-[#83828246] p-2 w-full h-10 rounded-md transition duration-300 cursor-pointer">
                <TiPinOutline /> Pin Chat
              </button>
              <button
                onClick={() => { onArchiveChat(activeChatId); setMenu(false); }}
                className="flex items-center gap-2 text-gray-500 hover:bg-[#83828246] p-2 w-full h-10 rounded-md transition duration-300 cursor-pointer">
                <PiArchiveThin /> Archive
              </button>
              <button
                onClick={() => { onDeleteChat(activeChatId); setMenu(false); }}
                className="flex items-center gap-2 text-red-500 hover:bg-[#83828246] p-2 w-full h-10 rounded-md transition duration-300 cursor-pointer">
                <AiOutlineDelete /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CHAT AREA */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-4 p-4 rounded-lg mt-4 scrollbar-hide">
        {messages.map((msg, idx) => (
          <div 
          key={idx} 
          id={`message-${msg.id}`}
          className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
              msg.type === "user"
                ? "bg-[#E013CC] text-white rounded-br-md"
                : "bg-white text-gray-800 border border-[#83828246] rounded-bl-md"
            }`}>
              {msg.type === "user" && (
                <div>{highlightText(msg.text)}</div>
              )}

              {msg.type === "ai" && (
                <div className="space-y-3">
                  {msg.text && <p>{highlightText(msg.text)}</p>}
                  
                  {msg.summary && (
                    <div>
                      <p className="text-xs uppercase text-gray-400">Summary</p>
                      <p>{highlightText(msg.summary)}</p>
                    </div>
                  )}
                  
                  {msg.sentiment && (
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium
                      ${msg.sentiment.sentiment === "POSITIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"}`}>
                      {msg.sentiment.sentiment} • {(msg.sentiment.confidence * 100).toFixed(1)}%
                    </div>
                  )}
                  
                  {typeof msg.risk !== "undefined" && (
                    <div className={`flex items-start gap-3 p-3 rounded-xl border text-sm
                      ${msg.risk ? "bg-red-50 border-red-200 text-red-700" : "bg-green-50 border-green-200 text-green-700"}`}>
                      <span className="text-lg">
                        {msg.risk ? <CgDanger className="text-red-500" /> : <MdOutlineTaskAlt className="text-green-500"/>}
                      </span>
                      <div>
                        <p className="text-xs uppercase font-semibold tracking-wide">Risk Detection</p>
                        <p>{msg.risk ? "Potential risk or sensitive content detected." : "No risk detected. Content appears safe."}</p>
                      </div>
                    </div>
                  )}
                  
                  {msg.topics?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {msg.topics.map((t, i) => (
                        <span key={i} className="text-xs px-3 py-1 rounded-full bg-purple-100 text-purple-700">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {msg.feedback && (
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <p className="text-xs uppercase text-gray-400">AI Insight</p>
                      <p>{highlightText(msg.feedback)}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* AI Typing Indicator */}
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-gray-400 px-2">
            <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></span>
            <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></span>
            <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200"></span>
            PulseAI is thinking…
          </div>
        )}
      </div>

      {/* INPUT */}
      <div className="flex justify-center items-center mt-4 w-full p-2">
        <div className="flex justify-center items-center gap-2 bg-[#F8F8F8] w-3xl border border-[#96949446] rounded-3xl px-3 py-1">
          <button onClick={() => setMore((p) => !p)} className="flex justify-center items-center w-10 h-10 rounded-full hover:bg-[#6969692a]">
            <IoAddSharp />
          </button>

          <form onSubmit={handleSubmit} className="flex justify-center items-center gap-3 w-full">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask PulseAI anything…"
              className="w-full h-10 bg-transparent focus:outline-none mt-4"
            />

            <button type="submit" disabled={isLoading || !input.trim()} className="flex justify-center items-center text-gray-600 w-10 h-10 rounded-full hover:bg-[#6969692a] transition cursor-pointer duration-300">
              <IoMicOutline />
            </button>

            <button type="submit" disabled={isLoading || !input.trim()} className="flex justify-center items-center w-10 h-10 rounded-full bg-[#E013CC] text-white hover:bg-black transition cursor-pointer duration-300">
              <IoMdSend />
            </button>
          </form>
        </div>
      </div>
        <p className="text-gray-400 text-xs flex justify-center w-full">
          PulseAI - powered and protected
          </p>
      {error && <p className="text-red-500 flex justify-center w-full mt-2">{error}</p>}
    </div>
  );
}