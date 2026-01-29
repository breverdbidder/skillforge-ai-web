import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Plus, Users, Crown, Shield, Eye, Trash2, UserPlus, Settings } from "lucide-react";

export default function Teams() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "member" | "viewer">("member");

  const utils = trpc.useUtils();

  // Fetch user's teams
  const { data: teams = [] } = trpc.teams.myTeams.useQuery();

  // Fetch selected team details
  const { data: teamDetails } = trpc.teams.getById.useQuery(
    { id: selectedTeam! },
    { enabled: selectedTeam !== null }
  );

  // Create team mutation
  const createTeam = trpc.teams.create.useMutation({
    onSuccess: () => {
      toast.success("Team created!");
      setIsCreateDialogOpen(false);
      setTeamName("");
      setTeamDescription("");
      utils.teams.myTeams.invalidate();
    },
    onError: (error) => {
      toast.error(`Failed to create team: ${error.message}`);
    },
  });

  // Delete team mutation
  const deleteTeam = trpc.teams.delete.useMutation({
    onSuccess: () => {
      toast.success("Team deleted!");
      setSelectedTeam(null);
      utils.teams.myTeams.invalidate();
    },
    onError: (error) => {
      toast.error(`Failed to delete team: ${error.message}`);
    },
  });

  // Add member mutation
  const addMember = trpc.teams.addMember.useMutation({
    onSuccess: () => {
      toast.success("Invitation sent!");
      setInviteEmail("");
      utils.teams.getById.invalidate();
    },
    onError: (error) => {
      toast.error(`Failed to invite member: ${error.message}`);
    },
  });

  // Remove member mutation
  const removeMember = trpc.teams.removeMember.useMutation({
    onSuccess: () => {
      toast.success("Member removed!");
      utils.teams.getById.invalidate();
    },
  });

  const handleCreateTeam = () => {
    if (!teamName.trim()) {
      toast.error("Team name is required");
      return;
    }

    createTeam.mutate({
      name: teamName,
      description: teamDescription,
    });
  };

  const handleDeleteTeam = (teamId: number) => {
    if (confirm("Are you sure you want to delete this team? This action cannot be undone.")) {
      deleteTeam.mutate({ id: teamId });
    }
  };

  const handleInviteMember = () => {
    if (!selectedTeam) return;
    if (!inviteEmail.trim()) {
      toast.error("Email is required");
      return;
    }

    addMember.mutate({
      teamId: selectedTeam,
      userEmail: inviteEmail,
      role: inviteRole,
    });
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Crown className="w-3 h-3" />;
      case "admin":
        return <Shield className="w-3 h-3" />;
      case "viewer":
        return <Eye className="w-3 h-3" />;
      default:
        return <Users className="w-3 h-3" />;
    }
  };

  const getRoleBadgeVariant = (role: string): "default" | "secondary" | "outline" => {
    switch (role) {
      case "owner":
        return "default";
      case "admin":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Team Management</h1>
          <p className="text-muted-foreground mt-2">Collaborate with your team on skills and executions</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Team
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Team</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label>Team Name</Label>
                <Input value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="Engineering Team" />
              </div>

              <div>
                <Label>Description (Optional)</Label>
                <Textarea
                  value={teamDescription}
                  onChange={(e) => setTeamDescription(e.target.value)}
                  placeholder="What is this team for?"
                  rows={3}
                />
              </div>

              <Button onClick={handleCreateTeam} disabled={createTeam.isPending} className="w-full">
                {createTeam.isPending ? "Creating..." : "Create Team"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Teams List */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Your Teams ({teams.length})
          </h2>

          <div className="space-y-2">
            {teams.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No teams yet</p>
                <p className="text-sm">Create one to get started</p>
              </div>
            ) : (
              teams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => setSelectedTeam(team.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedTeam === team.id
                      ? "bg-primary/10 border-primary"
                      : "hover:bg-accent border-transparent"
                  }`}
                >
                  <div className="font-medium">{team.name}</div>
                  {team.description && <div className="text-sm text-muted-foreground mt-1">{team.description}</div>}
                </button>
              ))
            )}
          </div>
        </Card>

        {/* Team Details */}
        <Card className="lg:col-span-2 p-6">
          {!selectedTeam ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <Settings className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Select a team to view details</p>
              </div>
            </div>
          ) : teamDetails ? (
            <div className="space-y-6">
              {/* Team Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{teamDetails.name}</h2>
                  {teamDetails.description && <p className="text-muted-foreground mt-1">{teamDetails.description}</p>}
                  <Badge variant={getRoleBadgeVariant(teamDetails.userRole)} className="mt-2">
                    {getRoleIcon(teamDetails.userRole)}
                    <span className="ml-1 capitalize">{teamDetails.userRole}</span>
                  </Badge>
                </div>
                {teamDetails.userRole === "owner" && (
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteTeam(teamDetails.id)}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Team
                  </Button>
                )}
              </div>

              {/* Invite Member */}
              {(teamDetails.userRole === "owner" || teamDetails.userRole === "admin") && (
                <Card className="p-4 bg-accent/50">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Invite Member
                  </h3>
                  <div className="flex gap-2">
                    <Input
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="user@example.com"
                      type="email"
                      className="flex-1"
                    />
                    <Select value={inviteRole} onValueChange={(v: any) => setInviteRole(v)}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={handleInviteMember} disabled={addMember.isPending}>
                      Invite
                    </Button>
                  </div>
                </Card>
              )}

              {/* Members List */}
              <div>
                <h3 className="font-semibold mb-3">Members ({teamDetails.members.length})</h3>
                <div className="space-y-2">
                  {teamDetails.members.map((member) => (
                    <Card key={member.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-medium">User #{member.userId}</div>
                            <div className="text-sm text-muted-foreground">
                              Joined {new Date(member.joinedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={getRoleBadgeVariant(member.role)}>
                            {getRoleIcon(member.role)}
                            <span className="ml-1 capitalize">{member.role}</span>
                          </Badge>
                          {(teamDetails.userRole === "owner" || teamDetails.userRole === "admin") &&
                            member.role !== "owner" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => removeMember.mutate({ teamId: teamDetails.id, userId: member.userId })}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Role Permissions */}
              <Card className="p-4 bg-muted/50">
                <h3 className="font-semibold mb-3">Role Permissions</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <Crown className="w-4 h-4 mt-0.5 text-primary" />
                    <div>
                      <span className="font-medium">Owner:</span> Full control, can delete team
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 mt-0.5" />
                    <div>
                      <span className="font-medium">Admin:</span> Manage members, edit team settings
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Users className="w-4 h-4 mt-0.5" />
                    <div>
                      <span className="font-medium">Member:</span> Execute skills, view history
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Eye className="w-4 h-4 mt-0.5" />
                    <div>
                      <span className="font-medium">Viewer:</span> View-only access
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
