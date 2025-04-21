"use client";

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type MessageProps = {
  content: string;
  role: 'user' | 'assistant';
  isTyping?: boolean;
  displayedContent?: string;
};

type CodeProps = {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
};

export default function Message({ content, role, isTyping = false, displayedContent = '' }: MessageProps) {
  // Use displayed content (for typewriter effect) if provided, otherwise use full content
  const textToShow = isTyping ? displayedContent : content;

  return (
    <div className={`py-4 ${role === 'assistant' 
      ? 'bg-[rgba(6,27,43,0.4)] hover:bg-[rgba(6,27,43,0.5)]' 
      : 'bg-[rgba(0,10,20,0.3)] hover:bg-[rgba(0,10,20,0.4)]'} 
      backdrop-blur-sm transition-all duration-300`}>
      <div className="mx-auto max-w-4xl px-6 md:px-8">
        <div className="flex gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0 mt-1">
            {role === 'assistant' ? (
              <div className="h-10 w-10 rounded-xl bg-[rgba(45,226,230,0.1)] border border-[rgba(45,226,230,0.4)] 
                flex items-center justify-center text-[rgba(45,226,230,0.9)]
                transform transition-all duration-300 hover:scale-110 hover:rotate-3">
                G
              </div>
            ) : (
              <div className="h-10 w-10 rounded-xl bg-[rgba(255,154,108,0.1)] border border-[rgba(255,154,108,0.4)] 
                flex items-center justify-center text-[rgba(255,154,108,0.9)]
                transform transition-all duration-300 hover:scale-110 hover:-rotate-3">
                U
              </div>
            )}
          </div>
          
          {/* Message content */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="text-sm font-medium">
              {role === 'assistant' ? (
                <span className="text-[rgba(45,226,230,0.9)] font-semibold tracking-wide">GEMINI</span>
              ) : (
                <span className="text-[rgba(255,154,108,0.9)] font-semibold tracking-wide">YOU</span>
              )}
            </div>
            <div className={`prose prose-invert max-w-none 
              ${role === 'assistant' 
                ? 'text-[rgba(229,231,235,0.9)] prose-headings:text-[rgba(45,226,230,0.9)] prose-a:text-[rgba(45,226,230,0.9)]' 
                : 'text-[rgba(255,154,108,0.9)]'}
              prose-pre:bg-[rgba(0,10,20,0.3)] prose-pre:border prose-pre:border-[rgba(45,226,230,0.2)]
              prose-code:text-[rgba(45,226,230,0.9)] prose-code:bg-[rgba(45,226,230,0.1)] prose-code:px-1 prose-code:rounded
              prose-strong:text-[rgba(45,226,230,0.9)] prose-em:text-[rgba(255,154,108,0.9)]`}>
              {role === 'user' ? (
                <p className="whitespace-pre-wrap leading-relaxed">{textToShow}</p>
              ) : (
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, inline, className, children, ...props }: CodeProps) {
                      return (
                        <code className={`${inline ? 'px-1 py-0.5 rounded' : 'block p-4 rounded-lg'} ${className}`} {...props}>
                          {children}
                        </code>
                      )
                    }
                  }}
                >
                  {textToShow}
                </ReactMarkdown>
              )}
              {isTyping && (
                <span className="inline-block w-1.5 h-4 ml-0.5 bg-[rgba(45,226,230,0.9)] animate-pulse"></span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 