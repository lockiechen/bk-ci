import type { ExecutePipelineResponse, PipelineModelResponse, StartupInfo, StartupProperty } from './preview'

/**
 * Enable mock fallback mode - when true, returns mock data on API failure
 */
export const ENABLE_MOCK_FALLBACK = true

/**
 * Mock API delay in milliseconds (for simulating network latency)
 */
export const MOCK_API_DELAY = 300

/**
 * Simulate API delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// =============================================================================
// Mock Param Lists - Covering multiple scenarios
// =============================================================================

/**
 * Mock input params with different types and categories
 * Covers: STRING, ENUM, BOOLEAN, TEXTAREA, FILE types
 * Covers: Grouped and ungrouped params
 */
export const mockParamList: StartupProperty[] = [
  // Ungrouped params (category is empty or undefined)
  {
    id: 'branch_tag',
    name: '分支标签',
    required: true,
    constant: false,
    type: 'STRING',
    defaultValue: 'stream-ci-test',
    value: 'stream-ci-test',
    desc: '',
    readOnly: false,
    propertyType: 'BUILD_PARAM',
    label: 'branch_tag(分支标签)',
    category: '',
  },
  {
    id: 'ip',
    name: 'IP地址',
    required: true,
    constant: false,
    type: 'ENUM',
    defaultValue: '10.0.1.1',
    value: '10.0.1.1',
    desc: '',
    readOnly: false,
    propertyType: 'BUILD_PARAM',
    label: 'ip(IP地址)',
    category: '',
    options: [
      { id: '10.0.1.1', name: '10.0.1.1 <默认值>' },
      { id: '10.1.0.16', name: '10.1.0.16' },
      { id: '125.71.255.255', name: '125.71.255.255' },
      { id: '选项名称', name: '选项名称' },
      { id: '192.168.1.2', name: '192.168.1.2' },
    ],
  },
  {
    id: 'key',
    name: '密钥',
    required: false,
    constant: false,
    type: 'TEXTAREA',
    defaultValue: '',
    value: '',
    desc: '',
    readOnly: false,
    propertyType: 'BUILD_PARAM',
    label: 'key(密钥)',
    category: '',
    maxLength: 100,
  },
  {
    id: 'file',
    name: '文件',
    required: false,
    constant: false,
    type: 'FILE',
    defaultValue: '',
    value: '',
    desc: '',
    readOnly: false,
    propertyType: 'BUILD_PARAM',
    label: 'file(文件)',
    category: '',
  },
  // Grouped params - Git配置
  {
    id: 'repo_url',
    name: 'Repository URL',
    required: true,
    constant: false,
    type: 'STRING',
    defaultValue: 'https://github.com/example/repo.git',
    value: 'https://github.com/example/repo.git',
    desc: 'The git repository URL to clone',
    readOnly: false,
    propertyType: 'BUILD_PARAM',
    label: 'repo_url(Repository URL)',
    category: 'Git配置',
  },
  {
    id: 'branch',
    name: 'Branch Name',
    required: true,
    constant: false,
    type: 'STRING',
    defaultValue: 'main',
    value: 'develop',
    desc: 'Target branch to build',
    readOnly: false,
    propertyType: 'BUILD_PARAM',
    label: 'branch(Branch Name)',
    isChanged: true,
    category: 'Git配置',
  },
  {
    id: 'commit_id',
    name: 'Commit ID',
    required: false,
    constant: false,
    type: 'STRING',
    defaultValue: '',
    value: 'abc123def',
    desc: 'Specific commit to checkout (optional)',
    readOnly: false,
    propertyType: 'BUILD_PARAM',
    label: 'commit_id(Commit ID)',
    category: 'Git配置',
  },
  // Grouped params - 构建选项
  {
    id: 'enable_test',
    name: 'Enable Testing',
    required: false,
    constant: false,
    type: 'BOOLEAN',
    defaultValue: true,
    value: true,
    desc: 'Whether to run tests during build',
    readOnly: false,
    propertyType: 'BUILD_PARAM',
    label: 'enable_test(Enable Testing)',
    category: '构建选项',
  },
  {
    id: 'build_env',
    name: 'Build Environment',
    required: true,
    constant: false,
    type: 'ENUM',
    defaultValue: 'dev',
    value: 'staging',
    desc: 'Select the target build environment',
    readOnly: false,
    propertyType: 'BUILD_PARAM',
    label: 'build_env(Build Environment)',
    isChanged: true,
    category: '构建选项',
    options: [
      { id: 'dev', name: 'Development' },
      { id: 'staging', name: 'Staging' },
      { id: 'production', name: 'Production' },
    ],
  },
  {
    id: 'parallel_jobs',
    name: 'Parallel Jobs',
    required: false,
    constant: false,
    type: 'ENUM',
    defaultValue: '4',
    value: '4',
    desc: 'Number of parallel build jobs',
    readOnly: false,
    propertyType: 'BUILD_PARAM',
    label: 'parallel_jobs(Parallel Jobs)',
    category: '构建选项',
    options: [
      { id: '1', name: '1' },
      { id: '2', name: '2' },
      { id: '4', name: '4' },
      { id: '8', name: '8' },
    ],
  },
  // Grouped params - 部署配置
  {
    id: 'deploy_script',
    name: 'Deploy Script',
    required: false,
    constant: false,
    type: 'TEXTAREA',
    defaultValue: '#!/bin/bash\necho "Deploying..."',
    value: '#!/bin/bash\necho "Deploying..."\nnpm run deploy',
    desc: 'Custom deployment script',
    readOnly: false,
    propertyType: 'BUILD_PARAM',
    label: 'deploy_script(Deploy Script)',
    isChanged: true,
    category: '部署配置',
    maxLength: 500,
  },
  {
    id: 'deploy_timeout',
    name: 'Deploy Timeout',
    required: false,
    constant: false,
    type: 'STRING',
    defaultValue: '300',
    value: '600',
    desc: 'Deployment timeout in seconds',
    readOnly: false,
    propertyType: 'BUILD_PARAM',
    label: 'deploy_timeout(Deploy Timeout)',
    category: '部署配置',
  },
]

/**
 * Mock version params
 */
export const mockVersionParamList: StartupProperty[] = [
  {
    id: 'BK_CI_MAJOR_VERSION',
    name: 'Major Version',
    required: false,
    constant: false,
    type: 'STRING',
    defaultValue: '1',
    value: '2',
    desc: 'Major version number',
    readOnly: false,
    isChanged: true,
  },
  {
    id: 'BK_CI_MINOR_VERSION',
    name: 'Minor Version',
    required: false,
    constant: false,
    type: 'STRING',
    defaultValue: '0',
    value: '1',
    desc: 'Minor version number',
    readOnly: false,
    isChanged: true,
  },
]

/**
 * Mock build params
 */
export const mockBuildList: StartupProperty[] = [
  {
    id: 'build_message',
    name: 'Build Message',
    required: false,
    constant: false,
    type: 'STRING',
    defaultValue: '',
    value: 'Feature: Add new login flow',
    desc: 'Commit message or build description',
    readOnly: false,
    propertyType: 'BUILD',
    label: 'build_message(Build Message)',
  },
]

/**
 * Mock constant params with categories
 */
export const mockConstantParams: StartupProperty[] = [
  // 系统常量
  {
    id: 'PROJECT_NAME',
    name: '项目名称',
    required: false,
    constant: true,
    type: 'STRING',
    defaultValue: 'my-project',
    value: 'my-project',
    desc: '项目名称（只读）',
    readOnly: true,
    label: 'PROJECT_NAME(项目名称)',
    category: '系统常量',
  },
  {
    id: 'NAMESPACE',
    name: '命名空间',
    required: false,
    constant: true,
    type: 'STRING',
    defaultValue: 'production',
    value: 'production',
    desc: 'Kubernetes命名空间（只读）',
    readOnly: true,
    label: 'NAMESPACE(命名空间)',
    category: '系统常量',
  },
  {
    id: 'BUILD_USER',
    name: '构建用户',
    required: false,
    constant: true,
    type: 'STRING',
    defaultValue: 'admin',
    value: 'admin',
    desc: '触发构建的用户',
    readOnly: true,
    label: 'BUILD_USER(构建用户)',
    category: '系统常量',
  },
  // 环境常量
  {
    id: 'ENV_TYPE',
    name: '环境类型',
    required: false,
    constant: true,
    type: 'STRING',
    defaultValue: 'production',
    value: 'production',
    desc: '当前环境类型',
    readOnly: true,
    label: 'ENV_TYPE(环境类型)',
    category: '环境常量',
  },
  {
    id: 'CLUSTER_NAME',
    name: '集群名称',
    required: false,
    constant: true,
    type: 'STRING',
    defaultValue: 'cluster-01',
    value: 'cluster-01',
    desc: '目标集群名称',
    readOnly: true,
    label: 'CLUSTER_NAME(集群名称)',
    category: '环境常量',
  },
  {
    id: 'REGION',
    name: '区域',
    required: false,
    constant: true,
    type: 'STRING',
    defaultValue: 'cn-north-1',
    value: 'cn-north-1',
    desc: '部署区域',
    readOnly: true,
    label: 'REGION(区域)',
    category: '环境常量',
  },
]

/**
 * Mock other params with categories
 */
export const mockOtherParams: StartupProperty[] = [
  // 通知设置
  {
    id: 'notification_email',
    name: '通知邮箱',
    required: false,
    constant: false,
    type: 'STRING',
    defaultValue: '',
    value: 'dev@example.com',
    desc: '构建通知邮箱地址',
    readOnly: false,
    label: 'notification_email(通知邮箱)',
    category: '通知设置',
  },
  {
    id: 'webhook_url',
    name: 'Webhook地址',
    required: false,
    constant: false,
    type: 'STRING',
    defaultValue: '',
    value: 'https://hooks.example.com/build',
    desc: '消息推送地址',
    readOnly: false,
    label: 'webhook_url(Webhook地址)',
    category: '通知设置',
  },
  {
    id: 'notify_on_failure',
    name: '失败通知',
    required: false,
    constant: false,
    type: 'BOOLEAN',
    defaultValue: true,
    value: true,
    desc: '构建失败时发送通知',
    readOnly: false,
    label: 'notify_on_failure(失败通知)',
    category: '通知设置',
  },
  // 高级选项
  {
    id: 'skip_deploy',
    name: '跳过部署',
    required: false,
    constant: false,
    type: 'BOOLEAN',
    defaultValue: false,
    value: false,
    desc: '是否跳过部署步骤',
    readOnly: false,
    label: 'skip_deploy(跳过部署)',
    category: '高级选项',
  },
  {
    id: 'debug_mode',
    name: '调试模式',
    required: false,
    constant: false,
    type: 'BOOLEAN',
    defaultValue: false,
    value: false,
    desc: '开启调试模式',
    readOnly: false,
    label: 'debug_mode(调试模式)',
    category: '高级选项',
  },
  {
    id: 'cleanup_workspace',
    name: '清理工作区',
    required: false,
    constant: false,
    type: 'BOOLEAN',
    defaultValue: true,
    value: true,
    desc: '构建完成后清理工作区',
    readOnly: false,
    label: 'cleanup_workspace(清理工作区)',
    category: '高级选项',
  },
  {
    id: 'retry_count',
    name: '重试次数',
    required: false,
    constant: false,
    type: 'ENUM',
    defaultValue: '0',
    value: '3',
    desc: '失败后重试次数',
    readOnly: false,
    label: 'retry_count(重试次数)',
    category: '高级选项',
    options: [
      { id: '0', name: '不重试' },
      { id: '1', name: '1次' },
      { id: '3', name: '3次' },
      { id: '5', name: '5次' },
    ],
  },
]

// =============================================================================
// Mock Startup Info
// =============================================================================

/**
 * Mock startup info - comprehensive scenario
 */
export const mockStartupInfo: StartupInfo = {
  canManualStartup: true,
  canElementSkip: true,
  useLatestParameters: true,
  buildNo: {
    buildNo: 100,
    buildNoType: 'CONSISTENT',
    required: true,
    currentBuildNo: 101,
  },
  properties: [
    ...mockParamList,
    ...mockVersionParamList,
    ...mockBuildList,
    ...mockConstantParams,
    ...mockOtherParams,
  ],
}

// =============================================================================
// Mock Pipeline Model
// =============================================================================

/**
 * Mock pipeline model with multiple stages, containers, and elements
 * Covers: enabled/disabled stages, containers, elements
 */
export const mockPipelineModel = {
  name: 'stream-ci-demo',
  stages: [
    {
      id: 'stage-1',
      name: 'Build Stage',
      stageControlOption: { enable: true },
      runStage: true,
      containers: [
        {
          id: 'container-1-1',
          name: 'Build Job',
          jobControlOption: { enable: true },
          runContainer: true,
          elements: [
            {
              '@type': 'linuxScript',
              id: 'element-1-1-1',
              name: 'Checkout Code',
              additionalOptions: { enable: true },
              canElementSkip: true,
            },
            {
              '@type': 'linuxScript',
              id: 'element-1-1-2',
              name: 'Install Dependencies',
              additionalOptions: { enable: true },
              canElementSkip: true,
            },
            {
              '@type': 'linuxScript',
              id: 'element-1-1-3',
              name: 'Build Application',
              additionalOptions: { enable: true },
              canElementSkip: true,
            },
          ],
        },
      ],
    },
    {
      id: 'stage-2',
      name: 'Test Stage',
      stageControlOption: { enable: true },
      runStage: true,
      containers: [
        {
          id: 'container-2-1',
          name: 'Unit Test Job',
          jobControlOption: { enable: true },
          runContainer: true,
          elements: [
            {
              '@type': 'linuxScript',
              id: 'element-2-1-1',
              name: 'Run Unit Tests',
              additionalOptions: { enable: true },
              canElementSkip: true,
            },
            {
              '@type': 'linuxScript',
              id: 'element-2-1-2',
              name: 'Coverage Report',
              additionalOptions: { enable: true },
              canElementSkip: true,
            },
          ],
        },
        {
          id: 'container-2-2',
          name: 'Integration Test Job',
          jobControlOption: { enable: true },
          runContainer: true,
          elements: [
            {
              '@type': 'linuxScript',
              id: 'element-2-2-1',
              name: 'Run Integration Tests',
              additionalOptions: { enable: true },
              canElementSkip: true,
            },
          ],
        },
      ],
    },
    {
      id: 'stage-3',
      name: 'Deploy Stage',
      stageControlOption: { enable: true },
      runStage: true,
      containers: [
        {
          id: 'container-3-1',
          name: 'Deploy Job',
          jobControlOption: { enable: true },
          runContainer: true,
          elements: [
            {
              '@type': 'linuxScript',
              id: 'element-3-1-1',
              name: 'Deploy to Staging',
              additionalOptions: { enable: true },
              canElementSkip: true,
            },
            {
              '@type': 'linuxScript',
              id: 'element-3-1-2',
              name: 'Run Smoke Tests',
              additionalOptions: { enable: false }, // Disabled element
              canElementSkip: false,
            },
            {
              '@type': 'linuxScript',
              id: 'element-3-1-3',
              name: 'Deploy to Production',
              additionalOptions: { enable: true },
              canElementSkip: true,
            },
          ],
        },
      ],
    },
  ],
}

// =============================================================================
// Mock Flow Info
// =============================================================================

/**
 * Mock flow info
 */
export const mockFlowInfo = {
  pipelineId: 'p-mock-pipeline-001',
  pipelineName: 'stream-ci-demo',
  hasCollect: false,
  canManualStartup: true,
  canDebug: true,
  canRelease: true,
  instanceFromTemplate: false,
  version: 5,
  baseVersion: 3,
  baseVersionStatus: 'RELEASED',
  baseVersionName: 'V5 (P2.T3.3)',
  releaseVersion: 5,
  releaseVersionName: 'V5 (P2.T3.3)',
  hasPermission: true,
  pipelineDesc: 'Demo CI/CD pipeline for testing',
  creator: 'admin',
  createTime: 1705300200000,
  updateTime: 1711013100000,
  permissions: {
    canManage: true,
    canDelete: true,
    canView: true,
    canEdit: true,
    canExecute: true,
    canDownload: true,
    canShare: true,
    canArchive: true,
  },
}

// =============================================================================
// Mock Version List
// =============================================================================

/**
 * Mock flow version list
 */
export const mockFlowVersionList = [
  { version: 5, versionName: 'V5 (P2.T3.3)', isLatest: true },
  { version: 4, versionName: 'V4 (P2.T3.2)', isLatest: false },
  { version: 3, versionName: 'V3 (P2.T3.1)', isLatest: false },
  { version: 2, versionName: 'V2 (P1.T2.1)', isLatest: false },
  { version: 1, versionName: 'V1 (P1.T1.1)', isLatest: false },
]

// =============================================================================
// Mock API Response Functions
// =============================================================================

/**
 * Get mock startup info response
 */
export function getMockStartupInfo(): StartupInfo {
  console.log('[Mock Fallback] Returning mock startup info')
  return JSON.parse(JSON.stringify(mockStartupInfo))
}

/**
 * Get mock pipeline model response
 */
export function getMockPipelineModel(): PipelineModelResponse {
  console.log('[Mock Fallback] Returning mock pipeline model')
  return {
    modelAndSetting: {
      model: JSON.parse(JSON.stringify(mockPipelineModel)),
    },
  }
}

/**
 * Get mock execute pipeline response
 */
export function getMockExecuteResponse(): ExecutePipelineResponse {
  const buildId = `b-${Date.now()}`
  console.log('[Mock Fallback] Returning mock execute response:', { id: buildId })
  return { id: buildId }
}

/**
 * Get mock flow info
 */
export function getMockFlowInfo() {
  console.log('[Mock Fallback] Returning mock flow info')
  return JSON.parse(JSON.stringify(mockFlowInfo))
}

/**
 * Get mock version list
 */
export function getMockVersionList() {
  console.log('[Mock Fallback] Returning mock version list')
  return JSON.parse(JSON.stringify(mockFlowVersionList))
}
