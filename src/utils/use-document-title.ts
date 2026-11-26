import { useEffect } from 'react';

export const SITE_NAME = '權息通';
const DEFAULT_TITLE = `${SITE_NAME} - 輕鬆查詢各股票歷年除權息資料`;

export function useDocumentTitle(title?: string) {
    useEffect(() => {
        document.title = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
    }, [title]);
}
