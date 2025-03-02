import Vue, {VNode} from 'vue';

declare global {
  // namespace JSX {
  //   // tslint:disable no-empty-interface
  //   interface Element extends VNode {}
  //   // tslint:disable no-empty-interface
  //   interface ElementClass extends Vue {}

    interface Window {
      psxMtgWithGoogleDefaultShopCountry: Array<string>,
      contextPsAccounts: any;
      translations: any;
      i18nSettings: any;
      psxMktgWithGoogleApiUrl: String;
      psxMktgWithGoogleAdminUrl: String;
      psxMktgWithGoogleShopUrl: String;
      shopIdPsAccounts: String;
      tokenPsAccounts: String;
      psxMktgWithGoogleModuleVersion: String,
      psVersion: String,
      psxMktgWithGoogleSegmentId: String,
      psxMktgWithGoogleAdminAjaxUrl: String,
      isCountryMemberOfEuropeanUnion: boolean,
      psxMktgWithGoogleShopCurrency: any,
      psxMktgWithGoogleMaintenanceSettingsUrl: String,
      psxMktgWithGoogleCarriersUrl?: String,
      psxMktgWithGoogleAttributesUrl?: String,
      psxMktgWithGoogleProductDetailUrl: String,
      psxMktgWithGoogleStoreSettingsUrl: String,
      psxMktgWithGoogleOnProductionEnvironment:boolean,
    }
  //   interface IntrinsicElements {
  //     [elem: string]: any;
  //   }
  // }
}
