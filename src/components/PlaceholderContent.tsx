interface PlaceholderContentProps {
  title: string
  description?: string
}

export default function PlaceholderContent({
  title,
  description = "Página em construção. Volte em breve para novidades!",
}: PlaceholderContentProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center rounded-lg bg-muted/40 p-8">
      <h1 className="text-3xl font-bold text-foreground">{title}</h1>
      <p className="text-lg text-muted-foreground mt-2">{description}</p>
    </div>
  )
}
