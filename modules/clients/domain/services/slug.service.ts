export interface ISlugService {
  generate(text: string): string
  ensureUnique(slug: string, existingSlugs: string[]): string
}

export class SlugService implements ISlugService {
  generate(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
  }

  ensureUnique(slug: string, existingSlugs: string[]): string {
    if (!existingSlugs.includes(slug)) {
      return slug
    }

    let counter = 1
    let uniqueSlug = `${slug}-${counter}`

    while (existingSlugs.includes(uniqueSlug)) {
      counter++
      uniqueSlug = `${slug}-${counter}`
    }

    return uniqueSlug
  }
}