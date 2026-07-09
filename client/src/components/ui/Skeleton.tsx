/**
 * @file Skeleton.tsx
 * @description Pulse loading skeleton placeholder
  */

import { type HTMLAttributes } from 'react';

export function Skeleton({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-md bg-muted/60 ${className}`}
      {...props}
    />
  );
}
export default Skeleton;
