"use client";

import { SidebarTrigger } from '@/components/ui/sidebar';
// import Link from 'next/link'; // Remove direct Link import
import { LinkComponent } from '@/components/app/link-component'; // Import the new LinkComponent
import { useState } from 'react';
import { MessageCircle, Mic } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
       <SidebarTrigger className="sm:hidden" /> {/* Only show trigger on small screens */}
       {/* Use LinkComponent without asChild for simple logo link */}
       <LinkComponent href="/dashboard" className="hidden sm:flex items-center gap-2 text-primary font-semibold text-lg">
          {/* Removed NavarahLogo, using text */}
          Navarah
       </LinkComponent>
       {/* Add other header elements like User menu, notifications etc. here */}
       <div className="ml-auto">
          {/* Placeholder for User Menu/Notifications */}
       </div>
    </header>
  );
}

export function FloatingChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: string, text: string}[]>([]);
  const [listening, setListening] = useState(false);

  // Voice recognition setup
  let recognition: any;
  if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
    recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.onresult = (event: any) => {
      setInput(event.results[0][0].transcript);
      setListening(false);
    };
    recognition.onend = () => setListening(false);
  }

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', text: input }]);
    setInput('');
    // TODO: Integrate with AI backend for response
    setTimeout(() => {
      setMessages(msgs => [...msgs, { role: 'bot', text: 'This is a sample AI response.' }]);
    }, 1000);
  };

  const handleVoice = () => {
    if (recognition && !listening) {
      setListening(true);
      recognition.start();
    } else if (recognition && listening) {
      recognition.stop();
      setListening(false);
    }
  };

  return (
    <>
      <button
        className="fixed bottom-6 right-6 z-50 bg-primary text-primary-foreground rounded-full shadow-lg p-4 flex items-center gap-2 hover:bg-accent transition-colors"
        onClick={() => setOpen(true)}
        aria-label="Open Chatbot"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="hidden md:inline">Chatbot</span>
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md w-full p-0 overflow-hidden">
          <DialogHeader className="bg-primary text-primary-foreground p-4">
            <DialogTitle>Navarah Health Chatbot</DialogTitle>
          </DialogHeader>
          <div className="p-4 h-96 flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-2 mb-2">
              {messages.length === 0 && (
                <div className="text-muted-foreground text-center mt-8">How can I help you today?</div>
              )}
              {messages.map((msg, idx) => (
                <div key={idx} className={`text-sm p-2 rounded-lg ${msg.role === 'user' ? 'bg-accent text-right ml-auto' : 'bg-muted text-left mr-auto'}`}>{msg.text}</div>
              ))}
            </div>
            <div className="flex gap-2 items-center">
              <button onClick={handleVoice} className={`p-2 rounded-full ${listening ? 'bg-accent' : 'bg-muted'} transition-colors`} title="Voice Input">
                <Mic className="w-5 h-5" />
              </button>
              <input
                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring"
                placeholder={listening ? 'Listening...' : 'Type your message...'}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
                disabled={listening}
              />
              <button onClick={handleSend} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-accent transition-colors">Send</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
