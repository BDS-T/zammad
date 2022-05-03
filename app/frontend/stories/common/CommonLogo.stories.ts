// Copyright (C) 2012-2022 Zammad Foundation, https://zammad-foundation.org/

import CommonLogo from '@common/components/common/CommonLogo.vue'
import useApplicationStore from '@common/stores/application'
import { Story } from '@storybook/vue3'

interface Args {
  isCustomLogo: boolean
}

export default {
  title: 'Common/Logo',
  component: CommonLogo,
}

const Template: Story<Args> = (args: Args) => ({
  components: { CommonLogo },
  setup() {
    const application = useApplicationStore()
    if (args.isCustomLogo) {
      application.config.product_logo = 'icons/logotype.svg'
    } else {
      application.config.product_logo = undefined
    }
    return { args }
  },
  template: '<CommonLogo />',
})

export const DefaultLogo = Template.bind({})

export const CustomLogo = Template.bind({})
CustomLogo.args = {
  isCustomLogo: true,
}