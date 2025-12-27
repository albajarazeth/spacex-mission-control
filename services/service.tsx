const getLatestLaunches = async () => {
    const response = await fetch(
      "https://api.spacexdata.com/v5/launches/query",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: {
            upcoming: false,
          },
          options: {
            page: 1,
            limit: 10,
            sort: {
              date_utc: "desc",
            },
          },
        }),
      }
    );
  
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }
  
    const data = await response.json();
    return data.docs;
  };
  
  export default getLatestLaunches;
  
export const getAllLaunches = async () => {
    const allLaunches: any[] = [];
    let currentPage = 1;
    let hasNextPage = true;
    const limit = 200;
    
    while (hasNextPage) {
      const response = await fetch(
        "https://api.spacexdata.com/v5/launches/query",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            options: {
              page: currentPage,
              limit: limit,
              sort: {
                date_utc: "desc",
              },
            },
          }),
        }
      );
    
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }
    
      const data = await response.json();
      const launches = data.docs || [];
      
      allLaunches.push(...launches);
      hasNextPage = data.hasNextPage === true;
      currentPage++;
      
      if (launches.length === 0) {
        hasNextPage = false;
      }
    }
    
    return allLaunches;
  };

export const getUpcomingLaunches = async () => {
    const allLaunches: any[] = [];
    let currentPage = 1;
    let hasNextPage = true;
    const limit = 200;
    
    while (hasNextPage) {
      const response = await fetch(
        "https://api.spacexdata.com/v5/launches/query",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: {
              date_utc: {
                $gte: "2022-01-01T00:00:00.000Z",
                $lte: "2022-12-31T23:59:59.999Z"
              }
            },
            options: {
              page: currentPage,
              limit: limit,
              sort: {
                date_utc: "asc",
              },
            },
          }),
        }
      );
    
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }
    
      const data = await response.json();
      const launches = data.docs || [];
      
      allLaunches.push(...launches);
      hasNextPage = data.hasNextPage === true;
      currentPage++;
      
      if (launches.length === 0) {
        hasNextPage = false;
      }
    }
    
    return allLaunches;
  };
  