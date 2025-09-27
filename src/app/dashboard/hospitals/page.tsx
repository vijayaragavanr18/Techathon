'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getCenters, Center } from '@/services/health'; // Reusing getCenters for hospitals placeholder
import { Loader2, Hospital, Phone, Navigation, MapPin } from 'lucide-react';
import { MessageCircle, Mic, Volume2, Send, StopCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { generateResponse, analyzeSentiment } from '@/services/chatbot';
import { Message, ChatState } from '@/types/chat';
import { cn } from '@/lib/utils';

// Filter function placeholder - adapt if getCenters returns types or use a dedicated getHospitals service
const filterHospitals = (centers: Center[]): Center[] => {
   // Assuming center name might indicate it's a hospital for this placeholder
   return centers.filter(center => center.name.toLowerCase().includes('hospital') || center.name.toLowerCase().includes('medical center'));
};

// Add type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState<Center[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHospitals = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // TODO: Replace with actual getHospitals service call if available
        const data = await getCenters();
        // Apply filtering if necessary (using placeholder logic here)
        const hospitalData = filterHospitals(data);
        setHospitals(hospitalData);
      } catch (err) {
        console.error("Failed to fetch hospitals:", err);
        setError("Could not load nearby hospitals. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchHospitals();
  }, []);

  return (
    <div className="space-y-6">
       <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
         <Hospital className="w-6 h-6" /> Nearby Hospitals
       </h1>
       <p className="text-muted-foreground">Find hospitals and major medical centers near you.</p>

       {/* Map View Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Map View</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-96 rounded-lg overflow-hidden shadow">
              <iframe
                title="Nearby Hospital Map"
                src={`https://www.google.com/maps?q=${encodeURIComponent('Dalmia Board, Salem - Bangalore Highway, Vellakalpatti, Salem, Tamil Nadu 636012')}&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </CardContent>
        </Card>

       {/* List View */}
       <Card>
         <CardHeader>
            <CardTitle>Hospital List</CardTitle>
         </CardHeader>
         <CardContent>
           {error && <p className="text-destructive text-center py-4">{error}</p>}
           {isLoading ? (
              <div className="flex justify-center items-center p-4">
                 <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
           ) : hospitals.length > 0 ? (
              <div className="space-y-4">
                 {hospitals.map((hospital, index) => (
                    <Card key={index} className="p-4 flex flex-col md:flex-row justify-between md:items-center gap-4">
                       <div>
                          <h3 className="font-semibold text-lg flex items-center gap-1">
                             <Hospital className="h-4 w-4 text-muted-foreground"/> {hospital.name}
                          </h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                             <MapPin className="h-3 w-3 text-muted-foreground" />{hospital.address}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                             <Phone className="h-3 w-3 text-muted-foreground" />
                             <span className="text-sm text-muted-foreground">{hospital.phone}</span>
                          </div>
                       </div>
                       <div className="flex gap-2 flex-shrink-0">
                          <Button variant="outline" size="sm">
                             <Navigation className="mr-1 h-4 w-4" /> Directions
                          </Button>
                          <a href={`tel:${hospital.phone}`}>
                             <Button variant="outline" size="sm">
                                <Phone className="mr-1 h-4 w-4" /> Call
                             </Button>
                          </a>
                       </div>
                    </Card>
                 ))}
              </div>
           ) : (
              !error && <p className="text-muted-foreground text-center py-4">No hospitals found.</p>
           )}
         </CardContent>
       </Card>
    </div>
  );
}

const INITIAL_MESSAGE: Message = {
  role: 'bot',
  text: "Welcome to Navarah! I'm your AI health assistant. I can help you with:\n\n• Pregnancy and maternal health\n• Infant care and development\n• Finding nearby hospitals\n• General health questions\n\nYou can type your questions or use voice input. How can I assist you today?",
  timestamp: new Date(),
  sentiment: 'positive'
};

export function FloatingChatbot() {
  const [state, setState] = useState<ChatState>({
    messages: [INITIAL_MESSAGE],
    isTyping: false,
    isSpeaking: false,
    isListening: false
  });
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthesisRef.current = window.speechSynthesis;
    }
  }, []);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  // Speech synthesis with error handling
  const speak = (text: string) => {
    if (!synthesisRef.current) return;
    
    // Cancel any ongoing speech
    synthesisRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1;
    utterance.pitch = 1;
    
    utterance.onstart = () => setState(s => ({ ...s, isSpeaking: true }));
    utterance.onend = () => setState(s => ({ ...s, isSpeaking: false }));
    utterance.onerror = () => setState(s => ({ ...s, isSpeaking: false }));
    
    synthesisRef.current.speak(utterance);
  };

  // Initialize speech recognition
  const initSpeechRecognition = () => {
    if (typeof window !== 'undefined' && !recognitionRef.current) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onstart = () => setState(s => ({ ...s, isListening: true }));
        recognition.onend = () => setState(s => ({ ...s, isListening: false }));
        recognition.onerror = () => setState(s => ({ ...s, isListening: false }));
        
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          handleSend(transcript);
        };
        
        recognitionRef.current = recognition;
      }
    }
  };

  // Toggle voice input
  const handleVoice = () => {
    if (!recognitionRef.current) {
      initSpeechRecognition();
    }
    
    if (recognitionRef.current) {
      if (!state.isListening) {
        recognitionRef.current.start();
      } else {
        recognitionRef.current.stop();
      }
    }
  };

  // Stop speaking
  const handleStopSpeaking = () => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
      setState(s => ({ ...s, isSpeaking: false }));
    }
  };

  // Send message and get response
  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: Message = {
      role: 'user',
      text: text.trim(),
      timestamp: new Date(),
      sentiment: analyzeSentiment(text)
    };

    setState(s => ({
      ...s,
      messages: [...s.messages, userMessage],
      isTyping: true
    }));

    setInput('');

    try {
      // Get bot response
      const response = await generateResponse(text);
      const botMessage: Message = {
        role: 'bot',
        text: response,
        timestamp: new Date(),
        sentiment: 'neutral'
      };

      setState(s => ({
        ...s,
        messages: [...s.messages, botMessage],
        isTyping: false
      }));

      // Speak the response
      speak(response);
    } catch (error) {
      console.error('Error generating response:', error);
      setState(s => ({ ...s, isTyping: false }));
    }
  };

  return (
    <>
      <button
        className="fixed bottom-6 right-6 z-50 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg p-4 flex items-center gap-2 transition-all duration-200 hover:scale-105"
        onClick={() => setOpen(true)}
        aria-label="Open Chatbot"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="hidden md:inline">Chat with Navarah</span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md w-full p-0 overflow-hidden">
          <DialogHeader className="bg-primary text-primary-foreground p-4 flex flex-row items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Navarah Health Assistant
            </DialogTitle>
            {state.isSpeaking && (
              <button
                onClick={handleStopSpeaking}
                className="p-1 hover:bg-primary-foreground/10 rounded-full transition-colors"
                title="Stop Speaking"
              >
                <StopCircle className="w-5 h-5" />
              </button>
            )}
          </DialogHeader>

          <div className="flex flex-col h-[500px]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {state.messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg p-3",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                    {msg.role === "bot" && (
                      <button
                        onClick={() => speak(msg.text)}
                        className="mt-2 p-1 hover:bg-background/10 rounded-full transition-colors"
                        title="Play Message"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {state.isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t">
              <div className="flex gap-2 items-center">
                <button
                  onClick={handleVoice}
                  className={cn(
                    "p-2 rounded-full transition-colors",
                    state.isListening
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  )}
                  title={state.isListening ? "Stop Listening" : "Start Voice Input"}
                >
                  <Mic className="w-5 h-5" />
                </button>

                <input
                  className="flex-1 bg-muted p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={state.isListening ? "Listening..." : "Type your message..."}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  disabled={state.isListening}
                />

                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() && !state.isListening}
                  className="p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
