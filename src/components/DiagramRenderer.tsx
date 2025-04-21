"use client";

import React, { useEffect, useRef } from 'react';

interface DiagramRendererProps {
  diagramText: string;
}

let mermaidInitialized = false;

export default function DiagramRenderer({ diagramText }: DiagramRendererProps) {
  const diagramRef = useRef<HTMLDivElement>(null);
  const uniqueId = useRef(`diagram-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    const initializeMermaid = async () => {
      try {
        const mermaid = (await import('mermaid')).default;
        
        if (!mermaidInitialized) {
          mermaid.initialize({
            startOnLoad: false,
            theme: 'dark',
            securityLevel: 'loose',
            themeVariables: {
              primaryColor: '#ff6b00',
              primaryTextColor: '#fff',
              primaryBorderColor: '#ff6b00',
              lineColor: '#ff6b00',
              secondaryColor: '#006100',
              tertiaryColor: '#fff',
            },
          });
          mermaidInitialized = true;
        }

        if (diagramRef.current) {
          // Clear previous diagram
          diagramRef.current.innerHTML = '';
          
          try {
            const { svg } = await mermaid.render(uniqueId.current, diagramText);
            if (diagramRef.current) {
              diagramRef.current.innerHTML = svg;
            }
          } catch (renderError) {
            console.error('Failed to render diagram:', renderError);
            diagramRef.current.innerHTML = `
              <div class="text-red-500 p-4">
                Failed to render diagram. Please check your diagram syntax.
                <pre class="mt-2 text-sm">${diagramText}</pre>
              </div>
            `;
          }
        }
      } catch (error) {
        console.error('Failed to initialize mermaid:', error);
      }
    };

    initializeMermaid();
  }, [diagramText]);

  return (
    <div className="w-full overflow-x-auto bg-gray-800 rounded-lg p-4">
      <div ref={diagramRef} className="flex justify-center min-h-[200px]" />
    </div>
  );
} 