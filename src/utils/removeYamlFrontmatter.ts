export const removeYamlFrontmatter = (str: string): string => {
  return str.replace(/-{3}(.|\n)*(?<!\|)-{3}(?! *\|)\n*/, '')
}
