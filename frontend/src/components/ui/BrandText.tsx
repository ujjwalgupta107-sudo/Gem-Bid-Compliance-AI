import React from "react";

interface BrandTextProps {
  className?: string;
  inline?: boolean;
}

export function BrandText({ className = "", inline = false }: BrandTextProps) {
  return (
    <span className={`inline-block font-black tracking-tight leading-[1.1] ${className}`}>
      <span className="text-[#FF9933]">Bid </span>
      <span className="text-white">Compliance</span>
      {!inline && <br />}
      {inline && <span> </span>}
      <span className="text-[#22c55e] drop-shadow-[0_0_8px_rgba(34,197,94,0.3)]">Platform</span>
    </span>
  );
}
