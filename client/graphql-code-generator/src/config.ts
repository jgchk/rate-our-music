import { RawClientSideBasePluginConfig } from '@graphql-codegen/visitor-plugin-common'

/**
 * This plugin generate a generic SDK (without any Requester implemented), allow you to easily customize the way you fetch your data, without loosing the strongly-typed integration.
 */
export type RawGenericSdkPluginConfig = RawClientSideBasePluginConfig
