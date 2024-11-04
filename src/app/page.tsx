"use client";

import Chatbot from "../components/Chatbot"; // Importa el componente de chatbot

export default function Home() {
  return (
    <div className="">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start h-screen w-screen overflow-hidden">
        {/* ... */}
        <Chatbot /> 
        {/* ... */}
      </main>
      {/* ... */}
    </div>
  );
}
