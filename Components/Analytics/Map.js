import React from 'react'

import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography
} from 'react-simple-maps'
import groupBy from 'lodash/groupBy'
import countBy from 'lodash/countBy'
import { ActionList, Card, Popover } from '@shopify/polaris'

export default function MapSection ({ data = [] }) {
  const [toolpitPosition, updatePosition] = React.useState({
    left: 302,
    top: 619,
    moreDetails: '',
    show: false,
    country: ''
  })

  const usersGroupedByCountry = React.useMemo(
    () => groupBy(data, 'geo_location.country'),
    [data]
  )

  const findFillColor = geography => {
    const countryGroup = usersGroupedByCountry[geography?.properties?.ISO_A2]
    return countryGroup ? '#607D8B' : '#ECEFF1'
  }

  const handleMouseLeave = () => {
    updatePosition({ ...toolpitPosition, show: false })
  }

  const handleMouseMove = geography => evt => {
    const x = evt.clientX
    const y = evt.clientY + window.pageYOffset
    const countryItem = usersGroupedByCountry[geography?.properties?.ISO_A2]
    const count = countBy(countryItem, 'is_blocked')
    const blockedCount = count[true]
    const unBlockedCount = count[false]
    updatePosition({
      ...toolpitPosition,
      left: x,
      top: y,
      show: true,
      country: geography?.properties?.NAME,
      moreDetails: countryItem
        ? `${blockedCount ? `Blocked: ${blockedCount}` : ''}`.concat(
            unBlockedCount ? `\n Not blocked: ${unBlockedCount}` : ''
          )
        : 'No data to show'
    })
  }

  return (
    <Card.Section title='Login Attempts By Country'>
      <ComposableMap
        projectionConfig={{
          scale: 205,
          rotation: [-11, 0, 0]
        }}
        width={980}
        height={551}
        style={{
          width: '100%',
          height: 'auto'
        }}
      >
        <Geographies geography='/world-50m.json'>
          {({ geographies }) =>
            geographies.map(
              (geography, i) =>
                geography.id !== 'ATA' && (
                  <Geography
                    key={i}
                    geography={geography}
                    onMouseEnter={handleMouseMove(geography)}
                    onMouseLeave={handleMouseLeave}
                    style={{
                      default: {
                        fill: findFillColor(geography),
                        stroke: '#607D8B',
                        strokeWidth: 0.75,
                        outline: 'none'
                      },
                      hover: {
                        fill: '#607D8B',
                        stroke: '#607D8B',
                        strokeWidth: 0.75,
                        outline: 'none'
                      },
                      pressed: {
                        fill: '#3f4eae',
                        stroke: '#607D8B',
                        strokeWidth: 0.75,
                        outline: 'none'
                      }
                    }}
                  />
                )
            )
          }
        </Geographies>
      </ComposableMap>

      <div
        style={{
          position: 'absolute',
          top: toolpitPosition.top,
          left: toolpitPosition.left,
          zIndex: 999999,
          display: toolpitPosition.show ? 'block' : 'none'
        }}
      >
        <Card sectioned title={`${toolpitPosition.country} Stats`}>
          <div>{toolpitPosition.moreDetails}</div>
        </Card>
      </div>
    </Card.Section>
  )
}
