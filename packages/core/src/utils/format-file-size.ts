export const formatFileSize = (size: number) => {
    let i = Math.floor(Math.log(size) / Math.log(1024));

    return `${(size / Math.pow(1024, i)).toFixed(1)} ${['B', 'KB', 'MB', 'GB', 'TB'][i]}`;
};
