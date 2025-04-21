"use client";

import React, { useState, FormEvent, KeyboardEvent } from 'react';

type ChatInputProps = {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  placeholder?: string;
};

export default function ChatInput({ onSendMessage, isLoading, placeholder = "How can I help you today?" }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="px-6 py-5">
      <form onSubmit={handleSubmit} className="mx-auto">
        <div className="relative rounded-2xl border border-[rgba(45,226,230,0.4)] bg-[rgba(6,27,43,0.6)] shadow-[0_0_8px_rgba(45,226,230,0.3)]">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full resize-none bg-transparent py-4 pl-4 pr-32 outline-none focus:ring-0 rounded-2xl max-h-[180px] text-[rgba(229,231,235,0.9)] placeholder-[rgba(229,231,235,0.5)]"
            rows={1}
            disabled={isLoading}
          />

          <div className="absolute right-4 bottom-4">
            <button
              type="submit"
              disabled={!message.trim() || isLoading}
              className={`rounded-full w-10 h-10 flex items-center justify-center ${
                !message.trim() || isLoading 
                  ? 'bg-[rgba(45,226,230,0.2)] text-[rgba(45,226,230,0.4)]' 
                  : 'bg-[rgba(45,226,230,0.3)] text-[rgba(45,226,230,1)] shadow-[0_0_8px_rgba(45,226,230,0.5)] hover:bg-[rgba(45,226,230,0.4)]'
              } transition-all duration-200`}
              aria-label="Send message"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              )}
            </button>
          </div>

          <div className="absolute right-7 bottom-3.5 flex items-center">
            <span className="text-[rgba(45,226,230,0.8)] text-sm font-medium">Gemini 2.0 Flash</span>
          </div>
        </div>
      </form>
    </div>
  );
} 