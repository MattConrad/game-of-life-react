const maxDelay = 2000;
const minDelay = 40;
// taking the sqrt of the speed range value makes speed transitions feel smoother at the fast end, so the range is actually the delay ** 2.
const maxSpeedRange = (maxDelay - minDelay) ** 2;
const getDelayFromSpeedRange = (speedRangeValue) => (maxDelay - (speedRangeValue ** 0.5));
const initialSpeedRangeValue = maxSpeedRange * 0.8;
const initialDelay = getDelayFromSpeedRange(initialSpeedRangeValue);

export { maxSpeedRange, initialDelay, initialSpeedRangeValue, getDelayFromSpeedRange };
