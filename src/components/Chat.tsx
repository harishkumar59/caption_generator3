  "use client";

import React, { useState, useRef, useEffect } from 'react';
import Message from './Message';
import ChatInput from './ChatInput';
import ImageUploader from './ImageUploader';
import ImageIcon from './ImageIcon';
import Image from 'next/image';

type MessageType = {
  content: string;
  role: 'user' | 'assistant';
  id: string;
  type?: 'text' | 'image';
  imageUrl?: string;
};

export default function Chat() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const handleImageSelect = async (imageData: string) => {
    setError(null);
    setCurrentImage(imageData);
    
    const userMessageId = generateId();
    const userMessage: MessageType = {
      content: "Generate captions for this image",
      role: 'user',
      id: userMessageId,
      type: 'image',
      imageUrl: imageData
    };
    
    setMessages((prev) => [...prev, userMessage]);
    await generateCaptions(imageData);
  };
    
  const generateCaptions = async (imageData: string) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [],
          image: imageData,
          prompt: "Generate 5 engaging social media captions for this image. Make them creative and include relevant hashtags. Format each caption on a new line and number them 1-5."
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `API returned ${response.status}`);
      }
      
      if (data && data.text) {
        const assistantMessageId = generateId();
        const assistantMessage: MessageType = { 
          content: data.text,
          role: 'assistant', 
          id: assistantMessageId,
          type: 'text'
        };
        
        setMessages((prev) => [...prev, assistantMessage]);
      } else if (data && data.error) {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setError(errorMessage);
      setMessages((prev) => [
        ...prev,
        {
          content: `Sorry, I encountered an error. Please try again. (Error: ${errorMessage})`,
          role: 'assistant',
          id: generateId()
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!currentImage) {
      setError("Please upload an image first!");
      return;
    }

    setError(null);
    const userMessageId = generateId();
    const userMessage: MessageType = { content, role: 'user', id: userMessageId };
    setMessages((prev) => [...prev, userMessage]);
    
    await generateCaptions(currentImage);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gradient-to-b from-[#061B2B] to-[#0A2339]">
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-2xl px-4 py-8 rounded-2xl bg-[rgba(6,27,43,0.6)] backdrop-blur-sm border border-[rgba(45,226,230,0.2)] shadow-lg transform hover:scale-[1.02] transition-all duration-300">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-[rgba(45,226,230,0.1)] border border-[rgba(45,226,230,0.4)] flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-[rgba(45,226,230,0.9)]" />
                </div>
              </div>
              <h2 className="text-2xl font-medium text-[rgba(45,226,230,0.9)] mb-4">
                Social Media Caption Generator
              </h2>
              <p className="text-gray-400 mb-4 leading-relaxed">
                Upload an image and I&apos;ll generate engaging captions for your social media posts.
                Get creative suggestions with relevant hashtags to boost your engagement!
              </p>
              {error && (
                <div className="mt-4 p-3 bg-red-900/50 text-red-200 rounded-md text-sm">
                  {error}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {messages.map((message, index) => (
              <div 
                key={message.id}
                className="transform transition-all duration-300 hover:translate-x-1"
              >
                <div className="mx-auto max-w-4xl">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className={`h-8 w-8 rounded-full ${
                        message.role === 'assistant' 
                          ? 'bg-[rgba(45,226,230,0.1)] text-[rgba(45,226,230,0.9)] border border-[rgba(45,226,230,0.4)]' 
                          : 'bg-[rgba(255,154,108,0.1)] text-[rgba(255,154,108,0.9)] border border-[rgba(255,154,108,0.4)]'
                      } flex items-center justify-center transition-colors duration-300`}>
                        {message.role === 'user' ? 'U' : 'A'}
                      </div>
                    </div>
                    <div className="flex-1">
                      {message.type === 'image' && message.imageUrl ? (
                        <div className="mb-4 transform transition-all duration-300 hover:scale-[1.02]">
                          <Image
                            src={message.imageUrl}
                            alt="Uploaded"
                            width={320}
                            height={320}
                            className="max-w-md rounded-lg shadow-lg border border-[rgba(45,226,230,0.2)]"
                          />
                        </div>
                      ) : null}
                      {message.type === 'text' ? (
                        <Message
                          content={message.content}
                          role={message.role}
                          isTyping={false}
                        />
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="py-5 bg-[rgba(6,27,43,0.4)] backdrop-blur-sm transform transition-all duration-300">
                <div className="mx-auto max-w-4xl px-5 md:px-8">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="h-8 w-8 rounded-full bg-[rgba(45,226,230,0.1)] border border-[rgba(45,226,230,0.4)] flex items-center justify-center text-[rgba(45,226,230,0.9)]">
                        A
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex space-x-2 items-center">
                        <div className="w-2 h-2 bg-[rgba(45,226,230,0.9)] rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-[rgba(45,226,230,0.9)] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-[rgba(45,226,230,0.9)] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {error && !isLoading && (
              <div className="py-3 px-5 md:px-8 mx-auto max-w-4xl">
                <div className="p-3 bg-red-900/50 text-red-200 rounded-md text-sm border border-red-900/50 shadow-lg">
                  Error: {error}
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-[rgba(45,226,230,0.2)] bg-[rgba(6,27,43,0.8)] backdrop-blur-md">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col gap-4 p-4">
            <ImageUploader onImageSelect={handleImageSelect} />
            <ChatInput 
              onSendMessage={handleSendMessage} 
              isLoading={isLoading}
              placeholder="Ask for specific caption styles or themes..."
            />
          </div>
        </div>
      </div>
    </div>
  );
} 