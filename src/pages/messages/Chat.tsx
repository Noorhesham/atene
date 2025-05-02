import { ChatProps } from "@/types";
import React, { useEffect, useRef } from "react";

import Price from "@/components/Price";
import MaxWidthWrapper from "@/components/MaxwidthWrapper";
import { MoreVertical } from "lucide-react";
import ChatForm from "./ChatForm";

// Define the schema for chat message validation using Zod

interface Message {
  id: string;
  text: string;
  isMine: boolean;
  timestamp: string;
  images?: string[];
  productInfo?: {
    title: string;
    price: string;
    image: string;
  };
}

// Define local interface for people with products
interface PersonData {
  id: string;
  name: string;
  avatar: string;
  product?: {
    name: string;
    price: number;
    image: string;
  };
}

const Chat: React.FC<ChatProps> = ({ selectedPerson }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sample people data
  const people: Record<string, PersonData> = {
    "1": {
      id: "1",
      name: "Linda Store",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
      product: {
        name: "عطر جونشي للرجال - عود مكثف - عطر جميل ويدوم طويلا",
        price: 450,
        image: "https://via.placeholder.com/100x100",
      },
    },
    "2": {
      id: "2",
      name: "Linda Store",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    "3": {
      id: "3",
      name: "Linda Store",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
      product: {
        name: "عطر جونشي للرجال - عود مكثف - عطر جميل ويدوم طويلا",
        price: 450,
        image: "https://via.placeholder.com/100x100",
      },
    },
    "4": {
      id: "4",
      name: "Linda Store",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    },
  };

  // Sample messages data for each person
  const messagesByPerson: Record<string, Message[]> = {
    "1": [
      {
        id: "1-1",
        text: "You Started chat about a new",
        isMine: false,
        timestamp: "08:30 AM",
      },
    ],
    "3": [
      {
        id: "3-1",
        text: "You Started chat about a new",
        isMine: false,
        timestamp: "08:30 AM",
      },
      {
        id: "3-2",
        text: "كيف حالك؟... او ان اعرف تفاصيل",
        isMine: false,
        timestamp: "08:20 AM",
      },
      {
        id: "3-3",
        text: "اهلا وسهلا",
        isMine: true,
        timestamp: "08:30 AM",
      },
      {
        id: "3-4",
        text: "متوفر في عمان نرسل منتجاتنا لكل المحافظات",
        isMine: true,
        timestamp: "08:30 AM",
      },
      {
        id: "3-5",
        text: "جونشي عود مكثف عطار EAU DE طبيعي٩٠ مل. ٣.٠ فل. انيقة. جميل جدا ويدوم طويلا",
        isMine: true,
        timestamp: "08:33 AM",
      },
      {
        id: "3-6",
        text: "جونشي ، ١٤ شارع دو كواتر سبتمبر ٧٥٠٠٢ باريس ، UK٦١ ، نيوبورت ، نيوبورت ١٠١١٨،صنع في سان ١ فابريكي أون اسباني",
        isMine: true,
        timestamp: "08:35 AM",
        images: ["Frame 1000005447 (4).png", "Frame 1000005447 (4).png", "Frame 1000005447 (4).png"],
      },
    ],
    "2": [],
    "4": [],
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedPerson, messagesByPerson]);

  if (!selectedPerson) {
    return (
      <div className="flex items-center justify-center h-full bg-white">
        <div className="flex flex-col text-center items-center gap-2">
          <h2 className="text-xl mb-4 font-bold">نصائح عامة</h2>
          <p className="text-gray-500">اجتمع في الأماكن العامة فقط.</p>
          <p className="text-gray-500"> لا تقم بإرسال المال مسبقاً.</p>
          <p className="text-gray-500"> قم بتفقد المنتج جيداً قبل شرائه.</p>
        </div>
      </div>
    );
  }

  const person = people[selectedPerson];
  const messages = messagesByPerson[selectedPerson] || [];

  return (
    <MaxWidthWrapper className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <button className="text-gray-500">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
        <div className="flex items-center">
          <div className="ml-3 text-right">
            <div className="font-semibold">{person.name}</div>
            <div className="text-xs text-gray-500">محل</div>
          </div>
          <div className="w-10 h-10 overflow-hidden rounded-full ml-2">
            <img src={person.avatar} alt={person.name} className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Product Info (if available) */}
      {person.product && (
        <div className="p-4 border-b w-full flex items-center justify-between bg-white">
          <div className="flex gap-3 items-start w-full">
            <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
              <img src={person.product.image} alt={person.product.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col text-right mr-2 flex-1">
              <div className="font-medium text-gray-900 text-sm leading-tight">{person.product.name}</div>
            </div>
            <Price
              className="bg-primary mt-2 !ml-0 w-fit font-bold text-white py-1.5 px-3 rounded-full text-xs"
              price={person.product.price}
            />
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-white">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex   items-end ${message.isMine ? "justify-start" : "justify-end"}`}>
              <div
                className={`flex   text-right gap-2 items-end max-w-[85%] ${
                  message.isMine ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {" "}
                {message.isMine && (
                  <div className="w-8 h-8 overflow-hidden rounded-full  mr-2 order-2">
                    <img
                      src="https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff"
                      alt="You"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div
                  className={`rounded-lg p-3 ${
                    !message.isMine
                      ? "!bg-[#F1F1F5] text-gray-800 order-1 rounded-br-none"
                      : "bg-blue-500 text-white rounded-bl-none"
                  }`}
                >
                  <div className={`text-sm ${!message.isMine ? "text-right" : "text-left"}`}>{message.text}</div>

                  {message.images && message.images.length > 0 && (
                    <div className={`mt-2 flex flex-wrap gap-2 ${!message.isMine ? "justify-end" : "justify-start"}`}>
                      {message.images.map((img: string, index: number) => (
                        <div key={index} className="w-20 h-20 rounded overflow-hidden">
                          <img src={img} alt="Attached" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}

                  <div
                    className={`text-[10px] mt-1 ${
                      !message.isMine ? "text-right text-gray-500" : "text-left text-gray-200"
                    }`}
                  >
                    {message.timestamp}
                  </div>
                </div>
                {!message.isMine && (
                  <div className="w-8 h-8 overflow-hidden rounded-full flex-shrink-0 ml-2 order-2">
                    <img src={person.avatar} alt={person.name} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <ChatForm selectedPerson={selectedPerson} />
    </MaxWidthWrapper>
  );
};

export default Chat;
