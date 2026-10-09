/** Wavy edge for colour bands. Draws in currentColor; `flip` points the waves down. */
export default function Wave({
  flip = false,
  className = "",
}: {
  flip?: boolean;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 40"
      preserveAspectRatio="none"
      className={`block h-5 w-full md:h-8 ${flip ? "-scale-y-100" : ""} ${className}`}
    >
      <path
        d="M0 40V20Q75 0 150 20T300 20T450 20T600 20T750 20T900 20T1050 20T1200 20V40Z"
        fill="currentColor"
      />
    </svg>
  );
}
