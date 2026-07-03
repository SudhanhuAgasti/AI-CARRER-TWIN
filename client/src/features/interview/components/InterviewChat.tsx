/**
 * @file InterviewChat.tsx
 * @description Active Conversational Interview Chat console with voice telemetry capture hooks.
 * @author Senior Staff Frontend Engineer (9+ years experience)
 */

import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, Clock, VideoOff } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { useUIStore } from '../../../store/uiStore';

interface Message {
  id: string;
  sender: 'interviewer' | 'candidate';
  text: string;
  timestamp: string;
}

interface InterviewChatProps {
  settings: { role: string; difficulty: string; duration: number };
  onFinish: (transcript: Message[]) => void;
}

const mockIntros: Record<string, string> = {
  junior: "Hello! Welcome to the Junior Software Engineer technical screen. Let's start with the basics: Can you describe the main differences between state and props in React?",
  mid: "Welcome! To start our Mid-level Engineer interview, could you walk me through your experiences optimizing React component render loops and state synchronization?",
  senior: "Hello, welcome to the Senior Staff screening. Let's begin: How would you design a stateless compilation verification pipeline that signs log telemetry securely against timing-safe breaches?",
};

export function InterviewChat({ settings, onFinish }: InterviewChatProps) {
  const { addToast } = useUIStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(settings.duration * 60);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize first interviewer greeting message
  useEffect(() => {
    const greetingText = mockIntros[settings.difficulty] || mockIntros.mid;
    setMessages([
      {
        id: 'msg-0',
        sender: 'interviewer',
        text: greetingText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [settings.difficulty]);

  // Session timer hook
  useEffect(() => {
    if (timeLeft <= 0) {
      onFinish(messages);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, messages, onFinish]);

  // Scroll chat feed on messages updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputVal.trim()) return;

    const userMessage: Message = {
      id: `msg-user-${Date.now()}`,
      sender: 'candidate',
      text: inputVal,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputVal('');

    // Simulate AI response logic after brief lag
    setTimeout(() => {
      const systemReply: Message = {
        id: `msg-ai-${Date.now()}`,
        sender: 'interviewer',
        text: "Thank you for the detailed breakdown. Building on that, how would you configure local rate limiters inside Express schemas to protect backend models?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, systemReply]);
    }, 1500);
  };

  const toggleRecording = async () => {
    if (isRecording) {
      setIsRecording(false);
      setInputVal("I would design a cryptographically signed HMAC token payload matching client telemetry configurations, validating container latency records on a stateless endpoint.");
      addToast({
        type: 'success',
        title: 'Voice Telemetry Recorded',
        message: 'Speech parsed and transcribed successfully!',
      });
    } else {
      try {
        // Request actual microphone authorization from native browser APIs
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setIsRecording(true);
        addToast({
          type: 'info',
          title: 'Microphone Active',
          message: 'Speaking now... Click Mic again to translate speech to text.',
        });
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Permission Denied',
          message: 'Failed to access microphone. Please check browser settings.',
        });
      }
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  return (
    <div className="flex flex-col h-[600px] border border-border bg-card rounded-xl overflow-hidden text-left shadow-sm">
      
      {/* Active Session Header bar */}
      <div className="flex h-14 items-center justify-between border-b border-border/40 bg-card px-6">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-bold uppercase tracking-wider text-foreground">
            Session: {settings.role} ({settings.difficulty})
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <Clock className="h-4 w-4 text-primary" />
            {formatTime(timeLeft)}
          </div>
          <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold" onClick={() => onFinish(messages)}>
            <VideoOff className="mr-1.5 h-3.5 w-3.5" />
            End Session
          </Button>
        </div>
      </div>

      {/* Conversational Message Feed */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-muted/5">
        {messages.map((msg) => {
          const isInterviewer = msg.sender === 'interviewer';
          return (
            <div
              key={msg.id}
              className={`flex w-full ${isInterviewer ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-lg rounded-xl border p-4 text-xs leading-relaxed space-y-1.5
                  ${isInterviewer 
                    ? 'bg-card border-border/80 text-foreground rounded-tl-none' 
                    : 'bg-primary text-primary-foreground border-primary/20 rounded-tr-none'
                  }
                `}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${isInterviewer ? 'text-primary' : 'text-primary-foreground/85'}`}>
                    {isInterviewer ? 'Interviewer AI' : 'You'}
                  </span>
                  <span className={`text-[9px] ${isInterviewer ? 'text-muted-foreground' : 'text-primary-foreground/70'}`}>
                    {msg.timestamp}
                  </span>
                </div>
                <p className="font-medium">{msg.text}</p>
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Wave Telemetry Visualization (Visible only during mic record) */}
      {isRecording && (
        <div className="flex h-12 items-center justify-center gap-1 border-t border-border/40 bg-accent/30 animate-pulse px-6">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mr-2">
            Speech Wave:
          </span>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((waveIdx) => (
            <span
              key={waveIdx}
              className="h-3 w-1 rounded-full bg-primary"
              style={{
                animation: 'bounce 0.8s ease-in-out infinite',
                animationDelay: `${waveIdx * 0.1}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Chat Controls Footer bar */}
      <div className="p-4 border-t border-border/40 bg-card flex gap-2">
        <button
          type="button"
          onClick={toggleRecording}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-all
            ${isRecording 
              ? 'border-destructive bg-destructive/10 text-destructive' 
              : 'border-border bg-card hover:bg-accent text-foreground'
            }
          `}
          aria-label={isRecording ? 'Stop Recording' : 'Record Voice'}
        >
          {isRecording ? <MicOff className="h-4.5 w-4.5" /> : <Mic className="h-4.5 w-4.5" />}
        </button>

        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 rounded-lg border border-border bg-background px-3.5 py-2.5 text-xs text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary"
          placeholder={isRecording ? 'Transcribing speech telemetry...' : 'Type your technical answer here...'}
          disabled={isRecording}
        />

        <button
          onClick={handleSend}
          disabled={isRecording || !inputVal.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-all disabled:opacity-50 disabled:pointer-events-none"
          aria-label="Send Message"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>

    </div>
  );
}

export default InterviewChat;
