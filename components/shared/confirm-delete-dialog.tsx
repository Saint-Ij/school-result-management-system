"use client"

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogPopup,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogClose,
} from "@/components/ui/alert-dialog"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ConfirmDeleteDialogProps = {
  title?: string
  description?: string
  onConfirm: () => void
  children: React.ReactNode
}

export function ConfirmDeleteDialog({
  title = "Are you sure?",
  description = "This action cannot be undone.",
  onConfirm,
  children,
}: ConfirmDeleteDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={children as React.ReactElement} />
      <AlertDialogPopup>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
        <div className="mt-6 flex justify-end gap-2">
          <AlertDialogClose className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
            Cancel
          </AlertDialogClose>
          <AlertDialogClose
            className={cn(buttonVariants({ variant: "destructive", size: "sm" }))}
            onClick={onConfirm}
          >
            Delete
          </AlertDialogClose>
        </div>
      </AlertDialogPopup>
    </AlertDialog>
  )
}
