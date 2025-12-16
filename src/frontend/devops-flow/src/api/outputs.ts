/**
 * Outputs 相关 API 接口定义
 */

import { get, post } from '@/utils/http'

const ARTIFACTORY_API_URL_PREFIX = '/artifactory/api'

/**
 * 制品/报告类型
 */
export type ArtifactoryType = 'PIPELINE' | 'CUSTOM_DIR' | 'IMAGE' | 'REPORT'

/**
 * 制品输出项
 */
export interface Output {
  artifactoryType: ArtifactoryType // 制品仓库类型
  name: string // 制品名称
  fullName?: string // 完整名称（带路径）
  path?: string // 路径
  fullPath: string // 完整路径
  size?: number // 文件大小（字节）
  folder?: boolean // 是否为文件夹
  properties?: Array<{ key: string; value: any }> // 属性列表
  appVersion?: string // 应用版本
  shortUrl?: string // 短链接
  md5?: string // MD5值
  createTime: number // 创建时间戳（秒）

  // 前端补充字段
  id?: string // 制品ID（前端生成）
  icon?: string // 图标名称（前端计算）
  type?: string // 类型（前端判断）
  reportType?: string // 报告类型
  downloadable?: boolean // 是否可下载
  isReportOutput?: boolean // 是否为报告输出
  isImageOutput?: boolean // 是否为镜像输出
  isApp?: boolean // 是否为应用
  indexFileUrl?: string // 索引文件URL
  [key: string]: any // 其他动态字段
}

/**
 * 文件元数据项(与 MetadataLabel 结构相同)
 */
export interface FileMetadataItem {
  labelKey: string // 标签键
  labelColorMap: Record<string, string> // 标签颜色映射
  enumType: boolean // 是否为枚举类型
  display: boolean // 是否显示
  category: string // 分类
  system: boolean // 是否为系统标签
  enableColorConfig: boolean // 是否启用颜色配置
  description?: string // 描述
  createdBy: string // 创建者
  createdDate: string // 创建时间
  lastModifiedBy: string // 最后修改者
  lastModifiedDate: string // 最后修改时间
}

export interface NodeMetadata {
  key: string
  value: string
  system?: boolean
}

/**
 * 文件详情信息
 */
export interface FileInfo {
  name: string // 文件名
  fullName?: string // 完整路径
  size: number // 文件大小（字节）
  folder?: boolean // 是否为文件夹
  createdTime: number // 创建时间（秒）
  modifiedTime: number // 修改时间（秒）
  nodeMetadata?: NodeMetadata[] // 元数据列表
  checksums?: {
    // 校验和
    sha256?: string
    sha1?: string
    md5?: string
  }
  properties?: Array<{ key: string; value: any }> // 属性列表
  [key: string]: any
}

/**
 * 获取制品输出列表请求参数
 */
export interface GetOutputsParams {
  projectId: string // 项目ID
  pipelineId: string // 流水线ID
  buildId: string // 构建ID
  page?: number // 页码
  pageSize?: number // 每页数量
  props?: Array<{ key: string; value: string }> // 筛选条件
  qualityMetadata: {
    key: string
    value: string
  }[]
}

/**
 * 获取制品输出列表响应数据
 */
export interface GetOutputsResponse {
  hasDownloadPermission: boolean // 是否有下载权限
  records: Output[] // 制品列表
  count: number // 总数
  page: number // 当前页码
  pageSize: number // 每页数量
}

/**
 * 获取文件详情请求参数
 */
export interface GetFileInfoParams {
  projectId: string // 项目ID
  type: ArtifactoryType // 制品仓库类型
  path: string // 文件路径
}

/**
 * 元数据标签项
 */
export interface MetadataLabel {
  labelKey: string // 标签键
  labelColorMap: Record<string, string> // 标签颜色映射
  enumType: boolean // 是否为枚举类型
  display: boolean // 是否显示
  category: string // 分类
  system: boolean // 是否为系统标签
  enableColorConfig: boolean // 是否启用颜色配置
  description?: string // 描述
  createdBy: string // 创建者
  createdDate: string // 创建时间
  lastModifiedBy: string // 最后修改者
  lastModifiedDate: string // 最后修改时间
}

/**
 * 获取元数据标签列表请求参数
 */
export interface GetMetadataLabelsParams {
  projectId: string // 项目ID
  pipelineId: string // 流水线ID
  debug?: boolean // 是否为调试模式
}

/**
 * 获取产出制品下载 URL 请求参数
 */
export interface GetDownloadUrlParams {
  projectId: string // 项目ID
  artifactoryType: ArtifactoryType // 制品仓库类型
  path: string // 文件路径
}

/**
 * 获取产出制品下载 URL 响应数据
 */
export interface GetDownloadUrlResponse {
  url: string // 下载链接
  url2: string // 备用下载链接
}

/**
 * 自定义文件夹树节点
 */
export interface CustomDirTreeNode {
  name: string // 文件夹名称
  fullPath: string // 完整路径
  children: CustomDirTreeNode[] // 子节点列表
  isOpen?: boolean // 是否展开
  loading?: boolean // 是否加载中
  leaf?: boolean // 是否为叶子节点，默认 false，接口返回空 children 后置为 true
}

/**
 * 获取自定义文件夹树请求参数
 */
export interface GetCustomDirTreeParams {
  projectId: string // 项目ID
  [key: string]: any // 其他查询参数
}

/**
 * 复制文件请求参数
 */
export interface CopyFileParams {
  projectId: string // 项目ID
  srcArtifactoryType: string // 源制品仓库类型
  srcFileFullPaths: string[] // 源文件路径列表
  dstArtifactoryType: ArtifactoryType // 目标制品仓库类型
  dstDirFullPath: string // 目标目录路径
}

/**
 * 获取制品输出列表
 * @param params 请求参数
 * @returns 制品列表响应数据
 */
export function requestOutputs(params: GetOutputsParams): Promise<GetOutputsResponse> {
  const { projectId, pipelineId, buildId, page = 1, pageSize = 20, props = [] } = params

  // TODO: 调用实际接口
  // const requestParams = {
  //   page,
  //   pageSize,
  //   props,
  // }
  // const hasBuildId = !!buildId
  // return http.post(
  //   `/user/pipeline/output/${projectId}/${pipelineId}/${hasBuildId ? `${buildId}/` : ''}search`,
  //   requestParams
  // ).then(res => res.data)

  // Mock 数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        hasDownloadPermission: true,
        records: [
          {
            artifactoryType: 'PIPELINE',
            name: '10040714_com.tencent.tmgp.hpjy_a2681256_1.23.21_CoVHUY.apk',
            fullName: '/归档构件123/21/10040714_com.tencent.tmgp.hpjy_a2681256_1.23.21_CoVHUY.apk',
            path: '/p-585162853b474062a7227c69fd0ac050/b-b4d32cf3d5dd4de294c8537724f72a80/10040714_com.tencent.tmgp.hpjy_a2681256_1.23.21_CoVHUY.apk',
            fullPath:
              '/p-585162853b474062a7227c69fd0ac050/b-b4d32cf3d5dd4de294c8537724f72a80/10040714_com.tencent.tmgp.hpjy_a2681256_1.23.21_CoVHUY.apk',
            size: 2082359687,
            folder: false,
            properties: [
              {
                key: 'BK-CI-APP-STAGE',
                value: 'Alpha',
              },
              {
                key: 'projectId',
                value: 'test-01',
              },
              {
                key: 'pipelineId',
                value: 'p-585162853b474062a7227c69fd0ac050',
              },
              {
                key: 'buildId',
                value: 'b-b4d32cf3d5dd4de294c8537724f72a80',
              },
              {
                key: 'buildNo',
                value: '21',
              },
              {
                key: 'taskId',
                value: 'e-e7cddeae25e54b2ab0f50abb4e3945f0',
              },
              {
                key: 'source',
                value: 'pipeline',
              },
              {
                key: 'appVersion',
                value: '1.23.21',
              },
              {
                key: 'appTitle',
                value: '和平精英',
              },
              {
                key: 'bundleIdentifier',
                value: 'com.tencent.tmgp.pubgmhd',
              },
              {
                key: 'appName',
                value: '和平精英',
              },
              {
                key: 'appIcon',
                value:
                  'https://teststaticfile.woa.com/bkdevops/app-icon/app-icon/apk/f95eb34eb7399ff3e9bcb06c6a560336fd94e0126477692ecabe5b8bffee0afd.png?v=1755655609',
              },
              {
                key: 'sys_ch',
                value: 'pipeline',
              },
            ],
            appVersion: '1.23.21',
            shortUrl: '',
            md5: '7d04ddbe7af2039455ce8908ac61cb60',
            createTime: 1755655632,
          },
          {
            artifactoryType: 'CUSTOM_DIR',
            name: '10040714_com.tencent.tmgp.hpjy_a2681256_1.23.21_CoVHUY.apk',
            fullName: '/haha/10040714_com.tencent.tmgp.hpjy_a2681256_1.23.21_CoVHUY.apk',
            path: '/haha/10040714_com.tencent.tmgp.hpjy_a2681256_1.23.21_CoVHUY.apk',
            fullPath: '/haha/10040714_com.tencent.tmgp.hpjy_a2681256_1.23.21_CoVHUY.apk',
            size: 2082359687,
            folder: false,
            properties: [
              {
                key: 'projectId',
                value: 'test-01',
              },
              {
                key: 'pipelineId',
                value: 'p-585162853b474062a7227c69fd0ac050',
              },
              {
                key: 'buildId',
                value: 'b-b4d32cf3d5dd4de294c8537724f72a80',
              },
              {
                key: 'buildNo',
                value: '21',
              },
              {
                key: 'taskId',
                value: 'e-3e168bee45e0409e978ab2f37c4567d9',
              },
              {
                key: 'source',
                value: 'pipeline',
              },
              {
                key: 'appVersion',
                value: '1.23.21',
              },
              {
                key: 'appTitle',
                value: '和平精英',
              },
              {
                key: 'bundleIdentifier',
                value: 'com.tencent.tmgp.pubgmhd',
              },
              {
                key: 'appName',
                value: '和平精英',
              },
              {
                key: 'appIcon',
                value:
                  'https://teststaticfile.woa.com/bkdevops/app-icon/app-icon/apk/f95eb34eb7399ff3e9bcb06c6a560336fd94e0126477692ecabe5b8bffee0afd.png?v=1755655578',
              },
              {
                key: 'sys_oc',
                value: '1',
              },
              {
                key: 'sys_ch',
                value: 'pipeline',
              },
            ],
            appVersion: '1.23.21',
            shortUrl: '',
            md5: '7d04ddbe7af2039455ce8908ac61cb60',
            createTime: 1755655602,
          },
        ],
        count: 2,
        page: 1,
        pageSize: 20,
      })
    }, 800)
  })
}

/**
 * 获取文件详情(返回元数据数组)
 * @param params 请求参数
 * @returns 文件元数据数组
 */
export function requestFileInfo(params: GetFileInfoParams): Promise<FileInfo> {
  const { projectId, type, path } = params

  // TODO: 调用实际接口
  // return http.get(`artifactories/${projectId}/${type}/show?path=${encodeURIComponent(path)}`)
  //   .then(res => res.data)

  // Mock 数据 - 返回元数据数组
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        name: '10040714_com.tencent.tmgp.hpjy_a2681256_1.23.21_CoVHUY.apk',
        path: '/p-585162853b474062a7227c69fd0ac050/b-b4d32cf3d5dd4de294c8537724f72a80/',
        fullName:
          '/p-585162853b474062a7227c69fd0ac050/b-b4d32cf3d5dd4de294c8537724f72a80/10040714_com.tencent.tmgp.hpjy_a2681256_1.23.21_CoVHUY.apk',
        fullPath:
          '/p-585162853b474062a7227c69fd0ac050/b-b4d32cf3d5dd4de294c8537724f72a80/10040714_com.tencent.tmgp.hpjy_a2681256_1.23.21_CoVHUY.apk',
        size: 2082359687,
        createdTime: 1755655632,
        modifiedTime: 1755655632,
        checksums: {
          sha256: '14459468ba81efedfd5c6773de45bf0ab1262e8b2795a121824a36769988517e',
          sha1: '',
          md5: '7d04ddbe7af2039455ce8908ac61cb60',
        },
        meta: {
          'BK-CI-APP-STAGE': 'Alpha',
          projectId: 'test-01',
          pipelineId: 'p-585162853b474062a7227c69fd0ac050',
          buildId: 'b-b4d32cf3d5dd4de294c8537724f72a80',
          userId: 'zhangsan',
          buildNo: '21',
          taskId: 'e-e7cddeae25e54b2ab0f50abb4e3945f0',
          source: 'pipeline',
          appVersion: '1.23.21',
          appTitle: '和平精英',
          bundleIdentifier: 'com.tencent.tmgp.pubgmhd',
          appName: '和平精英',
          appIcon:
            'https://teststaticfile.woa.com/bkdevops/app-icon/app-icon/apk/f95eb34eb7399ff3e9bcb06c6a560336fd94e0126477692ecabe5b8bffee0afd.png?v=1755655609',
          sys_ch: 'pipeline',
          sys_uid: 'zhangsan',
        },
        nodeMetadata: [
          {
            key: 'BK-CI-APP-STAGE',
            value: 'Alpha',
            system: false,
          },
          {
            key: 'projectId',
            value: 'test-01',
            system: false,
          },
          {
            key: 'pipelineId',
            value: 'p-585162853b474062a7227c69fd0ac050',
            system: false,
          },
          {
            key: 'buildId',
            value: 'b-b4d32cf3d5dd4de294c8537724f72a80',
            system: false,
          },
          {
            key: 'userId',
            value: 'zhangsan',
            system: false,
          },
          {
            key: 'buildNo',
            value: '21',
            system: false,
          },
          {
            key: 'taskId',
            value: 'e-e7cddeae25e54b2ab0f50abb4e3945f0',
            system: false,
          },
          {
            key: 'source',
            value: 'pipeline',
            system: false,
          },
          {
            key: 'appVersion',
            value: '1.23.21',
            system: false,
          },
          {
            key: 'appTitle',
            value: '和平精英',
            system: false,
          },
          {
            key: 'bundleIdentifier',
            value: 'com.tencent.tmgp.pubgmhd',
            system: false,
          },
          {
            key: 'appName',
            value: '和平精英',
            system: false,
          },
          {
            key: 'appIcon',
            value:
              'https://teststaticfile.woa.com/bkdevops/app-icon/app-icon/apk/f95eb34eb7399ff3e9bcb06c6a560336fd94e0126477692ecabe5b8bffee0afd.png?v=1755655609',
            system: false,
          },
          {
            key: 'sys_ch',
            value: 'pipeline',
            system: false,
          },
          {
            key: 'sys_uid',
            value: 'zhangsan',
            system: false,
          },
        ],
        url: '/bkrepo/api/user/generic/test-01/pipeline/p-585162853b474062a7227c69fd0ac050/b-b4d32cf3d5dd4de294c8537724f72a80/10040714_com.tencent.tmgp.hpjy_a2681256_1.23.21_CoVHUY.apk?download=true',
        shortUrl: 'https://test-s.bkdevops.qq.com/1K4BoxpV',
      })
    }, 500)
  })
}

/**
 * 获取元数据标签列表
 * @param params 请求参数
 * @returns 元数据标签列表
 */
export function requestMetadataLabels(params: GetMetadataLabelsParams): Promise<MetadataLabel[]> {
  const { projectId, pipelineId, debug = false } = params

  // TODO: 调用实际接口
  // return http.get(`/user/artifactories/quality/metadata/${projectId}/pipeline/${pipelineId}?debug=${debug}`)
  //   .then(res => res.data)

  // Mock 数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          labelKey: 'BK-CI-APP-STAGE',
          labelColorMap: {},
          enumType: false,
          display: true,
          category: 'Uncategorized',
          system: false,
          enableColorConfig: false,
          description: 'Auto-generated for an artifact property not defined in project.',
          createdBy: 'custom',
          createdDate: '2025-12-09T10:42:39.720832423',
          lastModifiedBy: 'custom',
          lastModifiedDate: '2025-12-09T10:42:39.720832805',
        },
        {
          labelKey: 'appIcon',
          labelColorMap: {},
          enumType: false,
          display: true,
          category: 'Uncategorized',
          system: false,
          enableColorConfig: false,
          description: 'Auto-generated for an artifact property not defined in project.',
          createdBy: 'custom',
          createdDate: '2025-12-09T10:42:39.720865309',
          lastModifiedBy: 'custom',
          lastModifiedDate: '2025-12-09T10:42:39.720865697',
        },
        {
          labelKey: 'appName',
          labelColorMap: {},
          enumType: false,
          display: true,
          category: 'Uncategorized',
          system: false,
          enableColorConfig: false,
          description: 'Auto-generated for an artifact property not defined in project.',
          createdBy: 'custom',
          createdDate: '2025-12-09T10:42:39.72083046',
          lastModifiedBy: 'custom',
          lastModifiedDate: '2025-12-09T10:42:39.720830952',
        },
        {
          labelKey: 'appTitle',
          labelColorMap: {},
          enumType: false,
          display: true,
          category: 'Uncategorized',
          system: false,
          enableColorConfig: false,
          description: 'Auto-generated for an artifact property not defined in project.',
          createdBy: 'custom',
          createdDate: '2025-12-09T10:42:39.720860056',
          lastModifiedBy: 'custom',
          lastModifiedDate: '2025-12-09T10:42:39.72086098',
        },
      ])
    }, 500)
  })
}

/**
 * 获取产出制品下载 URL
 * @param params 请求参数
 * @returns 下载 URL
 */
export function requestDownloadUrl(params: GetDownloadUrlParams): Promise<GetDownloadUrlResponse> {
  const { projectId, artifactoryType, path } = params

  // TODO: 调用实际接口
  // return http.post(`/user/artifactories/${projectId}/${artifactoryType}/downloadUrl`, {
  //   path
  // }).then(res => res.data)

  // Mock 数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        url: '/bkrepo/api/user/generic/test-01/pipeline/p-585162853b474062a7227c69fd0ac050/b-b4d32cf3d5dd4de294c8537724f72a80/devops_app1.apk?download=true',
        url2: '/bkrepo/api/user/generic/test-01/pipeline/p-585162853b474062a7227c69fd0ac050/b-b4d32cf3d5dd4de294c8537724f72a80/devops_app1.apk?download=true',
      })
    }, 300)
  })
}

/**
 * 获取自定义文件夹树
 * @param params 请求参数
 * @returns 文件夹树
 */
export function requestCustomDirTree(params: GetCustomDirTreeParams): Promise<CustomDirTreeNode> {
  const { projectId, ...restParams } = params

  // return get<CustomDirTreeNode>(`${ARTIFACTORY_API_URL_PREFIX}/user/custom-repo/${projectId}/dir/tree`, {
  //   params: restParams,
  // })
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        name: '',
        fullPath: '/',
        children: [
          {
            name: 'ABCv',
            fullPath: '/ABCv',
            children: [],
          },
          {
            name: 'TestFile',
            fullPath: '/TestFile',
            children: [],
          },
          {
            name: '_from_pipeline',
            fullPath: '/_from_pipeline',
            children: [],
          },
          {
            name: 'aaa1',
            fullPath: '/aaa1',
            children: [],
          },
          {
            name: 'file',
            fullPath: '/file',
            children: [],
          },
          {
            name: 'files',
            fullPath: '/files',
            children: [],
          },
          {
            name: 'haha',
            fullPath: '/haha',
            children: [],
          },
        ],
      })
    }, 300)
  })
}

/**
 * 复制文件
 * @param params 请求参数
 * @returns 是否成功
 */
export function requestCopyFile(params: CopyFileParams): Promise<boolean> {
  // return post<boolean>(`${ARTIFACTORY_API_URL_PREFIX}/user/artifactories/file/copy`, params)
  // Mock 数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, 300)
  })
}
