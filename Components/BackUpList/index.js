import {
  Badge,
  Button,
  Card,
  ChoiceList,
  EmptyState,
  Filters,
  Pagination,
  ResourceItem,
  ResourceList,
  Spinner,
  TextStyle
} from '@shopify/polaris'
import React from 'react'
import useQuery from '../../Hooks/useQuery'
import moment from 'moment'

export default function BackupList ({ shop, theme }) {
  const { data: { data } = {}, loading, refetch } = useQuery({
    path: '/sync/backups',
    initQuery: {
      shop_id: shop.id,
      theme_id: theme.id
    }
  })

  const paginate = page => {
    refetch({
      useInitialQuery: false,
      onlyQuery: false,
      query: {
        page
      }
    })
  }

  return (
    <Card.Section title={`All Backups for ${theme.external_theme_name} theme`}>
      <ResourceList
        filterControl={
          <Filters
            hideQueryField
            filters={[
              {
                key: 'status',
                label: 'Block Status',
                filter: (
                  <ChoiceList
                    title='Account status'
                    titleHidden
                    choices={[
                      { label: 'All', value: '' },
                      { label: 'Blocked', value: true },
                      { label: 'Not Blocked', value: false }
                    ]}
                    // selected={statusFilter}
                    // onChange={setStatusFilter}
                    // allowMultiple={false}
                  />
                ),
                shortcut: true,
                hideClearButton: true
              }
            ]}
          />
        }
        emptyState={
          <EmptyState
            heading='No content found'
            image='/empty.svg'
            largeImage='/empty.svg'
            fullWidth
            // fullWidth
          >
            <p>Blocked users will show up here</p>
          </EmptyState>
        }
        resourceName={{ singular: 'user', plural: 'users' }}
        items={data?.docs || []}
        hasMoreItems={data?.nextPage}
        loading={loading}
        renderItem={(item, id, index) => {
          return (
            <ResourceItem id={item?.item} verticalAlignment='center'>
              <div style={{ display: 'flex' }}>
                <div style={{ flexGrow: 10, flexBasis: '25%' }}>
                  {!index ? (
                    <TextStyle variation='strong'>Date Created</TextStyle>
                  ) : null}
                  <div style={{ marginTop: 20 }}>
                    {moment(item?.created_at).calendar()}
                  </div>
                </div>
                {theme?.is_syncing ? (
                  <div
                    style={{ flexGrow: 10, flexBasis: '25%', marginLeft: 20 }}
                  >
                    {index ? null : (
                      <TextStyle variation='strong'>Backup Running</TextStyle>
                    )}{' '}
                    <div style={{ marginTop: 20 }}>
                      <Spinner
                        accessibilityLabel='Backup running example'
                        size='small'
                      />
                    </div>
                  </div>
                ) : null}
                <div style={{ flexGrow: 10, flexBasis: '25%', marginLeft: 20 }}>
                  {index ? null : (
                    <TextStyle variation='strong'>Type</TextStyle>
                  )}{' '}
                  <div style={{ marginTop: 20 }}>
                    <Badge
                      status={
                        item?.type !== 'automatic' ? 'critical' : 'success'
                      }
                    >
                      {item.type}
                    </Badge>
                  </div>
                </div>
                <div style={{ flexGrow: 10, flexBasis: '25%' }}>
                  {index ? null : (
                    <TextStyle variation='strong'>Total Assets</TextStyle>
                  )}{' '}
                  <div style={{ marginTop: 20 }}>{item?.assets?.length}</div>
                </div>
                <div style={{ flexGrow: 10, flexBasis: '25%' }}>
                  {index ? null : (
                    <TextStyle variation='strong'>View</TextStyle>
                  )}{' '}
                  <div style={{ marginTop: 20 }}>
                    <Button primary>View Assets</Button>
                  </div>
                </div>
                <div style={{ flexGrow: 10, flexBasis: '25%' }}>
                  {index ? null : (
                    <TextStyle variation='strong'>Reset</TextStyle>
                  )}{' '}
                  <div style={{ marginTop: 20 }}>
                    <Button destructive>Restore</Button>
                  </div>
                </div>
              </div>
            </ResourceItem>
          )
        }}
      />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 16px',
          borderTop: ' 1px solid #dfe4e8'
        }}
      >
        <Pagination
          hasPrevious={data?.hasPrevPage}
          previousKeys={[74]}
          previousTooltip='j'
          onPrevious={() => paginate(data?.prevPage)}
          hasNext={data?.hasNextPage}
          nextKeys={[75]}
          nextTooltip='k'
          onNext={() => paginate(data?.nextPage)}
        />
      </div>
    </Card.Section>
  )
}
