export function SnoonuLogo({ size = 28 }: { size?: number }) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Snoonu"
      >
        {/* Background circle */}
        <circle cx="50" cy="50" r="50" fill="#E30613" />
  
        {/* Stylized S */}
        <path
          d="M64 32C64 26 58 22 50 22C42 22 36 26 36 32C36 38 42 40 50 42C58 44 64 46 64 52C64 58 58 62 50 62C42 62 36 58 36 52"
          stroke="white"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    );
  }
  