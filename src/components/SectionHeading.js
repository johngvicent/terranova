export default function SectionHeading({ title, subtitle, centered = false, light = false }) {
  return (
    <div className={centered ? "text-center" : ""}>
      <h2
        className={`font-heading text-3xl font-bold leading-tight md:text-4xl ${
          light ? "text-white" : "text-[#003e3c]"
        }`}
        style={{ fontFamily: "var(--font-raleway), sans-serif" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-3 text-lg max-w-2xl ${
            centered ? "mx-auto" : ""
          } ${light ? "text-white/80" : "text-[#6b7280]"}`}
        >
          {subtitle}
        </p>
      )}
      <div
        className={`mt-4 h-1 w-16 rounded-full bg-[#e35336] ${
          centered ? "mx-auto" : ""
        }`}
      />
    </div>
  );
}
