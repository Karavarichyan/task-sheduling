export const TEAM_MEMBERS_STORAGE_KEY = 'team_members'; 

export const getTeamMembers = () => {
  try {
    const membersString = localStorage.getItem(TEAM_MEMBERS_STORAGE_KEY);
    return membersString ? JSON.parse(membersString) : [];
  } catch (error) {
    console.error('Failed to retrieve team members from localStorage:', error);
    return [];
  }
};

export const saveTeamMember = (memberData: any) => {
  try {
    const teamMembers = getTeamMembers();

    const newMember = {
      ...memberData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    teamMembers.push(newMember);
    localStorage.setItem(TEAM_MEMBERS_STORAGE_KEY, JSON.stringify(teamMembers));

    return newMember;
  } catch (error) {
    console.error('Failed to save team member to localStorage:', error);
    return null;
  }
};
