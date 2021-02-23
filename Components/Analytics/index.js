import {
  Badge,
  Card,
  ChoiceList,
  EmptyState,
  Filters,
  Pagination,
  ResourceItem,
  ResourceList,
  TextStyle
} from '@shopify/polaris'
import React from 'react'
import useQuery from '../../Hooks/useQuery'
import MapSection from './Map'

export default function Analytics ({ shop }) {
  const [statusFilter, setStatusFilter] = React.useState([''])
  const {
    data: {
      data = {
        docs: [],
        nextPage: 1,
        prevPage: 0,
        totalDocs: 1,
        page: 1
      }
    } = {},
    loading,
    refetch
  } = useQuery({
    path: 'shops/customers',
    initQuery: {
      shop_id: shop.id,
      limit: 10,
      ...(statusFilter[0] && {
        is_blocked: statusFilter[0]
      })
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

  React.useEffect(() => {
    paginate(1)
  }, [statusFilter])

  return (
    <Card.Section title='All Failed User Logins'>
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
                    selected={statusFilter}
                    onChange={setStatusFilter}
                    allowMultiple={false}
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
        items={data?.docs}
        hasMoreItems={data?.nextPage}
        loading={loading}
        renderItem={(item, id, index) => {
          return (
            <ResourceItem id={item?.item} verticalAlignment='center'>
              <div style={{ display: 'flex' }}>
                <div style={{ flexGrow: 10, flexBasis: '25%' }}>
                  {!index ? (
                    <TextStyle variation='strong'>IP Address</TextStyle>
                  ) : null}
                  <div style={{ marginTop: 20 }}>{item?.ip}</div>
                </div>
                <div style={{ flexGrow: 10, flexBasis: '25%' }}>
                  {index ? null : (
                    <TextStyle variation='strong'>Email</TextStyle>
                  )}{' '}
                  <div style={{ marginTop: 20 }}>{item?.email}</div>
                </div>
                <div style={{ flexGrow: 10, flexBasis: '25%' }}>
                  {index ? null : (
                    <TextStyle variation='strong'>Status</TextStyle>
                  )}{' '}
                  <div style={{ marginTop: 20 }}>
                    <Badge status={item?.is_blocked ? 'critical' : 'success'}>
                      {item?.is_blocked ? 'Blocked' : 'Active'}
                    </Badge>
                  </div>
                </div>
                <div style={{ flexGrow: 10, flexBasis: '25%' }}>
                  {index ? null : (
                    <TextStyle variation='strong'>Attempts</TextStyle>
                  )}{' '}
                  <div style={{ marginTop: 20 }}>{item?.attempts}</div>
                </div>
                <div style={{ flexGrow: 10, flexBasis: '25%' }}>
                  {index ? null : (
                    <TextStyle variation='strong'>Location</TextStyle>
                  )}{' '}
                  <div style={{ marginTop: 20 }}>
                    {item?.geo_location?.city}, {item?.geo_location?.country}
                  </div>
                </div>
                <div style={{ flexGrow: 10, flexBasis: '25%' }}>
                  {index ? null : (
                    <TextStyle variation='strong'>Region</TextStyle>
                  )}{' '}
                  <div style={{ marginTop: 20 }}>
                    {item?.geo_location?.timezone}
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

      <Card.Section>
        <MapSection data={data?.docs} />
      </Card.Section>
    </Card.Section>
  )
}
