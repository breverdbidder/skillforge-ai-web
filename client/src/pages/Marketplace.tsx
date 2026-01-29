import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Download, Star, Plus, Eye, Code } from "lucide-react";
import { toast } from "sonner";

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSkill, setSelectedSkill] = useState<number | null>(null);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);

  const { data: allSkills, isLoading } = trpc.marketplace.all.useQuery();
  const { data: statistics } = trpc.marketplace.statistics.useQuery();
  const { data: selectedSkillData } = trpc.marketplace.byId.useQuery(
    { id: selectedSkill! },
    { enabled: !!selectedSkill }
  );
  const { data: reviews } = trpc.marketplace.reviews.useQuery(
    { skillId: selectedSkill! },
    { enabled: !!selectedSkill }
  );

  const installMutation = trpc.marketplace.install.useMutation({
    onSuccess: () => {
      toast.success("Skill installed successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to install skill: ${error.message}`);
    },
  });

  const publishMutation = trpc.marketplace.publish.useMutation({
    onSuccess: () => {
      toast.success("Skill published to marketplace!");
      setPublishDialogOpen(false);
    },
    onError: (error) => {
      toast.error(`Failed to publish skill: ${error.message}`);
    },
  });

  const reviewMutation = trpc.marketplace.createReview.useMutation({
    onSuccess: () => {
      toast.success("Review submitted!");
    },
  });

  const filteredSkills = allSkills?.filter((skill) => {
    const matchesSearch =
      !searchQuery ||
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || skill.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", "Development", "Content", "Security", "Finance", "Productivity"];

  const handleInstall = (skillId: number, marketplaceSkillId: number) => {
    installMutation.mutate({ skillId, marketplaceSkillId });
  };

  const handlePublish = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    publishMutation.mutate({
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      tags: formData.get("tags") as string,
      code: formData.get("code") as string,
      parameters: formData.get("parameters") as string,
      examples: formData.get("examples") as string,
      readme: formData.get("readme") as string,
      visibility: "public",
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Skill Marketplace</h1>
              <p className="text-muted-foreground">
                Discover, share, and install community-created skills
              </p>
            </div>
            <Dialog open={publishDialogOpen} onOpenChange={setPublishDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Publish Skill
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Publish a New Skill</DialogTitle>
                  <DialogDescription>
                    Share your skill with the community
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handlePublish} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Skill Name</Label>
                    <Input id="name" name="name" required />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" rows={3} />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select name="category" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.filter((c) => c !== "all").map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input id="tags" name="tags" placeholder="javascript, automation, api" />
                  </div>
                  <div>
                    <Label htmlFor="code">Code Implementation</Label>
                    <Textarea id="code" name="code" rows={6} className="font-mono text-sm" />
                  </div>
                  <div>
                    <Label htmlFor="parameters">Parameters (JSON Schema)</Label>
                    <Textarea id="parameters" name="parameters" rows={4} className="font-mono text-sm" />
                  </div>
                  <div>
                    <Label htmlFor="examples">Usage Examples</Label>
                    <Textarea id="examples" name="examples" rows={4} />
                  </div>
                  <div>
                    <Label htmlFor="readme">README (Markdown)</Label>
                    <Textarea id="readme" name="readme" rows={6} />
                  </div>
                  <Button type="submit" className="w-full" disabled={publishMutation.isPending}>
                    {publishMutation.isPending ? "Publishing..." : "Publish to Marketplace"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Statistics */}
          {statistics && (
            <div className="grid grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statistics.totalSkills}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Downloads
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statistics.totalDownloads}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Reviews
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statistics.totalReviews}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Average Rating
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold flex items-center">
                    {statistics.averageRating.toFixed(1)}
                    <Star className="w-5 h-5 ml-1 fill-yellow-400 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Search and Filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat === "all" ? "All Categories" : cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Skills Grid */}
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading skills...</div>
        ) : filteredSkills && filteredSkills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkills.map((skill) => (
              <Card key={skill.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{skill.name}</CardTitle>
                      <CardDescription className="mt-1">
                        by {skill.authorName || "Anonymous"}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">{skill.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {skill.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      {skill.downloads}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {(skill.rating / 100).toFixed(1)} ({skill.reviewCount})
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setSelectedSkill(skill.id)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => handleInstall(skill.id, skill.id)}
                    disabled={installMutation.isPending}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Install
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No skills found matching your criteria
          </div>
        )}

        {/* Skill Detail Dialog */}
        <Dialog open={!!selectedSkill} onOpenChange={() => setSelectedSkill(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            {selectedSkillData && (
              <>
                <DialogHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <DialogTitle className="text-2xl">{selectedSkillData.name}</DialogTitle>
                      <DialogDescription className="mt-2">
                        by {selectedSkillData.authorName || "Anonymous"} • v{selectedSkillData.version}
                      </DialogDescription>
                    </div>
                    <Badge>{selectedSkillData.category}</Badge>
                  </div>
                </DialogHeader>

                <Tabs defaultValue="overview" className="mt-4">
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="code">Code</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews ({reviews?.length || 0})</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Description</h3>
                      <p className="text-muted-foreground">{selectedSkillData.description}</p>
                    </div>
                    {selectedSkillData.readme && (
                      <div>
                        <h3 className="font-semibold mb-2">Documentation</h3>
                        <div className="bg-muted p-4 rounded-lg">
                          <pre className="whitespace-pre-wrap text-sm">{selectedSkillData.readme}</pre>
                        </div>
                      </div>
                    )}
                    {selectedSkillData.examples && (
                      <div>
                        <h3 className="font-semibold mb-2">Examples</h3>
                        <div className="bg-muted p-4 rounded-lg">
                          <pre className="whitespace-pre-wrap text-sm">{selectedSkillData.examples}</pre>
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleInstall(selectedSkillData.id, selectedSkillData.id)}
                        disabled={installMutation.isPending}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Install Skill
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="code">
                    {selectedSkillData.code ? (
                      <div className="bg-muted p-4 rounded-lg">
                        <pre className="whitespace-pre-wrap text-sm font-mono">{selectedSkillData.code}</pre>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No code available</p>
                    )}
                  </TabsContent>

                  <TabsContent value="reviews" className="space-y-4">
                    {reviews && reviews.length > 0 ? (
                      reviews.map((review) => (
                        <Card key={review.id}>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-sm">{review.userName || "Anonymous"}</CardTitle>
                              <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-muted-foreground"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </CardHeader>
                          {review.comment && (
                            <CardContent>
                              <p className="text-sm text-muted-foreground">{review.comment}</p>
                            </CardContent>
                          )}
                        </Card>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No reviews yet</p>
                    )}
                  </TabsContent>
                </Tabs>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
