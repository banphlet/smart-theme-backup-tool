import {
  SkeletonPage,
  Layout,
  Card,
  TextContainer,
  SkeletonBodyText,
  SkeletonDisplayText
} from '@shopify/polaris'

export default function SkeletonLoader () {
  return (
    <Layout>
      <Layout.Section>
        <Card sectioned>
          <SkeletonBodyText />
        </Card>
        <Card sectioned>
          <TextContainer>
            <SkeletonDisplayText size='small' />
            <SkeletonBodyText />
          </TextContainer>
        </Card>
        <Card sectioned>
          <TextContainer>
            <SkeletonDisplayText size='small' />
            <SkeletonBodyText />
          </TextContainer>
        </Card>
      </Layout.Section>
    </Layout>
  )
}
