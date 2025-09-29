"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, Volume2, Loader as Loader2, Waves } from 'lucide-react';

interface VoiceInputProps {
  onTranscriptReady: (transcript: string) => void;
  isActive?: boolean;
}

export function VoiceInput({ onTranscriptReady, isActive = true }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!isActive) {
      stopListening();
    }
  }, [isActive]);

  useEffect(() => {
    // Check if Web Speech API is available
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
        setTranscript('');
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          const confidence = event.results[i][0].confidence;

          if (event.results[i].isFinal) {
            finalTranscript += transcript;
            setConfidence(confidence || 0.9);
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setTranscript(finalTranscript);
          setIsProcessing(true);
          onTranscriptReady(finalTranscript.trim());
          
          // Auto-stop after getting final result
          setTimeout(() => {
            stopListening();
            setIsProcessing(false);
          }, 1000);
        } else {
          setTranscript(interimTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        let errorMessage = 'Speech recognition error';
        
        switch (event.error) {
          case 'no-speech':
            errorMessage = 'No speech detected. Please try again.';
            break;
          case 'audio-capture':
            errorMessage = 'No microphone found. Please check your audio settings.';
            break;
          case 'not-allowed':
            errorMessage = 'Microphone access denied. Please enable microphone permissions.';
            break;
          case 'network':
            errorMessage = 'Network error. Please check your internet connection.';
            break;
        }
        
        setError(errorMessage);
        setIsListening(false);
        setIsProcessing(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [onTranscriptReady]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      setError(null);
      recognitionRef.current.start();

      // Auto-stop after 10 seconds
      timeoutRef.current = setTimeout(() => {
        stopListening();
      }, 10000);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  if (!isActive) {
    return null;
  }

  // Check if Web Speech API is supported
  if (typeof window !== 'undefined' && !('webkitSpeechRecognition' in window)) {
    return (
      <Card className="p-4 bg-card border-border">
        <div className="text-center text-sm text-foreground">
          Voice input is not supported in this browser. Please try Chrome or Edge.
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-gradient-to-r from-card to-muted border-border">
      <div className="flex items-center gap-4">
        <Button
          onClick={isListening ? stopListening : startListening}
          disabled={isProcessing}
          variant={isListening ? "destructive" : "default"}
          className={isListening ? "animate-pulse" : ""}
        >
          {isProcessing ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : isListening ? (
            <MicOff className="w-4 h-4 mr-2" />
          ) : (
            <Mic className="w-4 h-4 mr-2" />
          )}
        </Button>

        <div className="flex-1">
          {isListening && (
            <div className="flex items-center gap-2">
              <Waves className="w-4 h-4 text-bg-muted wave-animation" />
              <span className="text-sm text-blue-300">Listening...</span>
            </div>
          )}
          
          {transcript && (
            <div className="flex items-start gap-2">
              <Volume2 className="w-4 h-4 text-green-600 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-white">"{transcript}"</div>
                {confidence > 0 && (
                  <Badge variant="outline" className="mt-1 text-xs">
                    {Math.round(confidence * 100)}% confidence
                  </Badge>
                )}
              </div>
            </div>
          )}
          
          {error && (
            <div className="text-sm text-red-400 flex items-center gap-2">
              <MicOff className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>
      </div>

      {!isListening && !transcript && !error && (
        <div className="mt-3 text-xs text-muted-foreground">
          Click "Start Voice Input" and ask questions like "Show me salinity near the equator"
        </div>
      )}
    </Card>
  );
}