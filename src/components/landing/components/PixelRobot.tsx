export default function PixelRobot({ className = 'w-16 h-16' }: { className?: string }) {
  return (
    <div className={`relative inline-block select-none animate-robot ${className}`} aria-label="CampusFlow Pixel Robot">
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xs"
        style={{ shapeRendering: 'crispEdges' }}
      >
        {/* Antenna */}
        <rect x="22" y="4" width="4" height="6" fill="#e05842" />
        <rect x="20" y="2" width="8" height="4" fill="#e05842" />

        {/* Head Base */}
        <rect x="10" y="10" width="28" height="26" fill="#f4f0e8" stroke="#1f2937" strokeWidth="2" />

        {/* Ears / Side antennas */}
        <rect x="4" y="18" width="6" height="10" fill="#1f2937" />
        <rect x="38" y="18" width="6" height="10" fill="#1f2937" />

        {/* Cheeks */}
        <rect x="13" y="24" width="5" height="4" fill="#e05842" />
        <rect x="30" y="24" width="5" height="4" fill="#e05842" />

        {/* Eyes */}
        <rect x="17" y="18" width="4" height="5" fill="#1f2937" />
        <rect x="27" y="18" width="4" height="5" fill="#1f2937" />

        {/* Mouth */}
        <rect x="20" y="28" width="8" height="3" fill="#1f2937" />

        {/* Body Base Collar */}
        <rect x="14" y="36" width="20" height="8" fill="#e05842" stroke="#1f2937" strokeWidth="2" />
      </svg>
    </div>
  );
}
