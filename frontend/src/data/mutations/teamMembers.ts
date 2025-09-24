export const TEAM_MEMBERS_STORAGE_KEY = 'team_members'

const simulateDelay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

const readStorage = () => {
  const membersString = localStorage.getItem(TEAM_MEMBERS_STORAGE_KEY)
  return membersString ? JSON.parse(membersString) : []
}

const writeStorage = (members: any[]) => {
  localStorage.setItem(TEAM_MEMBERS_STORAGE_KEY, JSON.stringify(members))
}

export const getTeamMembers = async () => {
  await simulateDelay()
  try {
    return readStorage()
  } catch (error) {
    return []
  }
}

export const saveTeamMember = async (memberData: any) => {
  await simulateDelay()
  try {
    const teamMembers = readStorage()

    const newMember = {
      ...memberData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }

    teamMembers.push(newMember)
    writeStorage(teamMembers)

    return newMember
  } catch (error) {
    throw new Error('Could not save member.')
  }
}

export const deleteTeamMember = async (memberId: string) => {
  await simulateDelay()
  try {
    const teamMembers = readStorage()
    const initialLength = teamMembers.length

    const updatedMembers = teamMembers.filter((member: any) => member.id !== memberId)

    if (updatedMembers.length === initialLength) {
      throw new Error(`Member with ID ${memberId} not found.`)
    }

    writeStorage(updatedMembers)
    return true
  } catch (error) {
    throw error
  }
}

export const updateTeamMember = async (updatedMemberData: any) => {
  await simulateDelay()
  try {
    const teamMembers = readStorage()
    const index = teamMembers.findIndex((member: any) => member.id === updatedMemberData.id)

    if (index === -1) {
      throw new Error(`Member with ID ${updatedMemberData.id} not found.`)
    }

    teamMembers[index] = {
      ...teamMembers[index],
      ...updatedMemberData,
      updatedAt: new Date().toISOString(),
    }

    writeStorage(teamMembers)
    return teamMembers[index]
  } catch (error) {
    throw error
  }
}
