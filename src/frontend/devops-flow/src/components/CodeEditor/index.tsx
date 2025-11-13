import { defineComponent, ref, watch, onMounted, onBeforeUnmount, PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import MonacoEditor from '@/utils/monacoEditor'
import styles from './CodeEditor.module.css'
import { SvgIcon } from '../SvgIcon'
import { Loading } from 'bkui-vue'

export default defineComponent({
  name: 'CodeEditor',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    language: {
      type: String,
      default: 'yaml'
    },
    height: {
      type: String,
      default: '100%'
    },
    width: {
      type: String,
      default: '100%'
    },
    hasError: {
      type: Boolean,
      default: false
    },
    fileUri: {
      type: String,
      default: 'flow.yml'
    }
  },
  emits: ['update:modelValue', 'change', 'update:hasError'],
  setup(props, { emit }) {
    const { t } = useI18n()
    const editorRef = ref<HTMLDivElement>()
    const isLoading = ref(false)
    const fullScreen = ref(false)
    const errorList = ref<Array<{ message: string; startLineNumber: number; startColumn: number }>>([])

    let monaco: typeof import('monaco-editor') | null = null
    let editor: import('monaco-editor').editor.IStandaloneCodeEditor | null = null

    const style = {
      height: props.height,
      width: props.width
    }

    // Initialize Monaco Editor
    const initEditor = async () => {
      if (!editorRef.value) return

      isLoading.value = true

      try {
        monaco = await MonacoEditor.instance()

        editor = monaco.editor.create(editorRef.value, {
          model: monaco.editor.createModel(
            props.modelValue,
            props.language,
            monaco.Uri.parse(props.fileUri)
          ),
          automaticLayout: true,
          formatOnPaste: true,
          unicodeHighlight: {
            ambiguousCharacters: false
          },
          minimap: {
            enabled: false
          },
          readOnly: props.readOnly,
          scrollBeyondLastLine: false,
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollbar: {
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10
          }
        })

        // Listen to marker changes (errors/warnings)
        monaco.editor.onDidChangeMarkers(() => {
          errorList.value = monaco!.editor.getModelMarkers({
            resource: monaco!.Uri.parse(props.fileUri)
          })
          emit('update:hasError', errorList.value.length > 0)
        })

        // Listen to content changes
        editor.onDidChangeModelContent(() => {
          const value = editor!.getValue()
          if (props.modelValue !== value) {
            emit('update:modelValue', value)
            emit('change', value)
          }
        })
      } catch (error) {
        console.error('Failed to initialize Monaco Editor:', error)
      } finally {
        isLoading.value = false
      }
    }

    // Toggle fullscreen mode
    const toggleFullScreen = () => {
      fullScreen.value = !fullScreen.value
    }

    // Watch for value changes from parent
    watch(() => props.modelValue, (newValue) => {
      if (editor && newValue !== editor.getValue()) {
        editor.setValue(newValue)
      }
    })

    // Watch for readOnly changes
    watch(() => props.readOnly, (val) => {
      editor?.updateOptions({ readOnly: val })
    })

    onMounted(() => {
      initEditor()
    })

    onBeforeUnmount(() => {
      editor?.getModel()?.dispose()
      editor?.dispose()
    })

    return () => (
      <div class={[styles.codeEditor, fullScreen.value && styles.fullScreen]} style={style}>
        {isLoading.value && (
          <Loading class={styles.codeEditorLoading}  />
        )}

        {!props.readOnly && (
          <div class={styles.toolbar}>
            <span onClick={toggleFullScreen}>
              <SvgIcon
                name={fullScreen.value ? 'un-full-screen' : 'full-screen'}
                size={26}
                class={styles.toolbarIcon}
              />
            </span>
          </div>
        )}

        <div ref={editorRef} class={styles.editorContainer} style={style}></div>

        {!props.readOnly && errorList.value.length > 0 && (
          <ul class={styles.errorSummary}>
            {errorList.value.map((item, index) => (
              <li key={index}>
                <SvgIcon name="circle-close" />
                <p>
                  <span>{item.message}</span>
                  <span class={styles.errorPosition}>
                    ({item.startLineNumber}, {item.startColumn})
                  </span>
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }
})
