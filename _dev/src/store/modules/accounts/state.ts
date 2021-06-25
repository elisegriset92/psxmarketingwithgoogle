/**
 * 2007-2021 PrestaShop and Contributors
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Academic Free License 3.0 (AFL-3.0)
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * https://opensource.org/licenses/AFL-3.0
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@prestashop.com so we can send you a copy immediately.
 *
 * @author    PrestaShop SA <contact@prestashop.com>
 * @copyright 2007-2021 PrestaShop SA and Contributors
 * @license   https://opensource.org/licenses/AFL-3.0 Academic Free License 3.0 (AFL-3.0)
 * International Registered Trademark & Property of PrestaShop SA
 */

import {content_v2_1 as contentApi} from '@googleapis/content/v2.1';
import {oauth2_v2 as oauthApi} from '@googleapis/oauth2/v2';

export interface PrestaShopAccountsContext {
  user: {
    email: string|null,
    emailIsValidated: boolean,
    isSuperAdmin: boolean,
  },
  currentShop: {
      id: string;
      name: string;
      domain: string;
      domainSsl: string;
      url: string;
  },
  isShopContext: boolean,
  shops: object[],
}

export interface GoogleMerchantAccount extends contentApi.Schema$Account {
  aggregatorId?: string;
  aggregatorName?: string;
  subAccountNotManagedByPrestashop?: boolean;
}

export interface GoogleAccount {
  details: oauthApi.Schema$Userinfo,
  mcaSelectionOptions: GoogleMerchantAccount[] | null,
}

export interface GoogleAccountToken {
  // eslint-disable-next-line camelcase
  access_token: string|Error,
  // eslint-disable-next-line camelcase
  expiry_date: number,
}

export type GoogleAccountContext = GoogleAccount
& GoogleAccountToken & {
  authenticationUrl: string|Error,
  connectedOnce: boolean,

  from?: string,
  message?: string,
  status?: string,
}

export type MerchantCenterAccountContext = GoogleMerchantAccount & {
  // Allow the spinner to be displayed while claiming is done
  isVerified: boolean,
  isClaimed: boolean,
  isSuspended: boolean,
  isEnhancedFreeListingCompliant: boolean,
  gmcStatus: WebsiteClaimErrorReason|null,
  websiteRequirements: any,
  // Display toast component once
  connectedOnce: boolean,
};

export interface State {
  psAccountShopInConflict: boolean,
  contextPsAccounts: PrestaShopAccountsContext|any;
  shopIdPsAccounts: string;
  tokenPsAccounts: string;
  googleAccount: GoogleAccountContext;
  googleMerchantAccount: MerchantCenterAccountContext;
}

export enum WebsiteClaimErrorReason {
  // States with warnings
  LinkingFailed = 'LinkingFailed',
  ShopInfoMissing = 'ShopInfoMissing',
  OverwriteNeeded = 'OverwriteNeeded',
  AccountValidationFailed = 'AccountValidationFailed',
  OverwriteNeededWithManualAction = 'OverwriteNeededWithManualAction',
  UnlinkFailed = 'UnlinkFailed',
  IneligibleForFreeListing = 'IneligibleForFreeListing',
  // States with errors
  Suspended = 'Suspended',
}

export const state: State = {
  psAccountShopInConflict: false,
  contextPsAccounts: {},
  shopIdPsAccounts: '',
  tokenPsAccounts: '',
  googleAccount: {
    access_token: '',
    expiry_date: 0,
    details: {},
    mcaSelectionOptions: null,
    authenticationUrl: '',
    connectedOnce: false,
  },
  googleMerchantAccount: {
    id: null,
    isVerified: false,
    isClaimed: false,
    isSuspended: false,
    isEnhancedFreeListingCompliant: true,
    gmcStatus: null,
    users: [],
    connectedOnce: false,
    websiteRequirements: [],
  },
};
