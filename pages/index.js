import React from 'react'
import { AppProvider, Frame } from '@shopify/polaris'
import enTranslations from '@shopify/polaris/locales/en.json'
import { Provider, useAppBridge } from '@shopify/app-bridge-react'
import NoSubscribedChanges from '../Components/NosubscribedThemes'

const Main = ({ shop }) => {
  const app = useAppBridge()

  return (
    <Frame>
      <div style={{ padding: 5 }}>
        <NoSubscribedChanges shop={shop} />
      </div>
    </Frame>
  )
}

export default function Home ({ shop }) {
  return (
    <AppProvider i18n={enTranslations}>
      <Provider
        config={{
          shopOrigin: shop?.platform_domain,
          apiKey: process.env.NEXT_PUBLIC_SHOPIFY_CLIENT_ID,
          forceRedirect: true
        }}
      >
        <Main shop={shop} />
      </Provider>
    </AppProvider>
  )
}

export { getServerSideProps } from '../Events/get-server-side-props'
