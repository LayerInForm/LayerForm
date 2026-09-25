import React from 'react';
import { INSTAGRAM_URL, INSTAGRAM_HANDLE, TIKTOK_URL, TIKTOK_HANDLE } from './links';

type IconProps = { size?: number; className?: string };

export const InstagramIcon: React.FC<IconProps> = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
    strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
    <circle cx="12" cy="12" r="4.2" />
    <circle cx="17.4" cy="6.6" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

export const TikTokIcon: React.FC<IconProps> = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48Z" />
  </svg>
);

export const SOCIALS = [
  { name: 'Instagram', handle: INSTAGRAM_HANDLE, href: INSTAGRAM_URL, Icon: InstagramIcon },
  { name: 'TikTok', handle: TIKTOK_HANDLE, href: TIKTOK_URL, Icon: TikTokIcon },
];
