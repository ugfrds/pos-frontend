/**
 * Get cached data from sessionStorage or fetch it if not available.
 * @param {string} key - The unique key for the cached data.
 * @param {Function} fetchFunction - The function to fetch data if not cached.
 * @returns {Promise<any>} The cached or freshly fetched data.
 */
export const getCachedData = async (key, fetchFunction) => {
    try {
        // Check if the data exists in sessionStorage
        const cachedData = sessionStorage.getItem(key);
        if (cachedData) {
            return JSON.parse(cachedData);
        }

        // Fetch new data if not cached
        const data = await fetchFunction();
        if (data) {
            sessionStorage.setItem(key, JSON.stringify(data));
        }

        return data;
    } catch (error) {
        console.error(`Error fetching or caching data for key: ${key}`, error);
        throw new Error("Failed to retrieve data");
    }
};
