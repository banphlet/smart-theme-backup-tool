import React from 'react'
import {
  AppProvider,
  Button,
  Card,
  Frame,
  Layout,
  OptionList,
  Page,
  Popover,
  Tabs
} from '@shopify/polaris'
import enTranslations from '@shopify/polaris/locales/en.json'
import { Provider } from '@shopify/app-bridge-react'
import NoSubscribedChanges from '../Components/NosubscribedThemes'
import useQuery from '../Hooks/useQuery'
import { useRouter } from 'next/router'
import SkeletonLoader from '../Components/SkeletonLoader'
import BackupList from '../Components/BackUpList'
import TimeLines from '../Components/TimeLines'
import SubscribeThemes from '../Components/SubscribeThemes'

const tabs = [
  {
    id: 'Timelines',
    accessibilityLabel: 'TimeLines',
    content: 'Timelines'
  },
  {
    id: 'backups',
    accessibilityLabel: 'Backups',
    content: 'Backups'
  }
]

const Main = ({ shop }) => {
  const [selectedTab, setSelectedTab] = React.useState(0)
  const handleTabChange = React.useCallback(
    selectedTabIndex => setSelectedTab(selectedTabIndex),
    []
  )
  const [popoverActive, setPopoverActive] = React.useState(false)

  const togglePopoverActive = React.useCallback(
    () => setPopoverActive(popoverActive => !popoverActive),
    []
  )

  const hasSubscribedThemes = React.useMemo(
    () => shop?.themes.some(theme => theme.is_subscribed),
    [shop?.themes]
  )
  const subscribedThemes = React.useMemo(
    () =>
      shop?.themes
        .filter(theme => theme.is_subscribed)
        .map(theme => ({
          value: theme.id,
          label: theme.external_theme_name
        })),
    [shop?.themes]
  )
  const [selectedTheme, setSelectedTheme] = React.useState(
    subscribedThemes.slice(0, 1).map(theme => theme.value)
  )

  const currentTheme = React.useMemo(
    () => shop?.themes.find(theme => theme.id === selectedTheme[0]),
    [selectedTheme]
  )

  const HasSubscribedThemes = (
    <Page fullWidth>
      <Popover
        active={popoverActive}
        activator={
          <Button onClick={togglePopoverActive} disclosure>
            Switch Subscribed Themes
          </Button>
        }
        onClose={togglePopoverActive}
      >
        <Popover.Pane>
          <OptionList
            title='Subscribed Themes'
            onChange={setSelectedTheme}
            options={subscribedThemes}
            selected={selectedTheme}
          />
        </Popover.Pane>
      </Popover>
      <Layout>
        <Layout.Section>
          <div style={{ marginTop: 20 }} />
          <Card>
            <Tabs tabs={tabs} selected={selectedTab} onSelect={handleTabChange}>
              <Card.Section>
                {selectedTab === 0 && (
                  <TimeLines shop={shop} theme={currentTheme} />
                )}
                {selectedTab === 1 && (
                  <BackupList shop={shop} theme={currentTheme} />
                )}
              </Card.Section>
            </Tabs>
          </Card>
        </Layout.Section>
        <Layout.Section secondary>
          <SubscribeThemes shop={shop} />
        </Layout.Section>
      </Layout>
    </Page>
  )

  return (
    <Frame>
      <div style={{ padding: 5 }}>
        {hasSubscribedThemes ? (
          HasSubscribedThemes
        ) : (
          <NoSubscribedChanges shop={shop} />
        )}
      </div>
    </Frame>
  )
}

export default function Home ({ shop: firstLoadShop }) {
  const { data: { data: shop = firstLoadShop } = {} } = useQuery({
    path: 'shops/me',
    initialLoad: false,
    initQuery: {
      shop_id: firstLoadShop.id
    }
  })

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
