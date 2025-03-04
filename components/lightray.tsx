import { cn } from "@/lib/utils";

interface LightRayProps {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  size?: "sm" | "md" | "lg" | "xl";
  opacity?: number;
  blur?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const LightRay = ({
  position = "top-right",
  size = "md",
  opacity = 0.3,
  blur = "xl",
  className = "",
}: LightRayProps) => {
  const positionClasses = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0",
    "bottom-left": "bottom-0 left-0",
    "bottom-right": "bottom-0 right-0",
  };

  const sizeClasses = {
    sm: "w-40 h-40 md:w-[300px] md:h-[300px]",
    md: "w-60 h-60 md:w-[500px] md:h-[500px]",
    lg: "w-80 h-80 md:w-[700px] md:h-[700px]",
    xl: "w-96 h-96 md:w-[900px] md:h-[900px]",
  };

  const blurClasses = {
    sm: "blur-xl",
    md: "blur-2xl",
    lg: "blur-3xl",
    xl: "blur-[80px]",
  };

  return (
    <div
      className={cn(
        "absolute",
        positionClasses[position],
        sizeClasses[size],
        `bg-gradient-to-br from-transparent to-red-300`,
        `opacity-${Math.round(opacity * 100)}`,
        blurClasses[blur],
        "pointer-events-none",
        className
      )}
    ></div>
  );
};

export default LightRay;
// const LightRay = () => {
//   return (
//     <div className="absolute top-0 right-0 w-60 h-60 md:w-[500px] md:h-[500px] bg-linear-to-br from-transparent to-amber-300 opacity-30 blur-3xl pointer-events-none"></div>
//   )
// }

// export default LightRay
