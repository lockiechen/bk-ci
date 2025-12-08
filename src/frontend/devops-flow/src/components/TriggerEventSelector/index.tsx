import { defineComponent, ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Input, Loading } from 'bkui-vue'
import { useAtomManager } from '@/hooks/useAtomManager'
import { JobCategory, type AtomItem, type AtomClassify } from '@/api/atom'
import styles from './TriggerEventSelector.module.css'
import { SvgIcon } from '@/components/SvgIcon'
import TriggerEventCard from './TriggerEventCard'

export default defineComponent({
  name: 'TriggerEventSelector',
  props: {
    projectCode: {
      type: String,
      default: '',
    },
  },
  emits: ['update:visible', 'select', 'close'],
  setup(props, { emit }) {
    const { t } = useI18n()
    const projectCode = props.projectCode || 'lockie'

    const atomManager = useAtomManager({
      projectCode,
      category: JobCategory.TRIGGER,
    })

    const searchKey = ref('')
    const selectedClassify = ref<string>('all')
    const allEventList = ref<AtomItem[]>([])
    const loading = ref(false)

    const classifyList = computed(() => {
      const list: Array<AtomClassify & { count: number }> = [
        {
          id: 'all',
          classifyCode: 'all',
          classifyName: t('flow.content.allEvents'),
          count: allEventList.value.length,
        },
        ...atomManager.classifyOptions.value.map((item) => ({
          ...item,
          count: allEventList.value.filter((e) => e.classifyCode === item.classifyCode).length,
        })),
      ]
      return list
    })

    const filteredEventList = computed(() => {
      let list = allEventList.value

      if (selectedClassify.value !== 'all') {
        list = list.filter((item) => item.classifyCode === selectedClassify.value)
      }

      if (searchKey.value) {
        const keyword = searchKey.value.toLowerCase()
        list = list.filter(
          (item) =>
            item.name.toLowerCase().includes(keyword) ||
            item.summary?.toLowerCase().includes(keyword),
        )
      }

      return list
    })

    const loadEventList = async () => {
      try {
        loading.value = true
        const response = await atomManager.fetchAtomList({
          page: 1,
          pageSize: 100,
        })
        allEventList.value = response.records || []
      } catch (error) {
        console.error('Failed to load trigger events:', error)
        allEventList.value = []
      } finally {
        loading.value = false
      }
    }

    onMounted(async () => {
      await atomManager.fetchClassifyList()
      await loadEventList()
    })

    onUnmounted(() => {
      searchKey.value = ''
      selectedClassify.value = 'all'
    })

    const handleSelectEvent = (event: AtomItem) => {
      emit('select', event)
      emit('update:visible', false)
    }

    const handleGoToPublishGuide = () => {
      window.open('https://iwiki.example.com/publish-guide', '_blank')
    }

    return () => (
      <div class={styles.triggerEventSelector}>
        <Input
          behavior="simplicity"
          v-model={searchKey.value}
          placeholder={t('flow.content.enterKeywords')}
          clearable
        >
          {{
            suffix: () => <SvgIcon name="search" size={16} class={styles.searchIcon} />,
          }}
        </Input>

        <div class={styles.body}>
          <div class={styles.nav}>
            {classifyList.value.map((classify) => (
              <div
                key={classify.classifyCode}
                class={[
                  styles.navItem,
                  selectedClassify.value === classify.classifyCode && styles.navItemActive,
                ]}
                onClick={() => {
                  selectedClassify.value = classify.classifyCode
                }}
              >
                <span class={styles.navName}>{classify.classifyName}</span>
                <span class={styles.navCount}>{classify.count}</span>
              </div>
            ))}
          </div>

          <div class={styles.listContainer}>
            <Loading loading={loading.value} class={styles.list}>
              {filteredEventList.value.length ? (
                filteredEventList.value.map((eventAtom) => (
                  <TriggerEventCard
                    key={eventAtom.atomCode}
                    eventAtom={eventAtom}
                    onClick={() => handleSelectEvent(eventAtom)}
                  />
                ))
              ) : (
                <div class={styles.emptyState}>{t('flow.content.noEventsFound')}</div>
              )}
            </Loading>
            <div class={styles.footer}>
              <a class={styles.publishGuideLink} onClick={handleGoToPublishGuide}>
                {t('flow.content.noEventsMeetRequirements')}
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  },
})
