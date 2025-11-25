// components/icons/TikTokIcon.tsx
const TikTokIcon = ({ size = 24, color = "currentColor", ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {/* Example path — you may want to refine or use official brand SVG */}
    <path
      d="M34.5 11.5c-3 .5-5.8.2-8.2-.9v20.2c0 6.4-5.2 11.6-11.6 11.6S3 37.2 3 30.8s5.2-11.6 11.6-11.6c.4 0 .8.03 1.2.08v6.4c-.4-.07-.8-.1-1.2-.1-3.4 0-6.1 2.7-6.1 6.1s2.7 6.1 6.1 6.1 6.1-2.7 6.1-6.1V8h6c.8 0 1.6.1 2.4.3v9.2z"
      fill={color}
    />
  </svg>
);

export default TikTokIcon;
