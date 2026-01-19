import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, X, Bot } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
};

const generateSessionId = () => {
  return `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId] = useState(() => {
    const stored = sessionStorage.getItem("kashtex_chat_session");
    if (stored) return stored;
    const newId = generateSessionId();
    sessionStorage.setItem("kashtex_chat_session", newId);
    return newId;
  });
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "ai",
      content: "Hello! I'm the Kashtex AI assistant. I can help you with service information or take your contact details for a quote. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const saveConversation = async (updatedMessages: Message[]) => {
    try {
      await fetch(`/api/chat-logs/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({
            role: m.role,
            content: m.content,
            timestamp: m.timestamp.toISOString(),
          })),
        }),
      });
    } catch (error) {
      console.error("Failed to save conversation:", error);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date()
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    setTimeout(async () => {
      let aiResponseContent = "I've noted that down. A human representative will follow up with you shortly via email.";
      
      const lowerInput = userMsg.content.toLowerCase();
      if (lowerInput.includes("price") || lowerInput.includes("cost")) {
        aiResponseContent = "Our pricing starts with flexible packages tailored to your needs. You can check our Pricing page or I can have someone send you a custom quote.";
      } else if (lowerInput.includes("service") || lowerInput.includes("build")) {
        aiResponseContent = "We specialize in full-stack development, including custom frontends, secure backends, and mobile-responsive designs. Would you like to discuss a specific project?";
      } else if (lowerInput.includes("human") || lowerInput.includes("contact") || lowerInput.includes("talk")) {
        aiResponseContent = "I understand you'd like to speak with a human. I've escalated this to our team at kashtex1@gmail.com. You can also use the contact form on our website.";
      } else if (lowerInput.includes("appointment") || lowerInput.includes("book") || lowerInput.includes("call")) {
        aiResponseContent = "You can book a consultation call directly on our Contact page. Just click the 'Book Appointment' tab and choose a time that works for you!";
      } else if (lowerInput.includes("portfolio") || lowerInput.includes("work") || lowerInput.includes("example")) {
        aiResponseContent = "Check out our Portfolio page to see examples of our work, including e-commerce platforms, corporate websites, and creative projects.";
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: aiResponseContent,
        timestamp: new Date()
      };

      const finalMessages = [...newMessages, aiMsg];
      setMessages(finalMessages);
      setIsTyping(false);
      
      await saveConversation(finalMessages);
    }, 1500);
  };

  return (
    <>
      {/* Trigger Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <Button 
            size="icon" 
            className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105"
            onClick={() => setIsOpen(true)}
            data-testid="button-open-chat"
          >
            <MessageSquare className="h-6 w-6 text-primary-foreground" />
          </Button>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-50 w-[350px] sm:w-[400px] h-[500px] flex flex-col shadow-2xl border-border/50 animate-in slide-in-from-bottom-10 fade-in duration-300">
          <CardHeader className="p-4 border-b bg-primary text-primary-foreground rounded-t-lg flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <div>
                <CardTitle className="text-sm font-medium">Kashtex Support AI</CardTitle>
                <p className="text-xs text-primary-foreground/70">Online</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20" onClick={() => setIsOpen(false)} data-testid="button-close-chat">
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 text-sm rounded-2xl ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-none"
                          : "bg-muted text-foreground rounded-bl-none"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-muted p-3 rounded-2xl rounded-bl-none">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                        <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                        <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={scrollRef} />
              </div>
            </ScrollArea>
          </CardContent>

          <CardFooter className="p-3 border-t bg-background">
            <form 
              className="flex w-full gap-2" 
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
            >
              <Input 
                placeholder="Type your message..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 focus-visible:ring-1"
                data-testid="input-chat-message"
              />
              <Button type="submit" size="icon" disabled={!input.trim() || isTyping} data-testid="button-send-message">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
