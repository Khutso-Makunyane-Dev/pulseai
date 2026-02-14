import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import React, { useState, useEffect, useContext } from "react";
import AISummaries from '../components/sideBar/AISummaries';
import Dashboard from '../components/sideBar/Dashboard';
import { getChats, getChatMessages, createChat, deleteChat } from "../api/analysis";

import { IoIosArrowDown, IoIosMore } from "react-icons/io";
import { CgSearch } from "react-icons/cg";
import { FaChartLine, FaRobot, FaBars, FaRegEdit } from "react-icons/fa";
import { IoSunnyOutline } from "react-icons/io5";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { IoLogOutOutline } from "react-icons/io5";
import LightLogo from '../assets/LightLog.svg';
import Icon from '../assets/Icon.svg';

export default function MainDashboard() {
  
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("AI Summaries");
  const [pulseVersion, setPulseVersion] = useState(false);
  const [menu, setMenu] = useState(false);
  const [open, setOpen] = useState(true);
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [loadingChats, setLoadingChats] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [deletingChatId, setDeletingChatId] = useState(null);
  
  // Add search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoadingChats(true);
        const data = await getChats();
        setChats(data);

        if (data.length > 0) {
          setActiveChatId(data[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch chats:", error);
      } finally {
        setLoadingChats(false);
      }
    };

    fetchChats();
  }, []);

  useEffect(() => {
    if (!activeChatId) return;

    const fetchMessages = async () => {
      try {
        setLoadingMessages(true);
        const data = await getChatMessages(activeChatId);
        setMessages(data);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [activeChatId]);

  // Search function
  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const results = [];

    // Search through all chats and their messages
    for (const chat of chats) {
      try {
        const chatMessages = await getChatMessages(chat.id);
        
        // Filter messages that contain the search query
        const matchingMessages = chatMessages.filter(msg => 
          msg.text?.toLowerCase().includes(query.toLowerCase()) ||
          msg.summary?.toLowerCase().includes(query.toLowerCase()) ||
          msg.feedback?.toLowerCase().includes(query.toLowerCase())
        );

        if (matchingMessages.length > 0 || 
            chat.title?.toLowerCase().includes(query.toLowerCase())) {
          results.push({
            ...chat,
            matchingMessages,
            matchType: chat.title?.toLowerCase().includes(query.toLowerCase()) 
              ? 'chat' 
              : 'messages'
          });
        }
      } catch (error) {
        console.error(`Failed to search chat ${chat.id}:`, error);
      }
    }

    setSearchResults(results);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearching(false);
  };


    // Navigate to a specific message in chat
    const navigateToMessage = (chatId, messageId) => {
      setActiveChatId(chatId);
      
      // Store the message ID to scroll to and highlight
      setTimeout(() => {
        const messageElement = document.getElementById(`message-${messageId}`);
        if (messageElement) {
          messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
          // Add highlight effect
          messageElement.classList.add('bg-yellow-100', 'transition-colors', 'duration-1000');
          setTimeout(() => {
            messageElement.classList.remove('bg-yellow-100');
          }, 2000);
        }
      }, 500); // Small delay to ensure messages are loaded
      
      clearSearch();
    };

  const handleNewChat = async () => {
    try {
      const newChat = await createChat({ title: "New Chat" });
      setChats((prev) => [newChat, ...prev]);
      setActiveChatId(newChat.id);
      clearSearch(); // Clear search when starting new chat
    } catch (error) {
      console.error("Failed to create new chat:", error);
    }
  };

  const handleDeleteChat = async (chatId) => {
    if (!window.confirm("Are you sure you want to delete this chat? This action cannot be undone.")) {
      return;
    }

    try {
      setDeletingChatId(chatId);
      await deleteChat(chatId);

      setChats((prev) => prev.filter((c) => c.id !== chatId));

      if (activeChatId === chatId) {
        const nextChat = chats.find((c) => c.id !== chatId);
        if (nextChat) {
          setActiveChatId(nextChat.id);
        } else {
          setActiveChatId(null);
          setMessages([]);
        }
      }
      
      // Refresh search results if searching
      if (searchQuery) {
        handleSearch(searchQuery);
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
      alert("Failed to delete chat. Please try again.");
    } finally {
      setDeletingChatId(null);
    }
  };

  const handlePinChat = (chatId) => {
    setChats((prev) => {
      const chatIndex = prev.findIndex((c) => c.id === chatId);
      if (chatIndex === -1) return prev;

      const chatToPin = prev[chatIndex];
      const rest = prev.filter((c) => c.id !== chatId);
      return [chatToPin, ...rest];
    });
  };

  const handleArchiveChat = (chatId) => {
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, archived: true } : c))
    );
  };

  const handleChatTitleUpdate = (chatId, newTitle) => {
    console.log(" handleChatTitleUpdate called in MainDashboard:", { chatId, newTitle });
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId && chat.title !== newTitle 
          ? { ...chat, title: newTitle } 
          : chat
      )
    );
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderSection = () => {
    switch (activeSection) {
      case "AI Summaries":
        return (
          <AISummaries
            messages={messages}
            setMessages={setMessages}
            activeChatId={activeChatId}
            onDeleteChat={handleDeleteChat}
            onPinChat={handlePinChat}
            onArchiveChat={handleArchiveChat}
            onChatTitleUpdate={handleChatTitleUpdate}
            searchQuery={searchQuery} // Pass search query to highlight results
          />
        );
      case "Dashboard":
        return <Dashboard />;
      default:
        return (
          <AISummaries
            messages={messages}
            setMessages={setMessages}
            activeChatId={activeChatId}
            onDeleteChat={handleDeleteChat}
            onPinChat={handlePinChat}
            onArchiveChat={handleArchiveChat}
            onChatTitleUpdate={handleChatTitleUpdate}
            searchQuery={searchQuery}
          />
        );
    }
  };

  return (
    <div className="flex flex-col w-full gap-2 h-screen bg-white">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-[#bababa46] p-2">
        <div
          className="relative"
          onMouseEnter={() => setPulseVersion(true)}
          onMouseLeave={() => setPulseVersion(false)}
        >
          <button className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-[#6969692a]">
            PulseAI
            <IoIosArrowDown
              className={`transition-transform duration-300 ${
                pulseVersion ? "rotate-180" : ""
              }`}
            />
          </button>

          {pulseVersion && (
            <div className="absolute top-full mt-2 w-60 bg-white border border-[#83828246] rounded-lg shadow-sm p-3 z-50">
              <p className="text-sm text-gray-600">PulseAI v1.0</p>
              <p className="text-xs text-gray-400">Built by Khutso Makunyane</p>
            </div>
          )}
        </div>

        {/* Updated Search Bar */}
        <div className="relative flex items-center w-1/2">
          <div className="bg-[#F8F8F8] flex items-center w-full gap-3 h-10 rounded-md px-3">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search chats and messages..."
              className="w-full text-sm bg-transparent focus:outline-none"
            />
            {searchQuery ? (
              <button onClick={clearSearch} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            ) : (
              <CgSearch className="text-gray-500" />
            )}
          </div>

          {/* Search Results Dropdown */}
          {isSearching && searchResults.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-white border border-[#83828246] rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
              {searchResults.map((result) => (
                <div key={result.id} className="border-b last:border-b-0">
                  {/* Chat match */}
                  {result.matchType === 'chat' && (
                    <button
                      onClick={() => {
                        setActiveChatId(result.id);
                        clearSearch();
                      }}
                      className="w-full text-left p-3 hover:bg-gray-50 transition flex items-center gap-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#E013CC] text-white flex items-center justify-center text-xs font-medium">
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <div className="font-medium text-[#E013CC]">{result.title}</div>
                        <div className="text-xs text-gray-500">Chat matches your search</div>
                      </div>
                    </button>
                  )}
                  
                  {/* Message matches */}
                  {result.matchingMessages.map((msg) => (
                    <button
                      key={msg.id}
                      onClick={() => navigateToMessage(result.id, msg.id)}
                      className="w-full text-left p-3 hover:bg-gray-50 transition border-t first:border-t-0 flex items-start gap-3"
                    >
                      {/* Avatar/Icon based on message type */}
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        msg.type === 'user' 
                          ? 'bg-[#E013CC] text-white text-xs font-medium' 
                          : 'bg-gray-100'
                      }`}>
                        {msg.type === 'user' 
                          ? (user?.username?.charAt(0).toUpperCase() || 'U')
                          : <img src={Icon} alt="AI" className="w-4 h-4" />
                        }
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium px-2 py-1 rounded bg-gray-100">
                            {result.title}
                          </span>
                          <span className="text-xs text-gray-500">
                            {msg.type === 'user' ? 'You' : 'PulseAI'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {msg.text || msg.summary || msg.feedback}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}

          {isSearching && searchQuery && searchResults.length === 0 && (
            <div className="absolute top-full mt-2 w-full bg-white border border-[#83828246] rounded-lg shadow-lg z-50 p-4 text-center text-gray-500">
              No results found for "{searchQuery}"
            </div>
          )}
        </div>

        <div className="flex justify-center items-center gap-4 p-1">
          <div className="relative">
            <button
              onClick={() => setMenu((p) => !p)}
              className="p-2 rounded-md hover:bg-[#6969692a] duration-300 cursor-pointer"
            >
              <IoIosMore />
            </button>

            {menu && (
              <div className="absolute right-0 top-full mt-2 w-60 bg-white border border-[#83828246] rounded-lg shadow-sm p-3 z-50">
                <button
                  onClick={() => { /* toggle theme */ }}
                  className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 p-2 w-full rounded-md transition duration-300"
                >
                  <IoSunnyOutline /> Dark Mode
                </button>

                <button
                  onClick={() => { /* open help/support */ }}
                  className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 p-2 w-full rounded-md transition duration-300"
                >
                  <IoMdHelpCircleOutline /> Help & Support
                </button>

                <button
                  onClick={() => {
                    handleLogout();
                    setMenu(false);
                  }}
                  className="flex items-center gap-2 text-red-500 hover:bg-red-100 p-2 w-full rounded-md transition duration-300 cursor-pointer"
                >
                  <IoLogOutOutline /> Logout
                </button>
              </div>
            )}
          </div>
          <button
            className="text-[#E013CC] text-xl hover:bg-[#6969692a] p-2 rounded-md duration-300 cursor-pointer"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FaBars />
          </button>
        </div>
      </div>

      {/* Rest of your component remains the same */}
      <div className="flex h-full gap-2">
        {/* Sidebar */}
        <div
          className={`bg-[#E013CC] text-white flex flex-col rounded-tr-lg overflow-hidden transition-all duration-300 ease-in-out ${
            sidebarOpen ? "w-60 p-4" : "w-0 p-0"
          }`}
        >
          {/* ... sidebar content (unchanged) ... */}
          <div className="flex w-auto h-auto justify-center items-center mb-4 p-2">
            <img
              onClick={() => setSidebarOpen(!sidebarOpen)}
              src={LightLogo}
              alt="Logo"
              className="w-35 cursor-pointer"
            />
          </div>

          <nav className="flex flex-col gap-2">
            {[
              { name: "AI Summaries", icon: <FaRobot /> },
              { name: "Dashboard", icon: <FaChartLine /> },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveSection(item.name)}
                className={`flex items-center gap-2 p-3 rounded hover:bg-white hover:text-[#E013CC] duration-300 transition cursor-pointer ${
                  activeSection === item.name ? "bg-white text-[#E013CC]" : ""
                }`}
              >
                {item.icon}
                {sidebarOpen && item.name}
              </button>
            ))}
          </nav>

          <div className="w-full h-0.5 mt-2"></div>
          <button
            onClick={handleNewChat}
            className="flex items-center gap-2 p-3 rounded hover:bg-white hover:text-[#E013CC] duration-300 transition cursor-pointer mt-4"
          >
            <FaRegEdit />
            New Chat
          </button>

          <button className="flex items-center gap-2 p-3 rounded hover:bg-white hover:text-[#E013CC] duration-300 transition cursor-pointer mt-2">
            <CgSearch />
            Search Chat
          </button>

          <div className="flex flex-col w-full flex-1 mt-2 p-2 overflow-hidden">
            <button
              onClick={() => setOpen(!open)}
              className="flex text-xs items-center justify-start h-10 gap-2 w-full p-2 cursor-pointer"
            >
              <span>YOUR CHATS</span>
              <IoIosArrowDown
                className={`transition-transform duration-300 ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`
                w-full overflow-y-auto scrollbar-hide
                transition-all duration-300 ease-in-out
                ${open ? "max-h-64" : "max-h-0"}
              `}
            >
              <div className="space-y-1">
                {loadingChats && (
                  <p className="text-xs text-white/70 px-2">Loading chats...</p>
                )}

                {!loadingChats && chats.length === 0 && (
                  <p className="text-xs text-white/70 px-2">No chats yet</p>
                )}

                {chats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => setActiveChatId(chat.id)}
                    disabled={deletingChatId === chat.id}
                    className={`
                      w-full text-left text-sm px-3 py-2 rounded-md
                      transition duration-200
                      ${deletingChatId === chat.id ? 'opacity-50 cursor-wait' : ''}
                      ${
                        activeChatId === chat.id
                          ? "bg-white text-[#E013CC]"
                          : "hover:bg-white/20"
                      }
                    `}
                  >
                    <div className="truncate flex items-center justify-between">
                      {chat.title || "New Chat"}
                      {deletingChatId === chat.id && (
                        <span className="text-xs">Deleting...</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">{renderSection()}</div>
      </div>
    </div>
  );
}