export const asset = (path) => (path ? import.meta.env.BASE_URL + path.replace(/^\//, "") : undefined);
