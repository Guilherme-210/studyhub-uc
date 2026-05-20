import { OrganizationSidebar } from '@components/organization'

export default function OrganizationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <OrganizationSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
