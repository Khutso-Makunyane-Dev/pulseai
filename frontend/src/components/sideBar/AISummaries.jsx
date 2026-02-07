import { useState, useRef, useEffect } from "react";
import { analyzeText } from "../../api/analysis";

import { IoMdSend } from "react-icons/io";
import { IoAddSharp, IoMicOutline } from "react-icons/io5";
import { CgDanger } from "react-icons/cg";
import { MdOutlineTaskAlt } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import { TiPinOutline } from "react-icons/ti";
import { PiArchiveThin } from "react-icons/pi";
import Icon from '../../assets/Icon.svg';

export default function AISummaries({
  messages,
  setMessages,
  activeChatId,
  onDeleteChat,
  onPinChat,
  onArchiveChat,
}) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [more, setMore] = useState(false);
  const [menu, setMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // ✅ local loading
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

    // Add user message
    setMessages((prev) => [...prev, { type: "user", text: input }]);
    setError("");
    setIsLoading(true); // ✅ set loading

    try {
      const res = await analyzeText(input);

      let aiMessage = { type: "ai" };
      if (res.type === "human_response") aiMessage.text = res.response;
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

      // Add AI message
      setMessages((prev) => [...prev, aiMessage]);
      setInput("");
    } catch (err) {
      console.error(err);
      setError("Failed to get AI response. Check backend.");
    } finally {
      setIsLoading(false); // ✅ reset loading
    }
  };

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
          <div key={idx} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
              msg.type === "user"
                ? "bg-[#E013CC] text-white rounded-br-md"
                : "bg-white text-gray-800 border border-[#83828246] rounded-bl-md"
            }`}>
              {msg.type === "user" && msg.text}

              {msg.type === "ai" && (
                <div className="space-y-3">
                  {msg.text && <p>{msg.text}</p>}
                  {msg.summary && (
                    <div>
                      <p className="text-xs uppercase text-gray-400">Summary</p>
                      <p>{msg.summary}</p>
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
                      <p>{msg.feedback}</p>
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

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
