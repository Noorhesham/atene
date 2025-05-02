import React, { useState } from "react";

interface Person {
  id: string;
  name: string;
  avatar: string;
  lastMessage?: string;
  status?: "طلب" | "مطلوب مساعدة" | "سؤال" | "بعض المحتوى";
  time?: string;
  productImage?: string;
}

interface PeopleProps {
  onSelectPerson: (personId: string) => void;
  selectedPerson: string | null;
}

const People: React.FC<PeopleProps> = ({ onSelectPerson, selectedPerson }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Sample data for people list
  const people: Person[] = [
    {
      id: "1",
      name: "Linda Store",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
      status: "مطلوب مساعدة",
      time: "12 م",
      lastMessage: "السعر شامل التوصيل",
    },
    {
      id: "2",
      name: "Linda Store",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
      status: "طلب",
      time: "2 ص",
      lastMessage: "السعر شامل التوصيل",
    },
    {
      id: "3",
      name: "Linda Store",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
      status: "سؤال",
      time: "12 م",
      lastMessage: "السعر شامل التوصيل",
      productImage: "https://via.placeholder.com/50",
    },
    {
      id: "4",
      name: "Linda Store",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
      time: "12 م",
      lastMessage: "السعر شامل التوصيل",
    },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-2xl font-semibold text-right">رسائل</h1>
        <button className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center">
          <span className="text-xl">+</span>
        </button>
      </div>

      {/* Search */}
      <div className="p-4 border-b">
        <div className="relative">
          <input
            type="text"
            placeholder="رسائل البحث..."
            className="w-full p-2 bg-gray-100 rounded-md text-right"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* People List */}
      <div className="flex-1 overflow-y-auto">
        {people.map((person) => (
          <div
            key={person.id}
            className={`flex items-center justify-between p-4 border-b cursor-pointer ${
              selectedPerson === person.id ? "bg-blue-50" : ""
            }`}
            onClick={() => onSelectPerson(person.id)}
          >
            <div className="w-12 h-12 overflow-hidden rounded-full shrink-0">
              <img src={person.avatar} alt={person.name} className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 mx-3 text-right">
              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">{person.time}</div>
                <div className="font-semibold">{person.name}</div>
              </div>

              <div className="text-sm text-gray-600">{person.lastMessage}</div>

              <div className="flex justify-end mt-1 space-x-1 space-x-reverse">
                {person.status && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      person.status === "طلب"
                        ? "bg-green-100 text-green-700"
                        : person.status === "مطلوب مساعدة"
                        ? "bg-green-100 text-green-700"
                        : person.status === "سؤال"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {person.status}
                  </span>
                )}

                {person.status === "سؤال" && person.productImage && (
                  <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-700">بعض المحتوى</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default People;
