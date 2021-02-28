import React from 'react'
import { Badge, Button, Card } from '@shopify/polaris'
import useMutation from '../../Hooks/useMutation'

export default function SubscribeThemes ({ shop, full }) {
  const themes = shop?.themes
  const [selectedTheme, setSelectedTheme] = React.useState()
  const { makeRequest, loading } = useMutation({
    path: '/plans/charge'
  })

  const onSubscribe = async theme => {
    setSelectedTheme(theme)
    const { data: url } = await makeRequest({
      theme_id: theme.id,
      shop_id: shop.id
    })
    window.parent.location.href = url
  }
  return (
    <Card>
      {full && (
        <style>{`
      .Polaris-Card{
        width: 30vw
      }
      `}</style>
      )}

      <Card.Section title='Subscribe To A theme for updates' />
      {themes.map(theme => (
        <Card.Section key={theme.id}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap'
            }}
          >
            <div>
              <Badge status={theme.role === 'main' ? 'success' : 'critical'}>
                {theme.role === 'main' ? 'Published' : 'UnPublished'}
              </Badge>
              <strong> {theme.external_theme_name}</strong>
            </div>
            <div>
              <Button
                primary={!theme.is_subscribed}
                destructive={theme.is_subscribed}
                loading={selectedTheme?.id === theme?.id && loading}
                onClick={() => onSubscribe(theme)}
              >
                {theme?.is_subscribed ? 'Unsubscribe' : 'Subscribe'}
              </Button>
            </div>
          </div>
        </Card.Section>
      ))}
    </Card>
  )
}
