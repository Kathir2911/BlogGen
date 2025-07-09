"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { CodeBlock } from "./code-block"
import { Badge } from "./ui/badge";

const postModel = `{
  "id": "string",
  "userId": "string",
  "title": "string",
  "content": "string",
  "createdAt": "string (ISO 8601 format)"
}`;

const commentModel = `{
  "id": "string",
  "postId": "string",
  "userId": "string",
  "content": "string",
  "createdAt": "string (ISO 8601 format)"
}`;

export function Documentation() {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      <h2 className="text-3xl font-headline font-bold mb-4">API Documentation</h2>
      <p className="text-muted-foreground">
        This documentation provides all the information you need to interact with the Nextgen-Blog API. The descriptions are powered by an LLM to be clear and concise.
      </p>

      <Accordion type="single" collapsible className="w-full mt-8" defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-xl font-headline">Authentication</AccordionTrigger>
          <AccordionContent className="text-base">
            <p>
              The API uses Bearer Token authentication for protected endpoints (POST, PUT, DELETE). You must include an <code>Authorization</code> header with your API key.
            </p>
            <p className="mt-2">
              Example Header: <code>Authorization: Bearer my-secret-api-key</code>
            </p>
            <p className="mt-4">
              For this demo, the API key is pre-filled, but in a production environment, you would receive a unique key. Requests to protected endpoints without a valid key will result in a <Badge variant="destructive">401 Unauthorized</Badge> error.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger className="text-xl font-headline">Data Models</AccordionTrigger>
          <AccordionContent>
            <h3 className="text-lg font-semibold mt-2 mb-2">Post Model</h3>
            <CodeBlock code={postModel} />
            <h3 className="text-lg font-semibold mt-4 mb-2">Comment Model</h3>
            <CodeBlock code={commentModel} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger className="text-xl font-headline">Status Codes</AccordionTrigger>
          <AccordionContent className="text-base">
            <ul className="list-disc space-y-2 pl-5">
              <li><Badge className="bg-green-500 text-white">200 OK</Badge> - The request was successful.</li>
              <li><Badge className="bg-green-500 text-white">201 Created</Badge> - The resource was successfully created.</li>
              <li><Badge className="bg-sky-500 text-white">204 No Content</Badge> - The request was successful, but there is no content to return (e.g., after a DELETE operation).</li>
              <li><Badge className="bg-amber-500 text-white">400 Bad Request</Badge> - The server could not understand the request due to invalid syntax or missing parameters.</li>
              <li><Badge variant="destructive">401 Unauthorized</Badge> - Authentication failed or was not provided.</li>
              <li><Badge variant="destructive">404 Not Found</Badge> - The requested resource could not be found.</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
