const debounce_gaming = {};

module.exports = {
    checkDebounce(authorId) {
        let returnValue = {
            shouldRateLimit: false,
            diff: 0,
        };

        const currentTime = Math.floor(Date.now() / 1000);
        const timeBefore = debounce_gaming[authorId];
        let count = 1;
        const diff = currentTime - timeBefore;
        if(diff < process.env.debounce_minimal_timeout) {
            count = debounce_gaming[`${authorId}_count`] + 1;
            if(count < process.env.debounce_activation_threshold) {
                returnValue.diff = diff;
                returnValue.shouldRateLimit = true;
                return returnValue;
            }
        }
        debounce_gaming[authorId] = currentTime;
        debounce_gaming[`${authorId}_count`] = count;
        return returnValue;
    }
}
