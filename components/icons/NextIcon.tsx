
import React from 'react';

interface IconProps {
  className?: string;
}

const NextIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M5.25 5.653c0-1.426 1.529-2.33 2.779-1.643l7.58 4.347 7.58 4.347c1.295.742 1.295 2.545 0 3.286l-7.58 4.347-7.58 4.347c-1.25.717-2.779-.217-2.779-1.643V5.653z" />
  </svg>
);

export default NextIcon;
