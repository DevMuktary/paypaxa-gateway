export const metadata = {
  title: 'PAYPAXA Gateway',
  description: 'Payment infrastructure for modern businesses',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
