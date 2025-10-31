export const invalidateCache = (keyOrPrefix) => {
    try {
        if (keyOrPrefix.endsWith("*")) {
            // Invalidate all keys that start with the prefix
            const prefix = keyOrPrefix.slice(0, -1);
            for (let i = 0; i < sessionStorage.length; i++) {
                const key = sessionStorage.key(i);
                if (key.startsWith(prefix)) {
                    sessionStorage.removeItem(key);
                }
            }
        } else {
            // Invalidate a specific key
            sessionStorage.removeItem(keyOrPrefix);
        }
        console.log(`Cache invalidated for: ${keyOrPrefix}`);
    } catch (error) {
        console.error(`Error invalidating cache for key: ${keyOrPrefix}`, error);
    }
};

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
