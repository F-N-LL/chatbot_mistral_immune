"use client"
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, Loader2 } from "lucide-react";
import Markdown from 'react-markdown';


type Message = {
  role: string;
  content: string;
};

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const styles = {
    code: {
      backgroundColor: '#f5f5f5',
      padding: '0.2em',
      borderRadius: '0.2em',
      fontFamily: 'Consolas, Menlo, DejaVu Sans Mono, monospace',
      whiteSpace: 'pre-wrap',
      overflowX: 'auto',
    },
    pre: {
      backgroundColor: '#f5f5f5',
      padding: '0.5em',
      borderRadius: '0.5em',
      overflowX: 'auto',
    },
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setError(null);
    setIsLoading(true);

    const userMessage = {
      role: 'user',
      content: inputValue
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    try {
      const response = await axios.post(
        'https://api.mistral.ai/v1/chat/completions',
        {
          messages: [...messages, userMessage],
          model: "mistral-tiny"
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_MISTRAL_API_KEY}`,
            'Content-Type': 'application/json'
          },
        }
      );

      const assistantMessage = response.data.choices[0].message;
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError('An error occurred while fetching the response. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isClient) return null;

  return (
<div className="flex flex-col w-screen h-screen bg-white">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] whitespace-pre-line break-words rounded-lg ${
                message.role === 'user'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <div className="overflow-x-auto">
                <div className="min-w-0 whitespace-pre-line p-4 break-words ">
                  <Markdown
                      components={{
                        code: ({ node, ...props }) => <code style={styles.code} {...props} />,
                        pre: ({ node, ...props }) => <pre style={styles.pre} {...props} />,
                      }}
                  >{message.content}</Markdown>
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-4 bg-gray-100">
              <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
            </div>
          </div>
        )}
        {error && (
          <div className="flex justify-center">
            <div className="bg-red-100 text-red-600 p-3 rounded-lg">
              {error}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 min-h-[44px] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[80px]"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;