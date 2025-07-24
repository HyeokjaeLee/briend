// Common utility functions
export const createId = () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
};
export const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toISOString();
};
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
export const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};
