export function isErrorWithError(error: unknown): error is { error: string } {
  return (
    typeof error === 'object' &&
    error != null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).error === 'string'
  )
}
