/** @jsxRuntime automatic */
/** @jsxImportSource hono/jsx */
import { PREDEFINED_RULE_SETS, UNIFIED_RULES } from '../config/index.js';
import { CustomRules } from './CustomRules.jsx';
import { TextareaWithActions } from './TextareaWithActions.jsx';
import { ValidatedTextarea } from './ValidatedTextarea.jsx';
import { formLogicFn } from './formLogic.js';

const LINK_FIELDS = [
  { key: 'xray', labelKey: 'xrayLink' },
  { key: 'singbox', labelKey: 'singboxLink' },
  { key: 'clash', labelKey: 'clashLink' },
  { key: 'surge', labelKey: 'surgeLink' }
];

export const Form = (props) => {
  const { t, lang } = props;

  const translations = {
    processing: t('processing'),
    convert: t('convert'),
    saveConfigSuccess: t('saveConfigSuccess'),
    saveConfig: t('saveConfig'),
    savingConfig: t('savingConfig'),
    configContentRequired: t('configContentRequired'),
    configSaveFailed: t('configSaveFailed'),
    confirmClearConfig: t('confirmClearConfig'),
    confirmClearAll: t('confirmClearAll'),
    errorGeneratingLinks: t('errorGeneratingLinks'),
    shortenLinks: t('shortenLinks'),
    shortening: t('shortening'),
    alreadyShortened: t('alreadyShortened'),
    shortenFailed: t('shortenFailed'),
    customShortCode: t('customShortCode'),
    optional: t('optional'),
    customShortCodePlaceholder: t('customShortCodePlaceholder'),
    showFullLinks: t('showFullLinks'),
    copy: t('copy'),
    subscriptionAndConfig: t('subscriptionAndConfig'),
    configContent: t('configContent'),
    shortUrlActive: t('shortUrlActive'),
    previewConfig: t('previewConfig'),
    loadingPreview: t('loadingPreview'),
    copyContent: t('copyContent'),
    downloadConfig: t('downloadConfig'),
    refreshPreview: t('refreshPreview'),
    previewFailed: t('previewFailed')
  };

  const scriptContent = `
    window.APP_TRANSLATIONS = ${JSON.stringify(translations)};
    window.PREDEFINED_RULE_SETS = ${JSON.stringify(PREDEFINED_RULE_SETS)};
    window.APP_LANG = ${JSON.stringify(lang || 'zh-CN')};
    if (typeof __name === 'undefined') { var __name = function(fn) { return fn; }; }
    (${formLogicFn.toString()})();
  `;

  return (
    <div x-data="formData()" x-init="init()" class="w-full">
      <form {...{'x-on:submit.prevent': 'submitForm'}} class="w-full space-y-6">
        {/* Top: Input Source (Full-width, fixed 2 lines) */}
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 sm:p-6 transition-all duration-300 hover:shadow-md group">
          <TextareaWithActions
            id="input"
            name="input"
            label={t('shareUrls')}
            labelPrefix={
              <span class="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                <i class="fas fa-link text-sm"></i>
              </span>
            }
            model="input"
            rows={2}
            textareaClass="!resize-none text-xs sm:text-sm leading-relaxed"
            placeholder={t('urlPlaceholder')}
            required
            labelActionsWrapperClass="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            labelActions={[
              {
                key: 'paste',
                icon: 'fas fa-paste',
                label: t('paste'),
                hideLabelOnMobile: true,
                className:
                  'px-2.5 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center gap-1 cursor-pointer',
                title: t('paste'),
                attrs: {
                  'x-on:click': "navigator.clipboard.readText().then(text => input = text).catch(() => {})"
                }
              },
              {
                key: 'clear',
                icon: 'fas fa-times',
                label: t('clear'),
                hideLabelOnMobile: true,
                className:
                  'px-2.5 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center gap-1 cursor-pointer',
                title: t('clear'),
                attrs: {
                  'x-on:click': "input = ''",
                  'x-show': 'input'
                }
              }
            ]}
          />
        </div>

        {/* Middle: 2 Columns for Options */}
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Column 1 (Left): Rule Selection + General Settings & UA */}
          <div class="space-y-6">
            {/* Rule Selection Card */}
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4">
              <div class="flex items-center justify-between pb-1 border-b border-gray-100 dark:border-gray-700/60">
                <h3 class="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <span class="w-7 h-7 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                    <i class="fas fa-filter text-xs"></i>
                  </span>
                  {t('ruleSelection')}
                </h3>
                <select
                  x-model="selectedPredefinedRule"
                  x-on:change="applyPredefinedRule()"
                  class="px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-xs font-medium text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-pointer"
                >
                  <option value="custom">{t('custom')}</option>
                  <option value="minimal">{t('minimal')}</option>
                  <option value="balanced">{t('balanced')}</option>
                  <option value="comprehensive">{t('comprehensive')}</option>
                </select>
              </div>

              <div class="grid grid-cols-2 gap-2">
                {UNIFIED_RULES.map((rule) => (
                  <label class="flex items-center p-2.5 rounded-xl border border-gray-200/80 dark:border-gray-700/80 hover:bg-gray-50 dark:hover:bg-gray-700/40 cursor-pointer transition-colors group select-none">
                    <input
                      type="checkbox"
                      value={rule.name}
                      x-model="selectedRules" 
                      x-on:change="selectedPredefinedRule = 'custom'"
                      class="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
                    />
                    <span class="ml-2.5 text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors truncate">
                      {t(`outboundNames.${rule.name}`)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* General Settings + UA Card */}
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4">
              <div class="flex items-center justify-between pb-1 border-b border-gray-100 dark:border-gray-700/60">
                <h3 class="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <span class="w-7 h-7 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                    <i class="fas fa-sliders-h text-xs"></i>
                  </span>
                  {t('generalSettings')}
                </h3>
              </div>

              <div class="space-y-2.5">
                {/* Group by Country */}
                <label class="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/80 dark:bg-gray-700/30 hover:bg-gray-100/80 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
                  <div class="flex flex-col">
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{t('groupByCountry')}</span>
                    <span class="text-[11px] text-gray-400 dark:text-gray-500">{t('groupByCountryTip')}</span>
                  </div>
                  <div class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" x-model="groupByCountry" class="sr-only peer" />
                    <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                  </div>
                </label>

                {/* Include Auto Select */}
                <label class="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/80 dark:bg-gray-700/30 hover:bg-gray-100/80 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{t('includeAutoSelect')}</span>
                  <div class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" x-model="includeAutoSelect" class="sr-only peer" />
                    <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                  </div>
                </label>

                {/* Enable Clash UI */}
                <label class="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/80 dark:bg-gray-700/30 hover:bg-gray-100/80 dark:hover:bg-gray-700/50 transition-colors cursor-pointer">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{t('enableClashUI')}</span>
                  <div class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" x-model="enableClashUI" class="sr-only peer" />
                    <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                  </div>
                </label>

                {/* Clash UI Expandable Options */}
                <div
                  x-show="enableClashUI"
                  {...{
                    'x-transition:enter': 'transition ease-out duration-200',
                    'x-transition:enter-start': 'opacity-0 transform -translate-y-2',
                    'x-transition:enter-end': 'opacity-100 transform translate-y-0',
                    'x-transition:leave': 'transition ease-in duration-150',
                    'x-transition:leave-start': 'opacity-100 transform translate-y-0',
                    'x-transition:leave-end': 'opacity-0 transform -translate-y-2'
                  }}
                  class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1"
                >
                  <div>
                    <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{t('externalController')}</label>
                    <input type="text" x-model="externalController" class="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono" placeholder={t('externalControllerPlaceholder')} />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{t('externalUiDownloadUrl')}</label>
                    <input type="text" x-model="externalUiDownloadUrl" class="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono" placeholder={t('externalUiDownloadUrlPlaceholder')} />
                  </div>
                </div>

                {/* Custom UA (Merged compactly here) */}
                <div class="pt-2">
                  <div class="flex items-center justify-between mb-1.5">
                    <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                      <i class="fas fa-user-secret text-gray-400 text-xs"></i>
                      <span>{t('UASettings')}</span>
                    </label>
                    <span class="text-[11px] text-gray-400 dark:text-gray-500">{t('UAtip')}</span>
                  </div>
                  <input 
                    type="text" 
                    x-model="customUA" 
                    class="w-full px-3.5 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono" 
                    placeholder="curl/7.74.0" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Column 2 (Right): Advanced Customization (Tabs: CustomRules / BaseConfig / Subconverter) */}
          <div class="space-y-6">
            <div x-data="{ advancedTab: 'rules' }" class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4">
              <div class="flex items-center justify-between pb-1 border-b border-gray-100 dark:border-gray-700/60">
                <h3 class="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <span class="w-7 h-7 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                    <i class="fas fa-layer-group text-xs"></i>
                  </span>
                  {t('advancedOptions')}
                </h3>

                {/* Tabs */}
                <div class="flex items-center gap-1 p-0.5 bg-gray-100 dark:bg-gray-900 rounded-lg text-xs font-medium">
                  <button
                    type="button"
                    x-on:click="advancedTab = 'rules'"
                    class="px-2.5 py-1 rounded-md transition-all cursor-pointer whitespace-nowrap"
                    x-bind:class="advancedTab === 'rules' ? 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 shadow-xs' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
                  >
                    {t('customRulesSection')}
                  </button>
                  <button
                    type="button"
                    x-on:click="advancedTab = 'baseConfig'"
                    class="px-2.5 py-1 rounded-md transition-all cursor-pointer whitespace-nowrap"
                    x-bind:class="advancedTab === 'baseConfig' ? 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 shadow-xs' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
                  >
                    {t('baseConfigSettings')}
                  </button>
                  <button
                    type="button"
                    x-on:click="advancedTab = 'subconverter'"
                    class="px-2.5 py-1 rounded-md transition-all cursor-pointer whitespace-nowrap"
                    x-bind:class="advancedTab === 'subconverter' ? 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 shadow-xs' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
                  >
                    Subconverter
                  </button>
                </div>
              </div>

              {/* Tab 1: Custom Rules */}
              <div x-show="advancedTab === 'rules'">
                <CustomRules t={t} embedded={true} />
              </div>

              {/* Tab 2: Base Config */}
              <div x-show="advancedTab === 'baseConfig'" class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-xs text-gray-500 dark:text-gray-400">{t('baseConfigSettings')}</span>
                  <select x-model="configType" class="px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-xs font-medium text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    <option value="singbox">SingBox (JSON)</option>
                    <option value="clash">Clash (YAML)</option>
                    <option value="surge">Surge (JSON/INI)</option>
                  </select>
                </div>
                
                <ValidatedTextarea
                  id="configEditor"
                  name="configEditor"
                  model="configEditor"
                  rows={5}
                  placeholder="Paste your custom config here..."
                  variant="mono"
                  containerClass="mt-0 group"
                  labelWrapperClass="flex items-center justify-end mb-2"
                  labelActionsWrapperClass="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  pasteLabel={t('paste')}
                  clearLabel={t('clear')}
                  validation={{
                    button: {
                      key: 'validate-config',
                      label: t('validateConfig'),
                      className:
                        'px-2.5 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center gap-1.5 cursor-pointer',
                      attrs: {
                        'x-on:click': 'validateBaseConfig()'
                      }
                    },
                    success: {
                      show: "configValidationState === 'success'",
                      textExpr: 'configValidationMessage'
                    },
                    error: {
                      show: "configValidationState === 'error'",
                      textExpr: 'configValidationMessage'
                    }
                  }}
                  inlineActionsWrapperClass="absolute bottom-3 right-3 flex gap-2"
                  preserveLabelSpace={false}
                />
                
                <div class="flex justify-end gap-2.5 pt-1">
                  <button 
                    type="button" 
                    x-on:click="saveBaseConfig()" 
                    x-bind:disabled="savingConfig"
                    class="px-3.5 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium text-xs disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
                  >
                    <i class="fas" x-bind:class="savingConfig ? 'fa-spinner fa-spin' : 'fa-save'"></i>
                    <span x-text="savingConfig ? savingConfigText : saveConfigText">{t('saveConfig')}</span>
                  </button>
                  <button type="button" x-on:click="clearBaseConfig()" class="px-3.5 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors font-medium text-xs cursor-pointer" >
                    {t('clearConfig')}
                  </button>
                </div>
              </div>

              {/* Tab 3: Subconverter Config */}
              <div x-show="advancedTab === 'subconverter'" class="space-y-3">
                <p class="text-xs text-gray-500 dark:text-gray-400">{t('subconverterConfigDesc')}</p>
                <div class="px-3.5 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 font-mono text-xs text-gray-600 dark:text-gray-400 break-all select-all">
                  <p x-text="getSubconverterUrl()"></p>
                </div>
                <div class="flex justify-end">
                  <button
                    type="button"
                    x-on:click="copySubconverterUrl()"
                    class="px-3.5 py-1.5 rounded-lg transition-colors font-medium text-xs flex items-center gap-1.5 cursor-pointer"
                    x-bind:class="subconverterCopied ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'"
                  >
                    <i class="fas" x-bind:class="subconverterCopied ? 'fa-check' : 'fa-copy'"></i>
                    <span x-text={`subconverterCopied ? '${t('copiedSubconverterUrl')}' : '${t('copySubconverterUrl')}'`}></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div class="flex flex-col sm:flex-row gap-3 pt-1">
          <button 
            type="submit" 
            class="flex-1 py-3.5 px-6 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white rounded-xl font-bold shadow-lg shadow-primary-500/25 hover:shadow-primary-500/35 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            x-bind:disabled="loading"
          >
            <i class="fas" x-bind:class="loading ? 'fa-spinner fa-spin' : 'fa-sync-alt'"></i>
            <span x-text="loading ? processingText : convertText">{t('convert')}</span>
          </button>

          <button
            type="button" 
            x-on:click="clearAll()"
            class="px-6 py-3.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <i class="fas fa-trash-alt text-xs"></i>
            <span>{t('clear')}</span>
          </button>
        </div>
      </form>

      {/* Bottom: Results Section / Preview (Full Width) */}
      <div
        x-cloak
        x-show="generatedLinks"
        id="results-section"
        x-data="{ copied: null }"
        {...{
          'x-transition:enter': 'transition ease-out duration-300',
          'x-transition:enter-start': 'opacity-0 transform translate-y-4',
          'x-transition:enter-end': 'opacity-100 transform translate-y-0'
        }}
        class="w-full mt-8"
      >
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 transition-all duration-300 hover:shadow-md space-y-6">
          
          {/* 1. 最上层：标题与格式切换 Tab */}
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-700">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span class="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                <i class="fas fa-layer-group text-sm"></i>
              </span>
              {t('subscriptionAndConfig')}
            </h2>

            {/* 格式切换 Tabs */}
            <div class="flex items-center gap-1.5 p-1 bg-gray-100 dark:bg-gray-900 rounded-xl overflow-x-auto">
              <button
                type="button"
                x-on:click="switchPreviewTab('clash')"
                class="px-4 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
                x-bind:class="previewFormat === 'clash' ? 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
              >
                <span>Clash</span>
                <span class="text-[10px] opacity-70 font-mono">(YAML)</span>
              </button>
              <button
                type="button"
                x-on:click="switchPreviewTab('singbox')"
                class="px-4 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
                x-bind:class="previewFormat === 'singbox' ? 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
              >
                <span>SingBox</span>
                <span class="text-[10px] opacity-70 font-mono">(JSON)</span>
              </button>
              <button
                type="button"
                x-on:click="switchPreviewTab('surge')"
                class="px-4 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
                x-bind:class="previewFormat === 'surge' ? 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
              >
                <span>Surge</span>
                <span class="text-[10px] opacity-70 font-mono">(CONF)</span>
              </button>
              <button
                type="button"
                x-on:click="switchPreviewTab('xray')"
                class="px-4 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
                x-bind:class="previewFormat === 'xray' ? 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
              >
                <span>Xray</span>
                <span class="text-[10px] opacity-70 font-mono">(Base64)</span>
              </button>
            </div>
          </div>

          {/* 2. 下面：链接与短链管理 */}
          <div class="space-y-4 bg-gray-50/70 dark:bg-gray-900/40 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
            {/* 当前格式的订阅链接展示与复制 */}
            <div class="relative group">
              <div class="flex items-center justify-between mb-1.5">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  <span class="uppercase font-semibold text-primary-600 dark:text-primary-400" x-text="previewFormat"></span> {t('subscriptionLinks')}
                </label>
                <span
                  x-show="shortenedLinks"
                  class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800"
                >
                  {t('shortUrlActive')}
                </span>
              </div>
              <div class="flex gap-2">
                <input
                  type="text"
                  readonly
                  x-bind:value="shortenedLinks ? shortenedLinks[previewFormat] : (generatedLinks ? generatedLinks[previewFormat] : '')"
                  class="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:border-transparent transition-all duration-200 font-mono text-sm"
                  x-bind:class="shortenedLinks ? 'text-primary-600 dark:text-primary-400 font-semibold focus:ring-primary-500' : 'text-gray-700 dark:text-gray-300 focus:ring-green-500'"
                />
                <button
                  type="button"
                  x-on:click="navigator.clipboard.writeText((shortenedLinks || generatedLinks)[previewFormat]); copied = previewFormat; setTimeout(() => copied = null, 2000)"
                  class="px-5 py-2.5 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium cursor-pointer shadow-xs"
                  x-bind:class="{
                    'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700': copied !== previewFormat,
                    'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800': copied === previewFormat
                  }"
                >
                  <i class="fas" x-bind:class="copied === previewFormat ? 'fa-check' : 'fa-copy'"></i>
                  <span x-text="copied === previewFormat ? window.APP_TRANSLATIONS.copied : window.APP_TRANSLATIONS.copy"></span>
                </button>
              </div>
            </div>

            {/* 短链管理 */}
            <div class="pt-1 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div class="w-full sm:flex-1 max-w-md">
                <input
                  type="text"
                  x-model="customShortCode"
                  placeholder={t('customShortCodePlaceholder')}
                  class="w-full px-3.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <button
                type="button"
                x-on:click="shortenedLinks ? shortenedLinks = null : shortenLinks()"
                x-bind:disabled="!shortenedLinks && shortening"
                class="w-full sm:w-auto px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer shadow-xs"
                x-bind:class="shortenedLinks
                  ? 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                  : 'bg-primary-600 hover:bg-primary-700 text-white shadow-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed'"
              >
                <i
                  class="fas"
                  x-bind:class="shortenedLinks ? 'fa-expand-alt' : (shortening ? 'fa-spinner fa-spin' : 'fa-compress-alt')"
                ></i>
                <span
                  x-text="shortenedLinks ? showFullLinksText : (shortening ? shorteningText : shortenLinksText)"
                ></span>
              </button>
            </div>
          </div>

          {/* 3. 再下面：配置文件内容 */}
          <div class="space-y-3 pt-2">
            <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div class="flex items-center gap-2">
                <span class="font-semibold text-gray-800 dark:text-gray-200">{t('configContent')}</span>
                <span class="font-mono uppercase px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium" x-text="previewFormat"></span>
                <span x-show="previewCache[previewFormat]" x-text="`${(previewCache[previewFormat] || '').split('\\n').length} 行`"></span>
              </div>
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  x-on:click="fetchPreview(previewFormat)"
                  x-bind:disabled="previewLoading"
                  class="px-2.5 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-1.5 cursor-pointer"
                  title={t('refreshPreview')}
                >
                  <i class="fas fa-sync-alt" x-bind:class="previewLoading ? 'fa-spin' : ''"></i>
                  <span class="hidden sm:inline">{t('refreshPreview')}</span>
                </button>
                <button
                  type="button"
                  x-on:click="copyPreviewContent()"
                  x-bind:disabled="!previewCache[previewFormat] || previewLoading"
                  class="px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  x-bind:class="copiedPreview ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'"
                >
                  <i class="fas" x-bind:class="copiedPreview ? 'fa-check' : 'fa-copy'"></i>
                  <span x-text="copiedPreview ? window.APP_TRANSLATIONS.copied : window.APP_TRANSLATIONS.copyContent"></span>
                </button>
                <button
                  type="button"
                  x-on:click="downloadPreviewConfig()"
                  x-bind:disabled="!previewCache[previewFormat] || previewLoading"
                  class="px-2.5 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  title={t('downloadConfig')}
                >
                  <i class="fas fa-download"></i>
                  <span class="hidden sm:inline">{t('downloadConfig')}</span>
                </button>
              </div>
            </div>

            {/* 配置文件内容展示区 - 增大高度 */}
            <div class="relative">
              {/* Loading Indicator */}
              <div
                x-show="previewLoading"
                class="w-full h-[560px] rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-900/80 flex flex-col items-center justify-center gap-3"
              >
                <i class="fas fa-spinner fa-spin text-2xl text-primary-500"></i>
                <span class="text-sm font-medium text-gray-600 dark:text-gray-400">{t('loadingPreview')}</span>
              </div>

              {/* Error Indicator */}
              <div
                x-show="!previewLoading && previewError"
                class="w-full h-[560px] rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 p-6 flex flex-col items-center justify-center gap-3 text-center"
              >
                <div class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center">
                  <i class="fas fa-exclamation-triangle"></i>
                </div>
                <p class="text-sm text-red-600 dark:text-red-400 font-medium" x-text="previewError"></p>
                <button
                  type="button"
                  x-on:click="fetchPreview(previewFormat)"
                  class="mt-2 px-4 py-1.5 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded-lg text-xs font-semibold hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors cursor-pointer"
                >
                  <i class="fas fa-redo mr-1"></i> {t('refreshPreview')}
                </button>
              </div>

              {/* Textarea View */}
              <textarea
                x-show="!previewLoading && !previewError"
                readonly
                x-bind:value="previewCache[previewFormat] || ''"
                rows={26}
                class="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-mono text-xs leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all min-h-[480px] h-[560px]"
                placeholder="Waiting for config content..."
              ></textarea>
            </div>
          </div>
        </div>
      </div>

  <script dangerouslySetInnerHTML={{ __html: scriptContent }} />
    </div>
  );
};
