import { Badge, Button, Card } from '@shopify/polaris'

export default function SubscribeThemes ({ themes }) {
  return (
    <Card title='Subscribe a theme for updates'>
      <style>{`
      .Polaris-Card{
        width: 30vw
      }
      `}</style>
      {themes.map(theme => (
        <Card.Section key={theme.id}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <Badge status={theme.role === 'main' ? 'success' : 'critical'}>
                {theme.role === 'main' ? 'Published' : 'UnPublished'}
              </Badge>
              <strong> {theme.external_theme_name}</strong>
            </div>
            <div>
              <Button primary>Subscribe</Button>
            </div>
          </div>
        </Card.Section>
      ))}
    </Card>
  )
}
