type IconProps = { size?: number; className?: string };

/** Speech-bubble outline. `filled` adds the little phone, WhatsApp-style. */
export function ChatIcon({
  size = 20,
  className,
  filled = false,
}: IconProps & { filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      aria-hidden="true"
      className={className}
    >
      <path d="M20.5 11.7a8.5 8.5 0 0 1-12.7 7.4L3 20.5l1.3-4.7a8.5 8.5 0 1 1 16.2-4.1Z" />
      {filled && (
        <path
          d="M8.4 7.6c-.8.4-.9 1.2-.6 2.2.7 2.2 2.6 4.2 4.9 5 .9.3 1.9.2 2.3-.6l.5-1-2.3-1.1-.8 1c-1.5-.7-2.3-1.4-3-2.8l.8-.8-1-2.2-.8.3Z"
          fill="currentColor"
          stroke="none"
        />
      )}
    </svg>
  );
}
