export const getLaunchpadName = async (launchpadId: string): Promise<string> => {
  try {
    const response = await fetch(`https://api.spacexdata.com/v4/launchpads/${launchpadId}`);
    if (!response.ok) {
      return launchpadId;
    }
    const data = await response.json();
    return data.name || data.full_name || launchpadId;
  } catch {
    return launchpadId;
  }
};

const launchpadCache: Record<string, string> = {};

export const getCachedLaunchpadName = async (launchpadId: string): Promise<string> => {
  if (launchpadCache[launchpadId]) {
    return launchpadCache[launchpadId];
  }
  
  const name = await getLaunchpadName(launchpadId);
  launchpadCache[launchpadId] = name;
  return name;
};

