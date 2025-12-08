import type { Stage, Container, Element } from '@/api/flowModel'

export enum AtomRunCondition {
  PRE_TASK_SUCCESS = 'PRE_TASK_SUCCESS',
  PRE_TASK_FAILED_BUT_CANCEL = 'PRE_TASK_FAILED_BUT_CANCEL',
  PRE_TASK_FAILED_EVEN_CANCEL = 'PRE_TASK_FAILED_EVEN_CANCEL',
  PRE_TASK_FAILED_ONLY = 'PRE_TASK_FAILED_ONLY',
  CUSTOM_VARIABLE_MATCH = 'CUSTOM_VARIABLE_MATCH',
  CUSTOM_VARIABLE_MATCH_NOT_RUN = 'CUSTOM_VARIABLE_MATCH_NOT_RUN',
  CUSTOM_CONDITION_MATCH = 'CUSTOM_CONDITION_MATCH',
}

export enum StageRunCondition {
  AFTER_LAST_FINISHED = 'AFTER_LAST_FINISHED',
  CUSTOM_VARIABLE_MATCH = 'CUSTOM_VARIABLE_MATCH',
  CUSTOM_VARIABLE_MATCH_NOT_RUN = 'CUSTOM_VARIABLE_MATCH_NOT_RUN',
  CUSTOM_CONDITION_MATCH = 'CUSTOM_CONDITION_MATCH',
}

export enum JobRunCondition {
  STAGE_RUNNING = 'STAGE_RUNNING',
  CUSTOM_VARIABLE_MATCH = 'CUSTOM_VARIABLE_MATCH',
  CUSTOM_VARIABLE_MATCH_NOT_RUN = 'CUSTOM_VARIABLE_MATCH_NOT_RUN',
  CUSTOM_CONDITION_MATCH = 'CUSTOM_CONDITION_MATCH',
  PRE_STAGE_SUCCESS = 'PRE_STAGE_SUCCESS',
  PRE_STAGE_FAILED = 'PRE_STAGE_FAILED',
  PRE_STAGE_CANCEL = 'PRE_STAGE_CANCEL',
}

/**
 * 生成唯一 ID
 */
export function generateId(prefix = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 创建默认 Stage
 */
export function createDefaultStage(index: number, partial?: Partial<Stage>): Stage {
  return {
    id: generateId('stage'),
    name: `Stage-${index}`,
    containers: [],
    tag: [],
    fastKill: false,
    finally: false,
    stageControlOption: {
      enable: true,
      runCondition: StageRunCondition.AFTER_LAST_FINISHED,
      customVariables: [],
      customCondition: '',
      manualTrigger: false,
      triggerUsers: [],
      timeout: 24,
    },
    ...partial,
  }
}

/**
 * 创建默认 Container (Job)
 */
export function createDefaultContainer(index: number, partial?: Partial<Container>): Container {
  return {
    jobId: '',
    '@type': 'vmBuild',
    id: generateId('container'),
    name: `Job-${index}`,
    elements: [],
    containerId: generateId('container'),
    containerHashId: '',
    matrixGroupFlag: false,
    classType: 'vmBuild',
    baseOS: 'LINUX',
    vmNames: [],
    maxQueueMinutes: 60,
    maxRunningMinutes: 480,
    buildEnv: {},
    jobControlOption: {
      enable: true,
      prepareTimeout: 10,
      timeout: 900,
      timeoutVar: '900',
      runCondition: JobRunCondition.STAGE_RUNNING,
      customVariables: [],
      customCondition: '',
      dependOnType: 'ID',
      dependOnId: [],
      dependOnName: '',
      continueWhenFailed: false,
    },
    matrixControlOption: {
      strategyStr: '',
      includeCaseStr: '',
      excludeCaseStr: '',
      fastKill: false,
      maxConcurrency: 10,
    },
    mutexGroup: {
      enable: false,
      mutexGroupName: '',
      queueEnable: false,
      timeoutVar: '0',
      queue: 0,
    },
    nfsSwitch: false,
    params: [],
    ...partial,
  }
}

/**
 * 创建默认 Element (Plugin)
 */
export function createDefaultElement(index: number, partial?: Partial<Element>): Element {
  return {
    id: generateId('element'),
    name: `Plugin-${index}`,
    taskAtom: '',
    data: {
      input: {},
      output: [],
    },
    additionalOptions: {
      enable: true,
      continueWhenFailed: false,
      manualSkip: false,
      retryWhenFailed: false,
      retryCount: 0,
      manualRetry: false,
      timeout: 0,
      timeoutVar: '',
      runCondition: AtomRunCondition.PRE_TASK_SUCCESS,
      pauseBeforeExec: false,
      subscriptionPauseUser: '',
      otherTask: '',
      customVariables: [],
      customCondition: '',
      enableCustomEnv: false,
    },
    ...partial,
  }
}
