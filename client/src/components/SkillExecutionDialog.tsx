import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Loader2, CheckCircle2, XCircle, Code, FileText } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface Skill {
  id: number;
  skillId: string;
  name: string;
  description: string | null;
  category: string;
  parameters: string | null;
  usageExample: string | null;
  tags: string | null;
  usageCount?: number;
}

interface SkillExecutionDialogProps {
  skill: Skill | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SkillExecutionDialog({ skill, open, onOpenChange }: SkillExecutionDialogProps) {
  const [parameters, setParameters] = useState<Record<string, string>>({});
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  // Simulated execution for now
  const handleExecuteSkill = async () => {
    setIsExecuting(true);
    setExecutionResult(null);
    
    // Simulate API call
    setTimeout(() => {
      setExecutionResult({
        success: true,
        message: "Skill executed successfully",
        data: parameters,
        timestamp: new Date().toISOString(),
      });
      setIsExecuting(false);
      toast.success("Skill executed successfully!");
    }, 2000);
  };

  if (!skill) return null;

  const parsedParameters = skill.parameters ? JSON.parse(skill.parameters) : {};
  const parsedTags = skill.tags ? JSON.parse(skill.tags) : [];

  const handleExecute = () => {
    handleExecuteSkill();
  };

  const handleParameterChange = (key: string, value: string) => {
    setParameters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Play className="h-5 w-5 text-primary" />
            </div>
            {skill.name}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2 mt-2">
            <Badge variant="outline">{skill.category}</Badge>
            {parsedTags.map((tag: string) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="execute" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="execute">Execute</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
          </TabsList>

          <TabsContent value="execute" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-3">Parameters</h3>
                {Object.keys(parsedParameters).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(parsedParameters).map(([key, type]) => (
                      <div key={key} className="space-y-2">
                        <Label htmlFor={key}>
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                          <span className="text-muted-foreground ml-2">({type as string})</span>
                        </Label>
                        {type === "array" || type === "object" ? (
                          <Textarea
                            id={key}
                            placeholder={`Enter ${key} (JSON format)`}
                            value={parameters[key] || ""}
                            onChange={(e) => handleParameterChange(key, e.target.value)}
                            rows={3}
                          />
                        ) : (
                          <Input
                            id={key}
                            type={type === "number" ? "number" : "text"}
                            placeholder={`Enter ${key}`}
                            value={parameters[key] || ""}
                            onChange={(e) => handleParameterChange(key, e.target.value)}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No parameters required for this skill
                  </p>
                )}
              </div>

              {executionResult && (
                <Card className={executionResult.success ? "border-green-500" : "border-red-500"}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      {executionResult.success ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold mb-2">
                          {executionResult.success ? "Execution Successful" : "Execution Failed"}
                        </h4>
                        <pre className="text-sm bg-muted p-3 rounded-lg overflow-x-auto">
                          {JSON.stringify(executionResult, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Description
              </h3>
              <p className="text-sm text-muted-foreground">
                {skill.description || "No description available"}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Code className="h-4 w-4" />
                Parameters Schema
              </h3>
              <pre className="text-sm bg-muted p-3 rounded-lg overflow-x-auto">
                {JSON.stringify(parsedParameters, null, 2)}
              </pre>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Metadata</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Skill ID:</span>
                  <p className="font-mono">{skill.skillId}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Category:</span>
                  <p>{skill.category}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Source:</span>
                  <p>ClawdBot</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Usage Count:</span>
                  <p>{skill.usageCount || 0} executions</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="examples" className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Usage Example</h3>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm">
                    {skill.usageExample || "No usage examples available"}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Sample Parameters</h3>
              <pre className="text-sm bg-muted p-3 rounded-lg overflow-x-auto">
                {JSON.stringify(
                  Object.keys(parsedParameters).reduce((acc, key) => {
                    acc[key] = `<${parsedParameters[key]}>`;
                    return acc;
                  }, {} as Record<string, string>),
                  null,
                  2
                )}
              </pre>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={handleExecute} disabled={isExecuting}>
            {isExecuting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Executing...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Execute Skill
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
