// Function to convert a title to a URL-friendly slug
export function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w\-]+/g, "") // Remove all non-word characters
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start
    .replace(/-+$/, ""); // Trim - from end
}

// Function to get article URL
export function getArticleUrl(id: string, title?: string): string {
  if (!title) return `/article/${id}`;
  const slug = generateSlug(title);
  return `/article/${id}/${slug}`;
} 