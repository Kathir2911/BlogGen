"use client";

import { useState, type ReactNode } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/code-block";
import { Send, Loader2 } from "lucide-react";
import { Separator } from './ui/separator';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface Param {
  name: string;
  description: string;
}

interface BodyField extends Param {
  type: 'string' | 'text';
  required?: boolean;
}

interface EndpointCardProps {
  method: HttpMethod;
  path: string;
  description: string;
  pathParams?: Param[];
  bodyFields?: BodyField[];
  requiresAuth?: boolean;
}

const methodColors: Record<HttpMethod, string> = {
  GET: "bg-sky-500 hover:bg-sky-600",
  POST: "bg-green-500 hover:bg-green-600",
  PUT: "bg-amber-500 hover:bg-amber-600",
  DELETE: "bg-red-500 hover:bg-red-600",
};

export function EndpointCard({ method, path, description, pathParams = [], bodyFields = [], requiresAuth = false }: EndpointCardProps) {
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [bodyValues, setBodyValues] = useState<Record<string, string>>({});
  const [apiKey, setApiKey] = useState<string>('my-secret-api-key');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleParamChange = (name: string, value: string) => {
    setParamValues(prev => ({ ...prev, [name]: value }));
  };

  const handleBodyChange = (name: string, value: string) => {
    setBodyValues(prev => ({ ...prev, [name]: value }));
  };

  const executeRequest = async () => {
    setLoading(true);
    setResponse(null);

    let finalPath = path;
    for (const param of pathParams) {
      if (!paramValues[param.name]) {
        toast({
          variant: "destructive",
          title: "Missing Parameter",
          description: `Path parameter "${param.name}" is required.`,
        });
        setLoading(false);
        return;
      }
      finalPath = finalPath.replace(`[${param.name}]`, paramValues[param.name]);
    }
    
    const url = `/api${finalPath}`;
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (requiresAuth) {
      if (!apiKey) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "API Key is required for this endpoint.",
        });
        setLoading(false);
        return;
      }
      (options.headers as Headers).set('Authorization', `Bearer ${apiKey}`);
    }

    if (method === 'POST' || method === 'PUT') {
      options.body = JSON.stringify(bodyValues);
    }

    try {
      const res = await fetch(url, options);
      const contentType = res.headers.get("content-type");
      let responseData;
      
      if (contentType && contentType.indexOf("application/json") !== -1) {
        responseData = await res.json();
      } else if (res.status === 204) {
         responseData = { status: 204, message: "No Content" };
      } else {
        responseData = { status: res.status, statusText: res.statusText, message: "Response is not JSON" };
      }
      
      setResponse(JSON.stringify(responseData, null, 2));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      setResponse(JSON.stringify({ error: errorMessage }, null, 2));
      toast({
        variant: "destructive",
        title: "Request Failed",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Badge className={`text-sm font-bold text-white ${methodColors[method]}`}>{method}</Badge>
          <CardTitle className="font-code text-lg md:text-xl tracking-wide">{path}</CardTitle>
        </div>
        <CardDescription className="pt-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {(pathParams.length > 0 || requiresAuth) && (
          <div>
            <h4 className="font-semibold mb-3">Parameters</h4>
            <div className="space-y-4">
              {requiresAuth && (
                <div className="space-y-2">
                  <Label htmlFor={`apiKey-${path}`}>API Key (Bearer Token)</Label>
                  <Input id={`apiKey-${path}`} value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="Enter your API key" />
                </div>
              )}
              {pathParams.map(param => (
                <div key={param.name} className="space-y-2">
                  <Label htmlFor={`${param.name}-${path}`}>{param.name}</Label>
                  <Input id={`${param.name}-${path}`} onChange={e => handleParamChange(param.name, e.target.value)} placeholder={param.description} />
                </div>
              ))}
            </div>
          </div>
        )}
        
        {bodyFields.length > 0 && (
          <div>
            <h4 className="font-semibold mb-3">Request Body</h4>
            <div className="space-y-4 p-4 border rounded-md bg-muted/50">
              {bodyFields.map(field => (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={`${field.name}-${path}`}>
                    {field.name} {field.required && <span className="text-destructive">*</span>}
                  </Label>
                  {field.type === 'text' ? (
                    <Textarea id={`${field.name}-${path}`} onChange={e => handleBodyChange(field.name, e.target.value)} placeholder={field.description} />
                  ) : (
                    <Input id={`${field.name}-${path}`} onChange={e => handleBodyChange(field.name, e.target.value)} placeholder={field.description} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start space-y-4 bg-muted/50 dark:bg-muted/20 p-6">
        <Button onClick={executeRequest} disabled={loading} className="w-full sm:w-auto">
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )}
          Execute
        </Button>
        {response && (
          <div className="w-full space-y-2">
            <h4 className="font-semibold">Response</h4>
            <CodeBlock code={response} />
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
