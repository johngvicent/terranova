const variants = {
  primary: "bg-[#e35336] hover:bg-[#c44729] text-white",
  outline: "border-2 border-[#003e3c] text-[#003e3c] hover:bg-[#003e3c] hover:text-white",
  "outline-light": "border-2 border-white text-white hover:bg-white hover:text-[#003e3c]",
  ghost: "text-[#003e3c] hover:bg-[#003e3c]/10",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  as: Tag = "button",
  ...props
}) {
  return (
    <Tag
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e35336] ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
