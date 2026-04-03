export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    psani: 'Psaní',
    obrazky: 'Obrázky',
    kod: 'Kód',
    produktivita: 'Produktivita',
    video: 'Video',
  }
  return labels[category] ?? category
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    hotovo: 'Hotovo',
    rozpracovano: 'Rozpracováno',
    planovano: 'Plánováno',
  }
  return labels[status] ?? status
}
