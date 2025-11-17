import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useFlowModel } from './useFlowModel'

/**
 * Creation Node Interface
 */
export interface CreationNode {
  id: string
  name: string
  status: 'online' | 'offline'
}

/**
 * Authoring Environment Interface
 */
export interface AuthoringEnvironment {
  id: string
  name: string
  creationNodes: CreationNode[]
  workspace: string
  description?: string
}

/**
 * Hook options
 */
export interface UseAuthoringEnvOptions {
  flowId?: string
  autoLoad?: boolean
}

/**
 * Hook to manage authoring environment data
 */
export function useAuthoringEnv(options: UseAuthoringEnvOptions = {}) {
  const route = useRoute()
  const flowId = options.flowId || (route.params.flowId as string)

  // Use flowModel hook to get complete YAML content
  const {
    yamlContent: fullYamlContent,
    loading,
    pipelineModel,
  } = useFlowModel({
    flowId,
    autoLoad: options.autoLoad,
  })

  const authoringEnv = ref<AuthoringEnvironment | null>(null)

  /**
   * Use the complete flowModel YAML content
   */
  const yamlContent = computed(() => {
    return fullYamlContent.value
  })

  /**
   * Calculate highlight ranges for authoring environment section
   */
  const authoringEnvHighlight = computed(() => {
    const yaml = yamlContent.value
    if (!yaml) return []

    const lines = yaml.split('\n')
    let startLine = -1
    let endLine = -1

    // Find the authoring-env section
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (line.startsWith('# Authoring Environment Configuration') || line.startsWith('authoring-env:')) {
        startLine = i + 1 // Monaco Editor uses 1-based line numbers
        break
      }
    }

    if (startLine > 0) {
      // Find the end of authoring-env section (next major section or empty line)
      for (let i = startLine; i < lines.length; i++) {
        const line = lines[i].trim()
        if (line === '' && lines[i + 1]?.trim().match(/^[a-zA-Z]/)) {
          endLine = i
          break
        }
        if (line.match(/^(on|variables|stages|notices|concurrency|syntax-dialect):/)) {
          endLine = i
          break
        }
      }
    }

    if (startLine > 0 && endLine > startLine) {
      return [
        {
          startMark: { line: startLine, column: 1 },
          endMark: { line: endLine, column: 1 }
        }
      ]
    }

    return []
  })

  /**
   * Extract authoring environment data from pipeline model
   */
  const extractAuthoringEnv = () => {
    // Extract authoring environment info from the YAML or pipeline model
    // This is a mock implementation
    authoringEnv.value = {
      id: 'env-001',
      name: '我的创作环境',
      creationNodes: [
        {
          id: 'ins-be4830935d0ed3db',
          name: 'Node-1',
          status: 'online'
        },
        {
          id: 'ins-be4830935d0ed3db',
          name: 'Node-2',
          status: 'online'
        },
        {
          id: 'ins-be4830935d0ed3db',
          name: 'Node-3',
          status: 'online'
        }
      ],
      workspace: '默认为<Agent安装目录>/workspace/<创作流ID>/',
      description: 'Default authoring environment for development'
    }
  }

  /**
   * Fetch authoring environment data (now uses flowModel data)
   */
  const fetchAuthoringEnv = async () => {
    // The loading and data fetching is handled by useFlowModel
    // We just extract the authoring environment part
    extractAuthoringEnv()
  }

  /**
   * Check if environment is empty
   */
  const isEmpty = computed(() => !pipelineModel.value)

  // Extract authoring env when pipeline model is loaded
  if (options.autoLoad) {
    extractAuthoringEnv()
  }

  return {
    loading,
    authoringEnv,
    yamlContent,
    authoringEnvHighlight,
    isEmpty,
    fetchAuthoringEnv
  }
}
