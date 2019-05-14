export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

export const hasData = <T extends any>(data: T | string): T | string => {
    if (data == null || data === '') {
        return '--';
    } else {
        return data;
    }
};
