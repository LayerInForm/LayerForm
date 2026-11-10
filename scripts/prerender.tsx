import React from 'react';
import { renderToString } from 'react-dom/server';
import App from '../App';
export { PAGE_META, SERVICE_PAGES, SITE_URL, structuredData } from '../src/seo';
export const render = (path: string) => renderToString(<App initialPath={path} />);
