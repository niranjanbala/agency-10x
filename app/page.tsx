'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mic, MicOff, Send, Zap, Clock, X, Calendar, CheckCircle, AlertCircle, XCircle, Sparkles, Code, Rocket, Users } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ProjectAssessment {
  complexity: 'simple' | 'medium' | 'complex';
  timeline: string;
  canBuild: boolean;
  reasoning: string;
}

export default function Home() {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [projectAssessment, setProjectAssessment] = useState<ProjectAssessment | null>(null);
  const [showCalendly, setShowCalendly] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setCurrentMessage(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const generateAIResponse = async (userMessage: string, conversationHistory: Message[]) => {
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const context = conversationHistory.map(m => `${m.role}: ${m.content}`).join('\n');
    
    // Smart scoping questions based on conversation
    const scopingQuestions = [
      "What type of application are you looking to build? (Web app, mobile app, API, etc.)",
      "Do you need user authentication and user management?",
      "Will you need to integrate with any third-party APIs or services?",
      "Do you need AI/ML features in your application?",
      "How many users do you expect to use your app initially?",
      "Do you need a database to store user data?",
      "What's your target launch timeline?",
      "Do you have any specific design requirements or brand guidelines?"
    ];

    let response = "";
    let assessment: ProjectAssessment | null = null;

    if (conversationHistory.length === 0) {
      response = `Hi! I'm here to help scope your project. ${scopingQuestions[0]}`;
    } else if (conversationHistory.length < 4) {
      const nextQuestion = scopingQuestions[conversationHistory.length] || "Tell me more about any specific features you need.";
      response = `Great! ${nextQuestion}`;
    } else {
      // Generate project assessment
      const complexity = Math.random() > 0.7 ? 'complex' : Math.random() > 0.4 ? 'medium' : 'simple';
      
      assessment = {
        complexity,
        timeline: complexity === 'simple' ? '1 week' : complexity === 'medium' ? '2-4 weeks' : '2+ months',
        canBuild: complexity !== 'complex',
        reasoning: complexity === 'simple' 
          ? "This is a straightforward project that can be built quickly with modern tools."
          : complexity === 'medium'
          ? "This project has moderate complexity and will require careful planning and execution."
          : "This project is quite complex and would require extensive planning and development time."
      };

      if (assessment.canBuild) {
        response = `Based on our conversation, I can help you build this! Here's my assessment:

**Project Complexity:** ${assessment.complexity === 'simple' ? 'Simple ✅' : 'Medium ⏱️'}
**Timeline:** ${assessment.timeline}
**Assessment:** ${assessment.reasoning}

I'd love to discuss this further and get started on your project. Would you like to schedule a call?`;
      } else {
        response = `After reviewing your requirements, this project is quite complex and would require more extensive planning and resources than I can provide in my current timeframe. 

**Project Complexity:** Complex 🚫
**Timeline:** ${assessment.timeline}
**Assessment:** ${assessment.reasoning}

I'd recommend breaking this down into smaller phases or considering a larger development team for this scope.`;
      }
    }

    return { response, assessment };
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsProcessing(true);

    try {
      const { response, assessment } = await generateAIResponse(currentMessage, messages);
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      if (assessment) {
        setProjectAssessment(assessment);
        if (assessment.canBuild) {
          setShowCalendly(true);
        }
      }

      // Speak the response
      speakText(response);
    } catch (error) {
      console.error('Error generating response:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetChat = () => {
    setMessages([]);
    setProjectAssessment(null);
    setShowCalendly(false);
    setCurrentMessage('');
  };

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Founder, TechStart",
      content: "Devesh built our MVP in just 10 days. The AI-powered features work flawlessly and the code quality is exceptional.",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    },
    {
      name: "Marcus Rodriguez",
      role: "CTO, GrowthLabs",
      content: "The speed and quality of development was incredible. Devesh's expertise in AI integration saved us months of work.",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    },
    {
      name: "Emily Zhang",
      role: "Product Manager, InnovateCorp",
      content: "From idea to launch in 3 weeks. The automated workflows and AI features have transformed our business.",
      avatar: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Development
              </Badge>
            </div>
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 mb-8">
              Build{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                10x Faster
              </span>
              {' '}with Devesh Verma's Dev Agency
            </h1>
            
            <p className="max-w-3xl mx-auto text-xl sm:text-2xl text-gray-600 mb-12">
              AI-scoped. Expert-led. Get your MVP, app, or automation built faster than ever.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={() => setIsAssistantOpen(true)}
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Zap className="w-5 h-5 mr-2" />
                Describe Your Idea
              </Button>
              
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                Get scoped in 5 minutes
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">50+</h3>
              <p className="text-gray-600">Projects Delivered</p>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Clock className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">10x</h3>
              <p className="text-gray-600">Faster Development</p>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">100%</h3>
              <p className="text-gray-600">Client Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                About Devesh Verma
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Devesh Verma is an ex-Creattr builder and prompt engineering expert who helps founders launch faster using AI-powered dev workflows.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                With expertise in modern web technologies, AI integration, and rapid prototyping, Devesh specializes in turning complex ideas into production-ready applications in record time.
              </p>
              
              <div className="flex flex-wrap gap-3 mb-8">
                {['React/Next.js', 'AI Integration', 'Prompt Engineering', 'Rapid Prototyping', 'Full-Stack Development'].map((skill) => (
                  <Badge key={skill} variant="secondary" className="px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  <Avatar className="w-72 h-72">
                    <AvatarImage src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop" />
                    <AvatarFallback className="text-6xl font-bold">DV</AvatarFallback>
                  </Avatar>
                </div>
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                  <Code className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What Clients Say
            </h2>
            <p className="text-xl text-gray-600">
              Trusted by founders and teams worldwide
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <Avatar className="w-12 h-12 mr-4">
                      <AvatarImage src={testimonial.avatar} />
                      <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Build Your Next Big Idea?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Let's turn your vision into reality with AI-powered development
          </p>
          <Button 
            onClick={() => setIsAssistantOpen(true)}
            size="lg" 
            variant="secondary"
            className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Zap className="w-5 h-5 mr-2" />
            Describe Your Idea
          </Button>
        </div>
      </section>

      {/* AI Assistant Dialog */}
      <Dialog open={isAssistantOpen} onOpenChange={setIsAssistantOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold flex items-center">
                <Sparkles className="w-6 h-6 mr-2 text-blue-600" />
                AI Project Scoping Assistant
              </DialogTitle>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={resetChat}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </DialogHeader>
          
          <div className="flex flex-col h-[70vh]">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Let's scope your project!
                  </h3>
                  <p className="text-gray-600">
                    Tell me about your idea and I'll help determine if we can build it quickly.
                  </p>
                </div>
              )}
              
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user' 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl px-4 py-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Project Assessment */}
            {projectAssessment && (
              <div className="p-6 bg-gray-50 border-t">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      {projectAssessment.complexity === 'simple' && <CheckCircle className="w-5 h-5 mr-2 text-green-600" />}
                      {projectAssessment.complexity === 'medium' && <AlertCircle className="w-5 h-5 mr-2 text-yellow-600" />}
                      {projectAssessment.complexity === 'complex' && <XCircle className="w-5 h-5 mr-2 text-red-600" />}
                      Project Assessment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="font-semibold text-gray-700">Complexity</p>
                        <Badge variant={projectAssessment.complexity === 'simple' ? 'default' : projectAssessment.complexity === 'medium' ? 'secondary' : 'destructive'}>
                          {projectAssessment.complexity}
                        </Badge>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-700">Timeline</p>
                        <p className="text-gray-600">{projectAssessment.timeline}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-700">Status</p>
                        <p className={`font-medium ${projectAssessment.canBuild ? 'text-green-600' : 'text-red-600'}`}>
                          {projectAssessment.canBuild ? 'Can build!' : 'Too complex'}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-600">{projectAssessment.reasoning}</p>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Calendly Embed */}
            {showCalendly && (
              <div className="p-6 bg-blue-50 border-t">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Let's schedule a call to get started!
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Book a 30-minute strategy call to discuss your project in detail.
                  </p>
                  <Button 
                    onClick={() => window.open('https://calendly.com/devesh-verma/30min', '_blank')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Call
                  </Button>
                </div>
              </div>
            )}
            
            {/* Input Area */}
            <div className="p-6 border-t bg-white">
              <div className="flex space-x-2">
                <Textarea
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  placeholder="Describe your project idea..."
                  className="flex-1 min-h-[50px] resize-none"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <div className="flex flex-col space-y-2">
                  <Button
                    onClick={isListening ? () => setIsListening(false) : startListening}
                    variant={isListening ? "destructive" : "outline"}
                    size="icon"
                    className="shrink-0"
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!currentMessage.trim() || isProcessing}
                    size="icon"
                    className="shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}