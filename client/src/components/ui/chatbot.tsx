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

const getAIResponse = (userMessage: string): string => {
  const lowerInput = userMessage.toLowerCase();
  
  if (lowerInput.includes("price") || lowerInput.includes("cost") || lowerInput.includes("how much")) {
    return `Great question! Our pricing is designed to fit different business needs:

**Starter Package**: $1,499 - Perfect for small businesses (5-page responsive website, contact form, basic SEO, 1 month support)

**Business Package**: $3,499 - For growing businesses (up to 10 pages, CMS integration, blog section, advanced SEO, 3 months support)

**E-Commerce/Custom**: From $5,999 - Full e-commerce or custom web applications

Would you like me to help you choose the right package, or would you prefer to book a free consultation?`;
  }
  
  if (lowerInput.includes("service") || lowerInput.includes("what do you") || lowerInput.includes("offer")) {
    return `Kashtex provides full-stack web development services:

🌐 **Frontend Development** - Modern, responsive designs using React, TypeScript, and Tailwind CSS
⚙️ **Backend Development** - Secure APIs, databases, authentication systems
🛒 **E-Commerce Solutions** - Complete online stores with payment integration
📱 **Mobile-Responsive Design** - Works perfectly on all devices
🔧 **Ongoing Maintenance** - Updates, backups, and security monitoring

What type of project are you interested in?`;
  }
  
  if (lowerInput.includes("appointment") || lowerInput.includes("book") || lowerInput.includes("call") || lowerInput.includes("schedule") || lowerInput.includes("consultation")) {
    return `I'd be happy to help you schedule a consultation! You can book a free call directly on our website:

1. Go to the **Contact** page
2. Click the **Book Appointment** tab
3. Choose a date and time that works for you

Consultations are typically 30 minutes and we'll discuss your project requirements, timeline, and provide a custom quote.

Alternatively, you can email us at kashtex1@gmail.com`;
  }
  
  if (lowerInput.includes("portfolio") || lowerInput.includes("work") || lowerInput.includes("example") || lowerInput.includes("projects")) {
    return `Check out our Portfolio page to see examples of our work! We've built:

✅ **LuxeCommerce Platform** - Full-stack e-commerce with inventory management
✅ **FinTech Dashboard** - Secure client portal for financial services
✅ **Corporate Websites** - Professional sites for various industries

Each project showcases our attention to detail and technical expertise. Want me to tell you more about any specific project type?`;
  }
  
  if (lowerInput.includes("contact") || lowerInput.includes("reach") || lowerInput.includes("email") || lowerInput.includes("phone") || lowerInput.includes("human") || lowerInput.includes("talk to")) {
    return `You can reach us through several channels:

📧 **Email**: kashtex1@gmail.com
📝 **Contact Form**: Use the form on our Contact page
📅 **Book a Call**: Schedule a free consultation

Our team typically responds within 24 hours on business days. Is there anything specific I can help you with in the meantime?`;
  }
  
  if (lowerInput.includes("hello") || lowerInput.includes("hi") || lowerInput.includes("hey") || lowerInput.includes("good morning") || lowerInput.includes("good afternoon")) {
    return `Hello! Welcome to Kashtex! 👋

I'm here to help you learn about our web development services. I can tell you about:
• Our pricing packages
• The services we offer
• How to book a consultation
• Our portfolio of work

What would you like to know more about?`;
  }
  
  if (lowerInput.includes("how long") || lowerInput.includes("timeline") || lowerInput.includes("time") || lowerInput.includes("deadline")) {
    return `Project timelines depend on complexity:

⏱️ **Starter websites**: 1-2 weeks
⏱️ **Business websites**: 2-4 weeks
⏱️ **E-commerce/Custom apps**: 4-8 weeks

We always discuss realistic timelines during our initial consultation and work with you to meet your launch date. Need something urgent? Let us know!`;
  }
  
  if (lowerInput.includes("technology") || lowerInput.includes("tech stack") || lowerInput.includes("react") || lowerInput.includes("programming")) {
    return `We use modern, industry-standard technologies:

**Frontend**: React, TypeScript, Tailwind CSS, Next.js
**Backend**: Node.js, Express, PostgreSQL
**Tools**: Git, Vite, Drizzle ORM
**Hosting**: Scalable cloud solutions

This stack ensures fast, secure, and maintainable websites. Have questions about specific technology requirements?`;
  }
  
  if (lowerInput.includes("thank")) {
    return `You're welcome! 😊 

If you have any more questions, feel free to ask. You can also:
• Book a free consultation on our Contact page
• Email us at kashtex1@gmail.com

We look forward to helping you with your project!`;
  }

  return `Thanks for your message! I'd love to help you further.

Here's what I can assist with:
• **Pricing** - Ask about our packages
• **Services** - Learn what we offer
• **Book a Call** - Schedule a consultation
• **Portfolio** - See our work

Or if you'd prefer to speak with a human, you can email us at kashtex1@gmail.com or use the contact form on our website. What would you like to know?`;
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
      content: "Hello! I'm the Kashtex AI assistant. 👋\n\nI can help you with:\n• Service information & pricing\n• Booking a consultation\n• Learning about our portfolio\n\nHow can I help you today?",
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
        credentials: "include",
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
      const aiResponseContent = getAIResponse(userMsg.content);

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
    }, 1200);
  };

  return (
    <>
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

      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-50 w-[350px] sm:w-[400px] h-[520px] flex flex-col shadow-2xl border-border/50 animate-in slide-in-from-bottom-10 fade-in duration-300">
          <CardHeader className="p-4 border-b bg-primary text-primary-foreground rounded-t-lg flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <div>
                <CardTitle className="text-sm font-medium">Kashtex Support AI</CardTitle>
                <p className="text-xs text-primary-foreground/70">Online - Ask me anything!</p>
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
                      className={`max-w-[85%] p-3 text-sm rounded-2xl whitespace-pre-wrap ${
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
