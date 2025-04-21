import { NextResponse } from 'next/server';

export const runtime = "edge";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const MODEL = 'gemini-1.5-pro';
const API_URL = `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;

// Define message type
type Message = {
  role: string;
  content: string;
};

export async function POST(req: Request) {
  try {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === '') {
      console.error('Missing Gemini API key in environment variables');
      return NextResponse.json(
        { error: "API key is not configured. Please add GEMINI_API_KEY to your environment variables." },
        { status: 500 }
      );
    }

    const { image, prompt }: { image: string; prompt: string } = await req.json();
    
    // Remove the data:image/[type];base64, prefix
    const base64Image = image.split(',')[1];

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt || "Generate 5 engaging social media captions for this image. Make them creative and include relevant hashtags. Format each caption on a new line and number them 1-5."
            },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: base64Image
              }
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 32,
        topP: 0.8,
        maxOutputTokens: 1024
      }
    };

    console.log('Making request to Gemini API...');
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      
      try {
        const errorData = JSON.parse(errorText);
        console.error('Detailed error:', JSON.stringify(errorData));
        
        if (response.status === 403) {
          return NextResponse.json({ 
            error: `Gemini API error: 403 Forbidden. This usually indicates an issue with your API key or permissions.`, 
            details: errorData 
          }, { status: response.status });
        }
        
        return NextResponse.json({ 
          error: `Gemini API error: ${response.status}`, 
          details: errorData 
        }, { status: response.status });
      } catch (e) {
        return NextResponse.json({ 
          error: `Gemini API error: ${response.status} - ${errorText}` 
        }, { status: response.status });
      }
    }
    
    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error('Unexpected response format:', data);
      return NextResponse.json({ 
        error: 'Unexpected response format from Gemini API' 
      }, { status: 500 });
    }

    const text = data.candidates[0].content.parts[0].text;
    
    return NextResponse.json({ 
      text: text,
      type: 'text'
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
} 