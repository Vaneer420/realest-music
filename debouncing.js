const debounceGaming = {};

module.exports = {
    checkDebounce(authorId) {
        let returnValue = {
            shouldRateLimit: false,
            diff: 0,
        };

        const currentTime = Math.floor(Date.now() / 1000);
        const timeBefore = debounceGaming[authorId];
        let count = debounceGaming[`${authorId}_count`] || 0;
        const diff = currentTime - timeBefore;
        if(diff < process.env.debounce_minimal_timeout) {
            if(count > process.env.debounce_activation_threshold) {
                returnValue.diff = diff;
                returnValue.shouldRateLimit = true;
                return returnValue;
            }
        }
        debounceGaming[authorId] = currentTime;
        debounceGaming[`${authorId}_count`] = count + 1;
        return returnValue;
    }
}
