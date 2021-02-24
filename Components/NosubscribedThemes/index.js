import { Card, EmptyState } from '@shopify/polaris'
import SubscribeThemes from '../SubscribeThemes'

const NoSubscribedChanges = ({ themes = [] }) => (
  <EmptyState
    heading='No Themes subscribed '
    footerContent={
      <p>
        Select a theme and subscribe to get{' '}
        <strong>Automated Daily Backups</strong>, Manual backup, easily rollback
        changes
      </p>
    }
    image='https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg'
  >
    <p style={{ marginBottom: 10 }}>
      Track and receive your incoming inventory from suppliers.
    </p>
    <SubscribeThemes themes={themes} />
  </EmptyState>
)

export default NoSubscribedChanges
