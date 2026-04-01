import { useMemo, useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Palette } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const themes = [
  { value: "light", label: "Light" },
  { value: "blue-gray", label: "Blue Gray" },
  { value: "sunset", label: "Sunset" },
  { value: "rainforest", label: "Rainforest" },
  { value: "ocean", label: "Ocean" },
];

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentLabel = useMemo(() => {
    if (!mounted) return "Theme";
    return themes.find((item) => item.value === theme)?.label || "Theme";
  }, [mounted, theme]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          aria-label="Change theme"
        >
          <Palette className="h-4 w-4" />
          <span className="hidden lg:inline">{currentLabel}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>Select Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {themes.map((item) => (
          <DropdownMenuItem
            key={item.value}
            onClick={() => setTheme(item.value)}
            className={theme === item.value ? "bg-orange-100 text-orange-700" : ""}
          >
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
