import type { AuthoringNodeItem, StartupProperty } from '@/api/preview'
import { SvgIcon } from '@/components/SvgIcon'
import { usePreview, type ParamType } from '@/hooks/usePreview'
import 'bkui-pipeline/dist/bk-pipeline.css'
import BkPipeline, { type PipelineModel } from 'bkui-pipeline/vue3'
import { Alert, Checkbox, Exception, Input, Loading, Select } from 'bkui-vue'
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import styles from './Preview.module.css'
import PreviewHeader from './PreviewHeader'

// ============================================
// 1. Component Definition
// ============================================

export default defineComponent({
  name: 'FlowPreview',
  setup() {
    const { t } = useI18n()

    // Use the preview composable hook (all business logic encapsulated)
    const {
      // Route params
      isDebugMode,
      
      // UI State
      checkAll,
      selectedNode,
      runMessage,
      canExecute,
      flowName,

      // Authoring nodes
      authoringNodes,
      authoringNodesLoading,
      
      // Grouped params
      groupedParams,
      groupedConstants,
      groupedOtherParams,
      hasGroupedParams,
      hasGroupedConstants,
      hasGroupedOtherParams,
      
      // Atoms count
      selectedAtomsCount,
      
      // Store access
      store,
      
      // Actions
      toggleSection,
      isSectionExpanded,
      handleParamChange,
      handleCheckAllChange,
      handlePipelineChange,
      handleResetDefault,
      handleSaveCurrentParams,
      handleVersionChange,
      handleExecute,
    } = usePreview()

    // ----------------------------------------
    // Render Functions (Pure View Logic)
    // ----------------------------------------

    /**
     * Render grouped param form item (two columns layout)
     */
    const renderGroupedParamFormItem = (
      param: StartupProperty,
      type: ParamType,
      values: Record<string, unknown>,
      disabled = false
    ) => {
      const value = values[param.id]

      return (
        <div class={styles.paramFormItemHalf} key={param.id}>
          <div class={styles.paramLabel}>
            <span class={styles.paramLabelText}>
              {param.id}
              {param.required && <span class={styles.requiredMark}>*</span>}
            </span>
          </div>
          <div class={styles.paramInputWrapper}>
            {param.type === 'BOOLEAN' ? (
              <Checkbox
                modelValue={value === 'true' || value === true}
                disabled={disabled || param.readOnly}
                onChange={(val: boolean) => handleParamChange(type, param.id, val)}
              />
            ) : param.type === 'ENUM' && param.options?.length ? (
              <Select
                modelValue={value}
                clearable={false}
                disabled={disabled || param.readOnly}
                class={styles.fullWidthSelect}
                onChange={(val: string) => handleParamChange(type, param.id, val)}
              >
                {param.options.map(opt => (
                  <Select.Option key={opt.id} value={opt.id} label={opt.name}>
                    <span>{opt.id}</span>
                    {opt.name !== opt.id && <span class={styles.optionLabel}> {opt.name}</span>}
                  </Select.Option>
                ))}
              </Select>
            ) : param.type === 'TEXTAREA' ? (
              <div class={styles.textareaWrapper}>
                <Input
                  type="textarea"
                  modelValue={value as string}
                  disabled={disabled || param.readOnly}
                  placeholder={t('flow.content.descriptionPlaceholder')}
                  rows={3}
                  maxlength={param.maxLength || 100}
                  onChange={(val: string) => handleParamChange(type, param.id, val)}
                />
              </div>
            ) : (
              <Input
                modelValue={value as string}
                disabled={disabled || param.readOnly}
                placeholder={param.defaultValue || ''}
                onChange={(val: string) => handleParamChange(type, param.id, val)}
              />
            )}
          </div>
        </div>
      )
    }

    /**
     * Render param form item (single column)
     */
    const renderParamFormItem = (
      param: StartupProperty,
      type: ParamType,
      values: Record<string, unknown>,
      disabled = false
    ) => {
      const value = values[param.id]

      return (
        <div class={styles.paramFormItem} key={param.id}>
          <div class={styles.paramLabel}>
            <div class={styles.paramLabelText}>
              {param.label || param.id}
              {param.required && <span class={styles.requiredMark}>*</span>}
            </div>
            {param.desc && <div class={styles.paramDesc}>{param.desc}</div>}
          </div>
          <div class={[styles.paramValue, param.isChanged && styles.paramValueChanged]}>
            {param.type === 'BOOLEAN' ? (
              <Checkbox
                modelValue={value === 'true' || value === true}
                disabled={disabled || param.readOnly}
                onChange={(val: boolean) => handleParamChange(type, param.id, val)}
              />
            ) : param.type === 'ENUM' && param.options?.length ? (
              <Select
                modelValue={value}
                disabled={disabled || param.readOnly}
                clearable={false}
                onChange={(val: string) => handleParamChange(type, param.id, val)}
              >
                {param.options.map(opt => (
                  <Select.Option key={opt.id} value={opt.id} label={opt.name} />
                ))}
              </Select>
            ) : param.type === 'TEXTAREA' ? (
              <Input
                type="textarea"
                modelValue={value as string}
                disabled={disabled || param.readOnly}
                rows={3}
                onChange={(val: string) => handleParamChange(type, param.id, val)}
              />
            ) : (
              <Input
                modelValue={value as string}
                disabled={disabled || param.readOnly}
                onChange={(val: string) => handleParamChange(type, param.id, val)}
              />
            )}
          </div>
        </div>
      )
    }

    /**
     * Render param group using details/summary
     */
    const renderParamGroup = (
      groupName: string,
      params: StartupProperty[],
      type: ParamType,
      values: Record<string, unknown>,
      disabled = false
    ) => (
      <div class={styles.paramGroup} key={groupName}>
        <details open>
          <summary class={styles.paramGroupHeader}>
            <span>{groupName}</span>
            <SvgIcon name="angle-down" size={10} />
          </summary>
          <div class={styles.paramGroupContent}>
            {params.map(param => renderGroupedParamFormItem(param, type, values, disabled))}
          </div>
        </details>
      </div>
    )

    /**
     * Render collapse header
     */
    const renderCollapseHeader = (
      sectionId: 1 | 2 | 3 | 4 | 5,
      title: string,
      actions?: () => any
    ) => (
      <header
        class={[
          styles.collapseHeader,
          isSectionExpanded(sectionId) && styles.collapseHeaderExpanded,
        ]}
        onClick={() => toggleSection(sectionId)}
      >
        <SvgIcon
          name="right-shape"
          size={14}
          class={[
            styles.collapseIcon,
            isSectionExpanded(sectionId) && styles.collapseIconExpanded,
          ]}
        />
        {title}
        {actions?.()}
      </header>
    )

    // ----------------------------------------
    // Main Render
    // ----------------------------------------
    return () => (
      <div class={styles.previewPage}>
        {/* Header */}
        <PreviewHeader
          executing={store.executing}
          canExecute={canExecute.value}
          flowName={flowName.value}
          onExecute={handleExecute}
          onVersionChange={handleVersionChange}
        />

        {/* Content */}
        <Loading loading={store.loading} class={styles.previewContent}>
          {/* Debug mode alert */}
          {isDebugMode.value && (
            <Alert theme="warning" class={styles.debugAlert}>
              {t('flow.preview.debugHint')}
            </Alert>
          )}

          {/* Runtime Info Section */}
          <section class={styles.previewSection}>
            {renderCollapseHeader(1, t('flow.preview.runtimeInfo'))}
            {isSectionExpanded(1) && (
              <div class={styles.collapseContent}>
                <div class={styles.runtimeInfoGrid}>
                  {/* Creation Node */}
                  <div class={styles.runtimeInfoItem}>
                    <div class={styles.runtimeInfoLabel}>
                      {t('flow.preview.creationNode')}
                      <span class={styles.requiredMark}>*</span>
                    </div>
                    <Select
                      v-model={selectedNode.value}
                      clearable={false}
                      loading={authoringNodesLoading.value}
                      class={styles.fullWidthSelect}
                      placeholder={t('flow.common.pleaseSelect')}
                    >
                      {authoringNodes.value.map((node: AuthoringNodeItem) => (
                        <Select.Option
                          key={node.agentId}
                          value={node.agentHashId}
                          label={node.displayName || `${node.name} (${node.ip})`}
                          disabled={!node.envEnableNode}
                        >
                          <div class={styles.nodeOption}>
                            <span class={styles.nodeName}>{node.name}</span>
                            <span class={styles.nodeIp}>({node.ip})</span>
                            {!node.agentStatus && (
                              <span class={styles.nodeOffline}>[{t('flow.preview.offline')}]</span>
                            )}
                          </div>
                        </Select.Option>
                      ))}
                    </Select>
                    <div class={styles.runtimeInfoDesc}>
                      {t('flow.preview.creationNodeDesc')}
                    </div>
                  </div>
                  {/* Run Message */}
                  <div class={styles.runtimeInfoItem}>
                    <div class={styles.runtimeInfoLabel}>{t('flow.preview.runMessage')}</div>
                    <Input
                      v-model={runMessage.value}
                      placeholder={t('flow.preview.runMessagePlaceholder')}
                    />
                    <div class={styles.runtimeInfoDesc}>
                      {t('flow.preview.runMessageDesc')}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Input Params Section */}
          <section class={styles.previewSection}>
            {renderCollapseHeader(2, t('flow.preview.inputParams'), () => (
              <div class={styles.headerActions} onClick={(e: Event) => e.stopPropagation()}>
                <span class={styles.textLink} onClick={handleResetDefault}>
                  {t('flow.preview.resetDefault')}
                </span>
                <span class={styles.divider}>|</span>
                <span class={styles.textLink} onClick={handleSaveCurrentParams}>
                  {t('flow.preview.saveCurrentParams')}
                </span>
              </div>
            ))}
            {isSectionExpanded(2) && (
              <div class={styles.collapseContent}>
                {hasGroupedParams.value ? (
                  // Grouped params by category
                  Object.entries(groupedParams.value).map(([groupName, params]) =>
                    renderParamGroup(groupName, params, 'params', store.paramsValues)
                  )
                ) : store.hasPipelineParams ? (
                  <>
                    {/* Version params */}
                    {store.isVisibleVersion &&
                      store.versionParamList.map(param =>
                        renderParamFormItem(param, 'versionParam', store.versionParamValues)
                      )}
                    {/* Regular params */}
                    {store.paramList.map(param =>
                      renderParamFormItem(param, 'params', store.paramsValues)
                    )}
                  </>
                ) : (
                  <Exception type="empty" scene="part">
                    {t('flow.preview.noParams')}
                  </Exception>
                )}
              </div>
            )}
          </section>

          {/* Constant params section */}
          {store.constantParams.length > 0 && (
            <section class={styles.previewSection}>
              {renderCollapseHeader(3, t('flow.preview.constants'))}
              {isSectionExpanded(3) && (
                <div class={styles.collapseContent}>
                  {hasGroupedConstants.value ? (
                    // Grouped constants by category
                    Object.entries(groupedConstants.value).map(([groupName, params]) =>
                      renderParamGroup(groupName, params, 'constant', store.constantValues, true)
                    )
                  ) : (
                    // Non-grouped constants
                    store.constantParams.map(param =>
                      renderParamFormItem(param, 'constant', store.constantValues, true)
                    )
                  )}
                </div>
              )}
            </section>
          )}

          {/* Other params section */}
          {store.hasOtherParams && (
            <section class={styles.previewSection}>
              {renderCollapseHeader(4, t('flow.preview.otherParams'))}
              {isSectionExpanded(4) && (
                <div class={styles.collapseContent}>
                  {hasGroupedOtherParams.value ? (
                    // Grouped other params by category (read-only)
                    Object.entries(groupedOtherParams.value).map(([groupName, params]) =>
                      renderParamGroup(groupName, params, 'other', store.otherValues, true)
                    )
                  ) : (
                    // Non-grouped other params (read-only)
                    <>
                      {/* Version params (if not visible in build params) */}
                      {!store.isVisibleVersion &&
                        store.versionParamList.map(param =>
                          renderParamFormItem(param, 'versionParam', store.versionParamValues, true)
                        )}
                      {/* Other params */}
                      {store.otherParams.map(param =>
                        renderParamFormItem(param, 'other', store.otherValues, true)
                      )}
                    </>
                  )}
                </div>
              )}
            </section>
          )}

          {/* Select execution plugins section */}
          <section class={styles.previewSection}>
            {renderCollapseHeader(
              5,
              t(store.canElementSkip ? 'flow.preview.atomsToExecute' : 'flow.preview.executeSteps'),
              () =>
                store.canElementSkip ? (
                  <div
                    class={styles.headerActionsInline}
                    onClick={(e: Event) => e.stopPropagation()}
                  >
                    <Checkbox modelValue={checkAll.value} onChange={handleCheckAllChange}>
                      {t('flow.preview.selectAll')}
                    </Checkbox>
                    <span class={styles.atomsCountText}>
                      {t('flow.preview.selected', {
                        selected: selectedAtomsCount.value.selected,
                        total: selectedAtomsCount.value.total,
                      })}
                    </span>
                  </div>
                ) : null
            )}
            {isSectionExpanded(5) && (
              <div class={[styles.collapseContent, styles.pipelinePreviewSection]}>
                {store.pipelineModel?.stages && store.pipelineModel.stages.length > 0 ? (
                  <BkPipeline
                    isPreview={true}
                    pipeline={store.pipelineModel as PipelineModel}
                    editable={false}
                    canSkipElement={store.canElementSkip}
                    onChange={handlePipelineChange}
                  />
                ) : (
                  <Exception type="empty" scene="part">
                    {t('flow.preview.noPipelineStages')}
                  </Exception>
                )}
              </div>
            )}
          </section>
        </Loading>
      </div>
    )
  },
})
