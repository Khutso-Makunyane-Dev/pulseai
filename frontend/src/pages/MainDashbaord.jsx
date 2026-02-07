import React, { useState, useEffect  } from "react";
import AISummaries from '../components/sideBar/AISummaries';
import Dashboard from '../components/sideBar/Dashboard';
import { getChats, getChatMessages, createChat  } from "../api/analysis";

import { IoIosArrowDown, IoIosMore } from "react-icons/io";
import { CgSearch } from "react-icons/cg";
import { FaChartLine, FaRobot,  FaBars, FaRegEdit } from "react-icons/fa";
import { IoSunnyOutline } from "react-icons/io5";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { IoLogOutOutline } from "react-icons/io5";
import LightLogo from '../assets/LightLog.svg';


export default function MainDashboard() {

    const [sidebarOpen, setSidebarOpen] = useState(true); // toggle sidebar
    const [activeSection, setActiveSection] = useState("AI Summaries"); // active section
    const [pulseVersion, setPulseVersion] = useState(false);
    const [menu, setMenu] = useState(false);
    const [open, setOpen] = useState(true);
    const [chats, setChats] = useState([]);
    const [activeChatId, setActiveChatId] = useState(null);
    const [loadingChats, setLoadingChats] = useState(false);
    const [messages, setMessages] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(false);


    useEffect(() => {
  const fetchChats = async () => {
    try {
      setLoadingChats(true);
      const data = await getChats();
      setChats(data);

      // Auto-select latest chat (ChatGPT behavior)
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


    const handleNewChat = async () => {
    try {
      // Create a new chat with default title
      const newChat = await createChat({ title: "New Chat" });

      // Add the new chat to the existing chats state
      setChats((prev) => [newChat, ...prev]);

      // Auto-select the new chat
      setActiveChatId(newChat.id);
    } catch (error) {
      console.error("Failed to create new chat:", error);
    }
  };

  // inside MainDashboard
  const handleDeleteChat = async (chatId) => {
    try {
      // Call backend API if needed
      await deleteChat(chatId); // you'll need this API

      // Remove from local state
      setChats((prev) => prev.filter((c) => c.id !== chatId));

      // If the deleted chat was active, select the next one
      if (activeChatId === chatId) {
        setActiveChatId(chats[1]?.id || null);
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };

  const handlePinChat = (chatId) => {
    setChats((prev) => {
      const chatIndex = prev.findIndex((c) => c.id === chatId);
      if (chatIndex === -1) return prev;

      const chatToPin = prev[chatIndex];
      const rest = prev.filter((c) => c.id !== chatId);
      return [chatToPin, ...rest]; // move pinned chat to top
    });
  };

  const handleArchiveChat = (chatId) => {
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, archived: true } : c))
    );
  };




    const renderSection = () => {
    switch (activeSection) {
        case "AI Summaries":
        return (
            <AISummaries
              messages={messages}          // state from parent
              setMessages={setMessages}    // function to update messages   
              activeChatId={activeChatId}
              onDeleteChat={handleDeleteChat}
              onPinChat={handlePinChat}
              onArchiveChat={handleArchiveChat}
            />


        );

        case "Dashboard":
        return <Dashboard />;
        default:
        return <AISummaries />; // fallback safety
    }
    };



return(
    <div className="flex flex-col w-full gap-2 h-screen bg-white">
    {/* HEADER */}
        <div className="flex justify-between items-center border-b border-[#bababa46]  p-2">
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
          
            <div className="bg-[#F8F8F8] flex items-center w-1/2 gap-3 h-10 rounded-md px-3">
                <input
                    type="search"
                    placeholder="Search your messages..."
                    className="w-full text-sm bg-transparent focus:outline-none"
                    />
                    <CgSearch className="text-gray-500" />
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
      onClick={() => { /* logout function */ }}
      className="flex items-center gap-2 text-red-500 hover:bg-red-100 p-2 w-full rounded-md transition duration-300"
    >
      <IoLogOutOutline /> Logout
    </button>

  </div>
)}

          
                </div>
                    <button
                          className="text-[#E013CC] text-xl  hover:bg-[#6969692a] p-2 rounded-md duration-300 cursor-pointer"
                          onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                          <FaBars />
                    </button>
            </div>
        </div>

        <div className="flex h-full gap-2">
                  {/* Sidebar */}
                  <div
                    className={`   bg-[#E013CC] text-white flex flex-col rounded-tr-lg overflow-hidden transition-all duration-300 ease-in-out ${
                      sidebarOpen ? "w-60 p-4 " : "w-0 p-0 "
                    }`}
                  >
                    <div className="flex w-auto h-auto justify-center items-center mb-4 p-2 ">
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
        
                    <div className=" w-full h-0.5 mt-2"></div>
                    <button  onClick={handleNewChat}
                    className="flex items-center gap-2 p-3 rounded hover:bg-white hover:text-[#E013CC] duration-300 transition cursor-pointer mt-4">
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
                        {/* History chats */}
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
                              className={`
                                w-full text-left text-sm px-3 py-2 rounded-md
                                transition duration-200
                                ${
                                  activeChatId === chat.id
                                    ? "bg-white text-[#E013CC]"
                                    : "hover:bg-white/20"
                                }
                              `}
                            >
                              <div className="truncate">
                                {chat.title || "New Chat"}
                              </div>
                            </button>
                          ))}
                        </div>

                      </div>
        
                    </div>
                  </div>
        
                  {/* Main Content */}
                  <div className="flex-1  overflow-auto">{renderSection()}</div>
              </div>
    </div>
)
}