"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

function Select<T>({ ...props }: SelectPrimitive.Root.Props<T>) {
  return <SelectPrimitive.Root {...props} />
}

function SelectTrigger({
  className,
  children,
  ...props
}: SelectPrimitive.Trigger.Props) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        "flex h-10 w-full items-center justify-between border border-transparent border-b-input bg-transparent px-0 py-1 text-sm transition-[color,border-color] outline-none focus-visible:border-b-ring disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-b-destructive",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="size-4 text-muted-foreground" />
    </SelectPrimitive.Trigger>
  )
}

function SelectValue({ className, ...props }: SelectPrimitive.Value.Props) {
  return (
    <SelectPrimitive.Value
      className={cn("text-sm", className)}
      {...props}
    />
  )
}

function SelectPopup({ className, ...props }: SelectPrimitive.Popup.Props) {
  return (
    <SelectPrimitive.Positioner>
      <SelectPrimitive.Popup
        className={cn(
          "z-50 mt-1 max-h-60 min-w-[--anchor-width] overflow-auto bg-popover py-1 text-sm text-popover-foreground shadow-lg ring-1 ring-foreground/5",
          className
        )}
        {...props}
      />
    </SelectPrimitive.Positioner>
  )
}

function SelectItem({
  className,
  children,
  ...props
}: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "relative flex cursor-default items-center px-3 py-2 text-sm outline-none select-none data-[highlighted]:bg-muted data-[highlighted]:text-foreground",
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

export { Select, SelectTrigger, SelectValue, SelectPopup, SelectItem }
