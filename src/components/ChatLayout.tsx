"use client";

import React from 'react';
import Chat from './Chat';

export default function ChatLayout() {
  return (
    <div className="flex h-screen bg-[#061b2b] relative">
      {/* Left Sidebar */}
      <div className="hidden md:flex md:w-80 flex-col glass-darker rounded-r-2xl m-4 mr-0 overflow-hidden border-r border-[rgba(45,226,230,0.3)]">
        {/* Google Logo */}
        <div className="p-6 border-b border-[rgba(45,226,230,0.3)] flex flex-col items-center">
          <div className="w-20 h-20 rounded-xl bg-[rgba(45,226,230,0.1)] border border-[rgba(45,226,230,0.4)] flex items-center justify-center mb-4 cyber-border">
            <span className="font-bold text-3xl neon-teal">G</span>
          </div>
          <div className="font-bold text-2xl neon-teal tracking-wide">GEMINI</div>
        </div>
        
        {/* Tabs and chat history */}
        <div className="p-4 text-sm">
          <div className="mb-4">
            <div className="px-3 py-2 border-b-2 border-[rgba(45,226,230,0.6)] font-medium text-[rgba(45,226,230,0.9)]">Chats</div>
          </div>
        </div>
        
        {/* Chat History Section */}
        <div className="flex-1 overflow-y-auto p-2">
          {/* Chat items */}
          <div className="space-y-3 px-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div 
                key={index} 
                className="p-3 rounded-lg border border-[rgba(45,226,230,0.2)] bg-[rgba(45,226,230,0.05)] hover:bg-[rgba(45,226,230,0.1)] cursor-pointer flex items-center"
              >
                <div className="h-8 w-8 rounded-md bg-[rgba(45,226,230,0.1)] flex items-center justify-center border border-[rgba(45,226,230,0.3)] mr-3">
                  <svg className="w-4 h-4 text-[rgba(45,226,230,0.9)]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 10h8M8 14h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M19 4H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>
                <div className="text-sm truncate text-[rgba(229,231,235,0.9)]">
                  {index === 0 ? "Drawn to Content Creation" : 
                   index === 1 ? "Developing Your App Idea" : 
                   index === 2 ? "Social Media's Cognitive Toll" : 
                   `Chat ${index + 1}`}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Free plan indicator */}
        <div className="p-4 m-2 rounded-lg border border-[rgba(45,226,230,0.3)] bg-[rgba(45,226,230,0.05)]">
          <div className="text-center text-sm text-[rgba(45,226,230,0.9)]">
            Free place varyalst
          </div>
        </div>
        
        {/* User Info */}
        <div className="p-4 border-t border-[rgba(45,226,230,0.3)] flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-md bg-[rgba(45,226,230,0.1)] flex items-center justify-center border border-[rgba(45,226,230,0.3)]">
              <span className="text-[rgba(45,226,230,0.9)]">S</span>
            </div>
            <div className="ml-3 text-sm text-[rgba(229,231,235,0.9)]">Harish and nitin</div>
          </div>
        </div>
      </div>
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative p-4">
        {/* Header */}
        <div className="flex items-center justify-center py-8 mb-8">
          <h1 className="text-4xl font-bold">
            <span className="neon-orange mr-2">✧</span>
            <span className="gradient-text">How&apos;s it going, Harish and nitin?</span>
          </h1>
        </div>
        
        {/* Chat Content */}
        <div className="flex-1 overflow-hidden glass rounded-2xl cyber-border">
          <Chat />
        </div>
      </div>
    </div>
  );
} 