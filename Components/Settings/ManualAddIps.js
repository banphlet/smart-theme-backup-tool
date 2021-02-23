import { Layout, TextField } from '@shopify/polaris'
import React from 'react'





export default function ManualAddIps({ formFields, updateField }) {
    return (
        <div style={{ marginTop: 20 }}>
            <Layout>
                <Layout.Section oneHalf>
                    <TextField
                        label='Blacklist IP Addresses'
                        helpText='Add some IP Addresses to blacklist. Enter one IP per line'
                        type='text'
                        value={formFields.blacklisted_ips}
                        onChange={value => updateField('blacklisted_ips', value)}
                        multiline={10}
                    />
                </Layout.Section>
            </Layout>
        </div>

    )
}