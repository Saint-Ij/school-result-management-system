"use client"

import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
import { cn } from "@/lib/utils"

function Popover({ ...props }: PopoverPrimitive.Root.Props) {
  return <PopoverPrimitive.Root {...props} />
}

function PopoverTrigger({ ...props }: PopoverPrimitive.Trigger.Props) {
  return <PopoverPrimitive.Trigger {...props} />
}

function PopoverContent({ className, ...props }: PopoverPrimitive.Popup.Props) {
  return (
    <PopoverPrimitive.Positioner>
      <PopoverPrimitive.Popup
        className={cn(
          "z-50 min-w-40 overflow-hidden rounded-md bg-popover p-4 text-popover-foreground shadow-lg ring-1 ring-foreground/5",
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Positioner>
  )
}

export { Popover, PopoverTrigger, PopoverContent }
