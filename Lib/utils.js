export const parseString = str => {
  try {
    return JSON.parse(str)
  } catch (error) {
    return str
  }
}

const sessionName = '__@@sessionTrends'

export const addItemToSession = value =>
  sessionStorage.setItem(sessionName, JSON.stringify(value))

export const getSession = () => {
  const session = sessionStorage.getItem(sessionName)
  return parseString(session)
}

export const loadSdkAsynchronously = () => {
  ;((d, s, id) => {
    const element = d.getElementsByTagName(s)[0]
    const fjs = element
    let js = element
    if (d.getElementById(id)) {
      return
    }
    js = d.createElement(s)
    js.id = id
    js.src = `https://connect.facebook.net/en_US/sdk.js`
    fjs.parentNode.insertBefore(js, fjs)
  })(document, 'script', 'facebook-jssdk')

  window.fbAsyncInit = () => {
    window.FB.init({
      version: `v9.0`,
      appId: process.env.NEXT_PUBLIC_FB_CLIENT_ID,
      xfbml: true
    })
  }
}
