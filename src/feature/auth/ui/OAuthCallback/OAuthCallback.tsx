import { useEffect } from 'react'

export const OAuthCallback = () => {
  useEffect(() => {
    debugger

    const url = new URL(window.location.href)

    const code = url.searchParams.get('code')

    if (code && window.opener) {
      window.opener.postMessage({ code }, '*')
    }

    window.close()
  }, [])

  return <p>Loggin you in ...</p>
}
