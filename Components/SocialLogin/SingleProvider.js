import { Checkbox, Tooltip } from '@shopify/polaris'
import React from 'react'

export default function SingleProvider ({
  provider,
  formFields,
  shop,
  updateField,
  createCharge
}) {
  const hasProvider = formFields?.social_platforms?.includes(provider)
  const canUpdateSettings = !/free/gi.test(shop.plan.name)
  return (
    <div
      key={provider}
      style={{
        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
        transition: 0.3,
        width: '90px',
        textAlign: 'center',
        margin: 10
      }}
    >
      <Tooltip active={false} content={provider}>
        <a
          className={`fab social-no-text fa-${provider}`}
          style={{ width: '100%' }}
        ></a>
      </Tooltip>

      {canUpdateSettings ? (
        <Checkbox
          label={hasProvider ? 'Showing' : 'Hidden'}
          checked={hasProvider}
          onChange={state =>
            updateField(
              'social_platforms',
              state
                ? [...formFields?.social_platforms, provider]
                : formFields.social_platforms?.filter(p => p !== provider)
            )
          }
        />
      ) : (
        <Button onClick={createCharge} destructive>
          Upgrade
        </Button>
      )}
    </div>
  )
}
