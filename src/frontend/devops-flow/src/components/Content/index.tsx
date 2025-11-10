import { useI18n } from "vue-i18n";
import { defineComponent } from "vue";
import { Button, Input, Dropdown, Dialog } from "bkui-vue";
import styles from "./Content.module.css";
import { FlowTable } from "./FlowTable";
import { SvgIcon } from "@/components/SvgIcon";
import ImportFlowPopup from '@/components/ImportFlowPopup'
import NewFlowPopup from './NewFlowPopup'
import { useContentData } from '@/hooks/useContentData'

export const Content = defineComponent({
  name: "Content",
  components: {
    SvgIcon,
    ImportFlowPopup,
    NewFlowPopup,
    FlowTable
  },
  props: {
    groupId: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const { t } = useI18n();
    const {
      pagination,
      tableLoading,
      flowTableList,
      isShowEnableDialog,
      isShowAddToDialog,
      isShowCopyDialog,
      isShowSaveAsTemplateDialog,
      isShowDeleteDialog,
      currentActionData,
      
      sortList,
      newFlowList,
      sortShow,
      currentSortType,
      currentCollation,
      currentSortIconName,
      newFromTemplatePopupShow,
      importFlowPopupShow,

      changeSortType,
      closeAllDialogs,
      handleTableSortChange,
      handlePageChange,
      handleLimitChange,
      handleClearSearch,
      removeContent,
      confirmEnableAction,
      copyContentItem,
      saveContentAsTemplate,
      addContentToFlowGroup,
      importNewContent,
    } = useContentData();

    function sortChange({ sortType, collation }: { sortType: string, collation: string }) {
      handleTableSortChange({ sortType, collation });
    }

    function pageChange(current: number) {
      handlePageChange(current);
    }

    function limitChange(limit: number) {
      handleLimitChange(limit);
    }

    return () => (
      <div class={styles.content}>
        <div class={styles.toolbar}>
          <h2 class={styles.title}>{t('flow.common.allFlows')}</h2>
        </div>
        <div class={styles.tableContainer}>
          <div class={styles.toolbar}>
            <Dropdown
              trigger="click"
              popover-options={{
                clickContentAutoHide: true,
              }}
            >
              {{
                default: () => (
                  <Button theme="primary">
                    <SvgIcon
                      name='add-small'
                      size={22}
                    />
                    {t('flow.content.newFlow')}
                  </Button>
                ),
                content: () => (
                  <Dropdown.DropdownMenu>
                    {
                      newFlowList.value.map(item => (
                        <Dropdown.DropdownItem
                          key={item.text}
                          onClick={item.handler}
                          class={styles.newFlow}
                        >
                          {item.text}
                        </Dropdown.DropdownItem>
                      ))
                    }
                  </Dropdown.DropdownMenu>
                ),
              }}
            </Dropdown>
            <Button>{t('flow.content.batchManage')}</Button>
            <div class={styles.searchBox}>
              <Input
                placeholder={t('flow.content.searchPlaceholder')}
                left-icon="search"
              />
              <Dropdown
                trigger="click"
                is-show={sortShow.value}
                popover-options={{
                  clickContentAutoHide: true,
                }}
              >
                {{
                  default: () => (
                    <div class={styles.iconSortButton}>
                      <SvgIcon
                        name={currentSortIconName.value}
                        class={styles.sortIcon}
                        size={10}
                      />
                    </div>
                  ),
                  content: () => (
                    <Dropdown.DropdownMenu>
                      {
                        sortList.value.map(item => (
                          <Dropdown.DropdownItem
                            key={item.id}
                            class={`${styles.sortItem} ${item.active ? styles.active : ''}`}
                            onClick={() => changeSortType(item.id)}
                          >
                            {item.name}
                            <SvgIcon
                              name={item.sortIcon}
                              class={styles.sortItemIcon}
                              size={10}
                            />
                          </Dropdown.DropdownItem>
                        ))
                      }
                    </Dropdown.DropdownMenu>
                  ),
                }}
              </Dropdown>
            </div>
          </div>
          <FlowTable
            data={flowTableList.value}
            loading={tableLoading.value}
            currentSortType={currentSortType.value}
            currentCollation={currentCollation.value}
            pagination={pagination.value}
            onSortChange={sortChange}
            onPageChange={pageChange}
            onLimitChange={limitChange}
            onClearSearch={handleClearSearch}
          />
        </div>

        <NewFlowPopup
          isShow={newFromTemplatePopupShow.value}
          onUpdate:isShow={(val: boolean) => { newFromTemplatePopupShow.value = val; }}
        />

        <ImportFlowPopup
          isShow={importFlowPopupShow.value}
          onUpdate:isShow={(val: boolean) => { importFlowPopupShow.value = val; }}
          onConfirm={importNewContent}
        />

        {/* 启用/禁用弹窗 */}
        <Dialog
          is-show={isShowEnableDialog.value}
          title={'禁用或启用'}
          onClosed={closeAllDialogs}
        >
          <div>
            <p>确认{currentActionData.value?.status === 'enable' ? '禁用' : '启用'}创作流？</p>
            <p>操作对象: {currentActionData.value?.name || currentActionData.value?.id}</p>
          </div>
          <template v-slot:footer>
            <Button onClick={closeAllDialogs}>取消</Button>
            <Button theme="primary" onClick={confirmEnableAction}>确认</Button>
          </template>
        </Dialog>

        {/* 添加到组弹窗 */}
        <Dialog
          is-show={isShowAddToDialog.value}
          title={t('flow.content.addTo')}
          onClosed={closeAllDialogs}
        >
          <div>
            <p>选择要添加到的组：</p>
            <p>创作流: {currentActionData.value?.name || currentActionData.value?.id}</p>
            {/* TODO: 添加组选择器 */}
          </div>
          <template v-slot:footer>
            <Button onClick={closeAllDialogs}>取消</Button>
            <Button theme="primary" onClick={addContentToFlowGroup}>确认</Button>
          </template>
        </Dialog>

        {/* 复制弹窗 */}
        <Dialog
          is-show={isShowCopyDialog.value}
          title={t('flow.content.copyCreationFlow')}
          onClosed={closeAllDialogs}
        >
          <div>
            <p>请输入新创作流的名称：</p>
            <p>原创作流: {currentActionData.value?.name || currentActionData.value?.id}</p>
            {/* TODO: 添加名称输入框 */}
          </div>
          <template v-slot:footer>
            <Button onClick={closeAllDialogs}>取消</Button>
            <Button theme="primary" onClick={copyContentItem}>确认</Button>
          </template>
        </Dialog>

        {/* 另存为模板弹窗 */}
        <Dialog
          is-show={isShowSaveAsTemplateDialog.value}
          title={t('flow.content.saveAsTemplate')}
          onClosed={closeAllDialogs}
        >
          <div>
            <p>请输入模板名称：</p>
            <p>创作流: {currentActionData.value?.name || currentActionData.value?.id}</p>
            {/* TODO: 添加模板名称输入框 */}
          </div>
          <template v-slot:footer>
            <Button onClick={closeAllDialogs}>取消</Button>
            <Button theme="primary" onClick={saveContentAsTemplate}>确认</Button>
          </template>
        </Dialog>

        {/* 删除弹窗 */}
        <Dialog
          is-show={isShowDeleteDialog.value}
          title={t('flow.content.delete')}
          onClosed={closeAllDialogs}
        >
          <div>
            <p>确认删除创作流？此操作不可撤销。</p>
            <p>操作对象: {currentActionData.value?.name || currentActionData.value?.id}</p>
          </div>
          <template v-slot:footer>
            <Button onClick={closeAllDialogs}>取消</Button>
            <Button theme="primary" onClick={removeContent}>确认</Button>
          </template>
        </Dialog>
      </div>
    );
  },
});
