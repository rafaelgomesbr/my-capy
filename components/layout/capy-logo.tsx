interface CapyLogoProps {
  size?: number;
  className?: string;
}

export function CapyLogo({ size = 28, className }: CapyLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Left ear */}
      <ellipse cx="10" cy="10" rx="6" ry="5" fill="#7B5C2A" />
      <ellipse cx="10" cy="10.5" rx="3.5" ry="3" fill="#C4924A" />

      {/* Right ear */}
      <ellipse cx="30" cy="10" rx="6" ry="5" fill="#7B5C2A" />
      <ellipse cx="30" cy="10.5" rx="3.5" ry="3" fill="#C4924A" />

      {/* Head */}
      <ellipse cx="20" cy="23" rx="17" ry="14" fill="#7B5C2A" />

      {/* Muzzle area */}
      <ellipse cx="20" cy="28" rx="11" ry="7.5" fill="#C4924A" />

      {/* Eyes */}
      <circle cx="14.5" cy="20" r="2.8" fill="#1A0A00" />
      <circle cx="25.5" cy="20" r="2.8" fill="#1A0A00" />

      {/* Eye shine */}
      <circle cx="15.4" cy="19" r="1" fill="white" />
      <circle cx="26.4" cy="19" r="1" fill="white" />

      {/* Nose — wide rectangle, capivara's signature */}
      <rect x="14.5" y="24" width="11" height="6.5" rx="3.2" fill="#4A2C0E" />

      {/* Nostrils */}
      <circle cx="17.2" cy="27.2" r="1.3" fill="#2D1A00" />
      <circle cx="22.8" cy="27.2" r="1.3" fill="#2D1A00" />

      {/* Smile */}
      <path
        d="M 15.5 32 Q 20 35.5 24.5 32"
        stroke="#4A2C0E"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
