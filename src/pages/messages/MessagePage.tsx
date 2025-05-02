import { useState, useEffect } from "react";
import People from "./People";
import Chat from "./Chat";

const MessagePage = () => {
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);

  // Remove navbar and footer for full-screen chat
  useEffect(() => {
    // Hide navbar and footer
    const navbar = document.querySelector("nav");
    const footer = document.querySelector("footer");

    if (navbar) navbar.style.display = "none";
    if (footer) footer.style.display = "none";

    // Restore navbar and footer on component unmount
    return () => {
      if (navbar) navbar.style.display = "";
      if (footer) footer.style.display = "";
    };
  }, []);

  return (
    <div className="flex h-screen bg-white">
      <div className="w-full max-w-md border-r">
        <People onSelectPerson={setSelectedPerson} selectedPerson={selectedPerson} />
      </div>
      <div className="flex-grow">
        <Chat selectedPerson={selectedPerson} />
      </div>
    </div>
  );
};

export default MessagePage;
