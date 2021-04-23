<?php
/**
 * Copyright since 2007 PrestaShop SA and Contributors
 * PrestaShop is an International Registered Trademark & Property of PrestaShop SA
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Academic Free License version 3.0
 * that is bundled with this package in the file LICENSE.md.
 * It is also available through the world-wide-web at this URL:
 * https://opensource.org/licenses/AFL-3.0
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@prestashop.com so we can send you a copy immediately.
 *
 * @author    PrestaShop SA and Contributors <contact@prestashop.com>
 * @copyright Since 2007 PrestaShop SA and Contributors
 * @license   https://opensource.org/licenses/AFL-3.0 Academic Free License version 3.0
 */
use PrestaShop\Module\Ps_googleshopping\Translations\PsGoogleShoppingTranslations;
use PrestaShop\PsAccountsInstaller\Installer\Facade\PsAccounts;

class AdminPsgoogleshoppingModuleController extends ModuleAdminController
{
    /** @var Ps_googleshopping */
    public $module;

    public function __construct()
    {
        parent::__construct();
        $this->bootstrap = false;
    }

    public function initContent()
    {
        $this->context->smarty->assign([
            'pathApp' => $this->module->getPathUri() . 'views/js/app.js',
            'psGoogleShoppingControllerLink' => $this->context->link->getAdminLink('AdminAjaxPsgoogleshopping'),
            'chunkVendor' => $this->module->getPathUri() . 'views/js/chunk-vendors.js',
        ]);

        try {
            $psAccountsService = $this->module->getService(PsAccounts::class)->getPsAccountsService();
            $psAccountShopId = $psAccountsService->getShopUuidV4();
        } catch (Exception $e) {
            $psAccountShopId = null;
        }

        Media::addJsDef([
            'contextPsAccounts' => (object) $this->module->getService(PsAccounts::class)
            ->getPsAccountsPresenter()
            ->present($this->module->name),
            'translations' => (new PsGoogleShoppingTranslations($this->module))->getTranslations(),
            'i18nSettings' => [
                'isoCode' => $this->context->language->iso_code,
                'languageLocale' => $this->context->language->language_code,
            ],
            'psGoogleRetrieveFaq' => $this->context->link->getAdminLink(
                'AdminAjaxPsgoogleshopping',
                true,
                [],
                [
                    'action' => 'RetrieveFaq',
                    'ajax' => 1,
                ]
            ),
            'psGoogleCallEventBus' => $this->context->link->getAdminLink(
                'AdminAjaxPsgoogleshopping',
                true,
                [],
                [
                    'ajax' => 1,
                ]
            ),
            'psAccountShopId' => $psAccountShopId,
        ]);

        $this->content = $this->context->smarty->fetch($this->module->getLocalPath() . '/views/templates/admin/app.tpl');

        parent::initContent();
    }

    public function postProcess()
    {
    }
}