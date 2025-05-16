
import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:py-6 group-[.toaster]:px-6 group-[.toaster]:rounded-xl group-[.toaster]:max-w-md group-[.toaster]:w-full",
          title: "group-[.toast]:text-xl group-[.toast]:font-bold group-[.toast]:mb-1",
          description: "group-[.toast]:text-lg group-[.toast]:text-muted-foreground group-[.toast]:mt-2",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:text-base",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:text-base",
          success: "group-[.toast]:before:!bg-green-500",
          error: "group-[.toast]:before:!bg-red-500",
          info: "group-[.toast]:before:!bg-blue-500",
          warning: "group-[.toast]:before:!bg-yellow-500",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
