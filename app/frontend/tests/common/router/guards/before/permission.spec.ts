// Copyright (C) 2012-2022 Zammad Foundation, https://zammad-foundation.org/

import permissionGuard from '@common/router/guards/before/permission'
import useAuthenticationStore from '@common/stores/authentication'
import useSessionStore from '@common/stores/session'
import { createTestingPinia } from '@pinia/testing'
import { RouteLocationNormalized } from 'vue-router'

vi.mock('@common/server/apollo/client', () => {
  return {}
})

const errorRedirect = (route: string) => {
  return {
    name: 'Error',
    params: {
      title: 'Forbidden',
      message: "You don't have the necessary permissions to access this page.",
      statusCode: 403,
      route,
    },
    replace: true,
  }
}

describe('permissionGuard', () => {
  createTestingPinia({ createSpy: vi.fn })

  const from = {} as RouteLocationNormalized

  it('should skip guard for not authenticated user', () => {
    const to = {
      name: 'Test',
      path: '/test',
      meta: {},
    } as RouteLocationNormalized
    const next = vi.fn()

    permissionGuard(to, from, next)

    expect(next).toHaveBeenCalledWith()
  })

  it('should skip guard for no required permission', () => {
    const to = {
      name: 'Test',
      path: '/test',
      meta: {
        requiresAuth: true,
        requiredPermission: null,
      },
    } as RouteLocationNormalized
    const next = vi.fn()

    useAuthenticationStore().authenticated = true

    permissionGuard(to, from, next)

    expect(next).toHaveBeenCalledWith()
  })

  it('should forbid access for user without required permission (redirect error page)', () => {
    const to = {
      name: 'TicketOverview',
      path: '/tickets',
      fullPath: '/tickets',
      meta: {
        requiresAuth: true,
        requiredPermission: ['ticket.agent'],
      },
    } as RouteLocationNormalized
    const next = vi.fn()

    useAuthenticationStore().authenticated = true
    useSessionStore().user = {
      permissions: {
        names: ['example.view'],
      },
      objectAttributeValues: [],
    }

    permissionGuard(to, from, next)

    expect(next).toHaveBeenCalledWith(errorRedirect('/tickets'))
  })

  it('should allow access for user with required permission', () => {
    const to = {
      name: 'TicketOverview',
      path: '/tickets',
      fullPath: '/tickets',
      meta: {
        requiresAuth: true,
        requiredPermission: ['ticket.agent'],
      },
    } as RouteLocationNormalized
    const next = vi.fn()

    useAuthenticationStore().authenticated = true
    useSessionStore().user = {
      permissions: {
        names: ['ticket.agent'],
      },
      objectAttributeValues: [],
    }

    permissionGuard(to, from, next)

    expect(next).toHaveBeenCalledWith()
  })
})