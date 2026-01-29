import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Filter, Zap, Play } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SkillsLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: skills, isLoading } = trpc.skills.list.useQuery();
  const { data: stats } = trpc.skills.statistics.useQuery();

  const filteredSkills = skills?.filter((skill) => {
    const matchesSearch =
      searchQuery === "" ||
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || skill.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = stats?.byCategory
    ? Object.keys(stats.byCategory)
    : [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-12 w-full" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Skills Library</h1>
        <p className="text-muted-foreground mt-2">
          Browse and manage {stats?.total || 0} ClawdBot skills
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search skills by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category} ({stats?.byCategory[category]})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats Bar */}
      <div className="flex gap-4 flex-wrap">
        <Badge variant="secondary" className="px-4 py-2">
          {filteredSkills?.length || 0} skills found
        </Badge>
        <Badge variant="outline" className="px-4 py-2">
          {stats?.enabled || 0} enabled
        </Badge>
      </div>

      {/* Skills Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredSkills && filteredSkills.length > 0 ? (
          filteredSkills.map((skill) => (
            <Card key={skill.id} className="skill-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{skill.name}</CardTitle>
                      <Badge variant="outline" className="mt-1">
                        {skill.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="line-clamp-3">
                  {skill.description || "No description available"}
                </CardDescription>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Used {skill.usageCount} times</span>
                  <Badge
                    variant={skill.enabled ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {skill.enabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>

                <Button className="w-full" size="sm">
                  <Play className="h-4 w-4 mr-2" />
                  Execute Skill
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">
              No skills found matching your criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
