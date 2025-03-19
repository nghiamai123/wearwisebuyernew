import { cn } from "@/lib/utils";

export function InputField({ label, error, className, ...props }) {
    return (
      <div className="space-y-2">
        <label className="block text-sm text-gray-600">{label}</label>
        <input
          className={cn(
            "w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-gray-400 focus:outline-none",
            error && "border-red-500",
            className,
          )}
          {...props}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    )
  }