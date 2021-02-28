import React from 'react'
import {
  VerticalTimeline,
  VerticalTimelineElement
} from 'react-vertical-timeline-component'
import useQuery from '../../Hooks/useQuery'
import { MdTimeline } from 'react-icons/md'
import PerfectScrollbar from 'react-perfect-scrollbar'
import SkeletonLoader from '../SkeletonLoader'
import 'react-perfect-scrollbar/dist/css/styles.css'
import 'react-vertical-timeline-component/style.min.css'

const SingleTimeLine = ({ timeline, index }) => {
  const even = index % 2 === 0
  console.log(even)
  const contentStyle = even
    ? { background: 'rgb(233, 30, 99)', color: '#fff' }
    : { background: 'rgb(33, 150, 243)', color: '#fff' }
  const arrowStyle = even
    ? { borderRight: '7px solid rgb(233, 30, 99)' }
    : { borderRight: '7px solid  rgb(33, 150, 243)' }
  return (
    <VerticalTimelineElement
      className='vertical-timeline-element--work'
      contentStyle={contentStyle}
      contentArrowStyle={arrowStyle}
      date='2011 - present'
      iconStyle={contentStyle}
      icon={<MdTimeline />}
    >
      <h3 className='vertical-timeline-element-title'>Creative Director</h3>
      <h4 className='vertical-timeline-element-subtitle'>Miami, FL</h4>
      <p>
        Creative Direction, User Experience, Visual Design, Project Management,
        Team Leading
      </p>
    </VerticalTimelineElement>
  )
}

const SingleTimeLineMemo = React.memo(SingleTimeLine)

export default function TimeLines ({ shop, theme }) {
  const { data = {}, loading } = useQuery({
    path: '/sync/timelines',
    initQuery: {
      shop_id: shop.id,
      theme_id: theme.id
    }
  })

  console.log(data, 'yes')

  if (loading) return <SkeletonLoader />

  return (
    <PerfectScrollbar style={{ height: window.innerHeight }}>
      <VerticalTimeline layout='1-column' className='timelines'>
        <style>{`
      .vertical-timeline::before{
        background: #4444 !important
      }
      `}</style>
        {data?.data?.map((timeline, index) => (
          <SingleTimeLineMemo
            timeline={timeline}
            index={index}
            key={timeline.id}
          />
        ))}
      </VerticalTimeline>
    </PerfectScrollbar>
  )
}
