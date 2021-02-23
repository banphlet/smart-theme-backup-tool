import React from 'react'
import {
  Layout,
  Card,
  FormLayout,
  TextField,
  Select,
  Loading,
  Form,
  ContextualSaveBar,
  SettingToggle,
  TextStyle
} from '@shopify/polaris'
import isEqual from 'lodash/isEqual'
import { SketchPicker } from 'react-color'
import ManualAddIps from './ManualAddIps'
import compact from 'lodash/compact'

const options = [
  { label: 'IP', value: 'ip' },
  { label: 'EMAIL', value: 'email' }
]

export default function Settings({ shop, loading, data, makeRequest }) {
  const initialFormFields = {
    limit_by: data?.limit_by || shop.limit_by,
    attempts: String(data?.attempts || shop.attempts),
    duration: String(data?.duration || shop.duration),
    banner_message: data?.banner_message || shop.banner_message,
    status: data?.status || shop?.status,
    background_color: data?.background_color || shop?.background_color,
    text_color: data?.text_color || shop?.text_color,
    blacklisted_ips: (data?.blacklisted_ips || shop?.blacklisted_ips || []).join("\n")
  }
  const [formFields, setFormFields] = React.useState(initialFormFields)
  const [showContextSave, setShowContextSave] = React.useState(false)

  const onSave = async () => {
    await makeRequest({
      shop_id: shop.id,
      ...formFields,
      blacklisted_ips: compact(formFields.blacklisted_ips.split("\n"))
    })
    setShowContextSave(false)
  }

  const updateField = (field, value) =>
    setFormFields({ ...formFields, [field]: value })

  React.useEffect(() => {
    const hasChanges = !isEqual(initialFormFields, formFields)
    setShowContextSave(hasChanges)
  }, [formFields])

  return (
    <Card.Section>
      {loading ? <Loading /> : null}
      {showContextSave ? (
        <ContextualSaveBar
          fullWidth
          message='Unsaved changes'
          saveAction={{
            onAction: onSave,
            loading,
            disabled: loading || !formFields.attempts
          }}
          discardAction={{
            onAction: () => setFormFields(initialFormFields)
          }}
        />
      ) : null}
      <p style={{ marginBottom: 10 }} />
      <Layout>
        <Layout.AnnotatedSection
          title='Login Limit Settings'
          description='Customize when account should be blocked'
        >
          <SettingToggle
            action={{
              content: formFields.status === 'A' ? 'Disable' : 'Enable',
              onAction: () =>
                updateField('status', formFields?.status === 'A' ? 'D' : 'A')
            }}
            enabled={formFields.status === 'A'}
          >
            This setting is{' '}
            <TextStyle variation='strong'>
              {formFields.status === 'A' ? 'Enabled' : 'Disabled'}
            </TextStyle>
            .
          </SettingToggle>
          <Card sectioned>
            <Form onSubmit={onSave}>
              <FormLayout>
                <Select
                  label='Block By'
                  onChange={value => updateField('limit_by', value)}
                  options={options}
                  value={formFields.limit_by}
                />
                <TextField
                  label='Attempts'
                  helpText='Total login attempts before blocking a user'
                  type='number'
                  placeholder='Total login attempts'
                  value={formFields.attempts}
                  onChange={value => updateField('attempts', value)}
                  min={1}
                  error={!formFields.attempts && 'Enter attempts'}
                />
                <TextField
                  label='Duration'
                  helpText='How many minutes after which customer can login'
                  type='number'
                  placeholder='Amount of time in minutes customer has to wait'
                  value={formFields.duration}
                  onChange={value => updateField('duration', value)}
                  min={1}
                  error={!formFields.duration && 'Enter duration'}
                  prefix='MINS'
                />
                <TextField
                  label='Error Message'
                  helpText='Error message customers will see'
                  type='text'
                  value={formFields.banner_message}
                  onChange={value => updateField('banner_message', value)}
                  min={1}
                  error={!formFields.banner_message && 'Enter error message '}
                  multiline
                />
              </FormLayout>
              {/* <p style={{ marginBottom: 30 }} />
              <Stack distribution='trailing'>
                <Button submit disabled={loading} primary>
                  Save
                </Button>
              </Stack> */}
            </Form>
          </Card>
          <div style={{ marginTop: 20 }} />
          <Layout>
            <Layout.Section oneHalf>
              <Card title='Banner Design' sectioned>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <div>
                    <TextStyle variation='strong'>
                      Select Error Text Color
                    </TextStyle>
                    <div style={{ marginTop: 20 }} />
                    <SketchPicker
                      onChange={color => updateField('text_color', color.hex)}
                      color={formFields.text_color}
                    />
                  </div>
                  <div>
                    <TextStyle variation='strong'>
                      Select Error Background Color
                    </TextStyle>
                    <div style={{ marginTop: 20 }} />
                    <SketchPicker
                      onChange={color =>
                        updateField('background_color', color.hex)
                      }
                      color={formFields.background_color}
                    />
                  </div>
                </div>
              </Card>
            </Layout.Section>
            <Layout.Section oneHalf>
              <Card title='Error Banner Preview' sectioned>
                <div
                  style={{
                    backgroundColor: formFields.background_color,
                    color: formFields.text_color,
                    padding: 20,
                    borderRadius: 5,
                    marginTop: 30
                  }}
                >
                  {formFields.banner_message}
                </div>
              </Card>
            </Layout.Section>
          </Layout>
          <ManualAddIps updateField={updateField} formFields={formFields} />
        </Layout.AnnotatedSection>
      </Layout>
    </Card.Section>
  )
}
