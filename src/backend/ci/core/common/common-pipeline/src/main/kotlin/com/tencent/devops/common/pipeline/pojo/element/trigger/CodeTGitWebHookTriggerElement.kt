/*
 * Tencent is pleased to support the open source community by making BK-CI 蓝鲸持续集成平台 available.
 *
 * Copyright (C) 2019 THL A29 Limited, a Tencent company.  All rights reserved.
 *
 * BK-CI 蓝鲸持续集成平台 is licensed under the MIT license.
 *
 * A copy of the MIT License is included in this file.
 *
 *
 * Terms of the MIT License:
 * ---------------------------------------------------
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of
 * the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
 * LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
 * NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

package com.tencent.devops.common.pipeline.pojo.element.trigger

import com.tencent.devops.common.api.enums.RepositoryType
import com.tencent.devops.common.pipeline.enums.StartType
import com.tencent.devops.common.pipeline.pojo.element.trigger.enums.CodeEventType
import com.tencent.devops.common.pipeline.pojo.element.trigger.enums.PathFilterType
import io.swagger.annotations.ApiModel
import io.swagger.annotations.ApiModelProperty

@ApiModel("TGit事件触发", description = CodeTGitWebHookTriggerElement.classType)
data class CodeTGitWebHookTriggerElement(
    @ApiModelProperty("任务名称", required = true)
    override val name: String = "TGit变更触发",
    @ApiModelProperty("id", required = false)
    override var id: String? = null,
    @ApiModelProperty("状态", required = false)
    override var status: String? = null,
    @ApiModelProperty("数据", required = true)
    val data: CodeTGitWebHookTriggerData
) : WebHookTriggerElement(name, id, status) {
    companion object {
        const val classType = "codeTGitWebHookTrigger"
    }

    override fun getClassType() = classType

    override fun findFirstTaskIdByStartType(startType: StartType): String {
        return if (startType.name == StartType.WEB_HOOK.name) {
            this.id!!
        } else {
            super.findFirstTaskIdByStartType(startType)
        }
    }

    // 增加条件这里也要补充上,不然代码库触发器列表展示会不对
    override fun triggerCondition(): Map<String, Any?> {
        return with(data.input) {
            when (eventType) {
                CodeEventType.PUSH -> {
                    mapOf(
                        "branchName" to branchName,
                        "excludeBranchName" to excludeBranchName,
                        "includePaths" to includePaths,
                        "excludePaths" to excludePaths,
                        "includeUsers" to includeUsers,
                        "excludeUsers" to excludeUsers
                    )
                }
                CodeEventType.MERGE_REQUEST -> {
                    mapOf(
                        "branchName" to branchName,
                        "excludeBranchName" to excludeBranchName,
                        "includeSourceBranchName" to includeSourceBranchName,
                        "excludeSourceBranchName" to excludeSourceBranchName,
                        "includePaths" to includePaths,
                        "excludePaths" to excludePaths,
                        "includeUsers" to includeUsers,
                        "excludeUsers" to excludeUsers
                    )
                }
                CodeEventType.MERGE_REQUEST_ACCEPT -> {
                    mapOf(
                        "branchName" to branchName,
                        "excludeBranchName" to excludeBranchName,
                        "includeSourceBranchName" to includeSourceBranchName,
                        "excludeSourceBranchName" to excludeSourceBranchName,
                        "includePaths" to includePaths,
                        "excludePaths" to excludePaths,
                        "includeUsers" to includeUsers,
                        "excludeUsers" to excludeUsers
                    )
                }
                CodeEventType.TAG_PUSH -> {
                    mapOf(
                        "tagName" to tagName,
                        "excludeTagName" to excludeTagName,
                        "fromBranches" to fromBranches
                    )
                }
                CodeEventType.REVIEW -> {
                    mapOf(
                        "includeCrState" to includeCrState
                    )
                }
                CodeEventType.ISSUES -> {
                    mapOf(
                        "includeIssueAction" to includeIssueAction
                    )
                }
                CodeEventType.NOTE -> {
                    mapOf(
                        "includeNoteTypes" to includeNoteTypes,
                        "includeNoteComment" to includeNoteComment
                    )
                }
                else ->
                    emptyMap()
            }
        }
    }
}

data class CodeTGitWebHookTriggerData(
    @ApiModelProperty("TGit事件触发数据", required = false)
    val input: CodeTGitWebHookTriggerInput
)

@ApiModel("TGit事件触发数据")
data class CodeTGitWebHookTriggerInput(
    @ApiModelProperty("仓库ID", required = true)
    val repositoryHashId: String?,
    @ApiModelProperty("分支名称", required = false)
    val branchName: String?,
    @ApiModelProperty("用于排除的分支名", required = false)
    val excludeBranchName: String?,
    @ApiModelProperty("路径过滤类型", required = true)
    val pathFilterType: PathFilterType? = PathFilterType.NamePrefixFilter,
    @ApiModelProperty("用于包含的路径", required = false)
    val includePaths: String?,
    @ApiModelProperty("用于排除的路径", required = false)
    val excludePaths: String?,
    @ApiModelProperty("用户白名单", required = false)
    val includeUsers: List<String>? = null,
    @ApiModelProperty("用于排除的user id", required = false)
    val excludeUsers: List<String>?,
    @ApiModelProperty("事件类型", required = false)
    val eventType: CodeEventType?,
    @ApiModelProperty("是否为block", required = false)
    val block: Boolean?,
    @ApiModelProperty("新版的git原子的类型")
    val repositoryType: RepositoryType? = null,
    @ApiModelProperty("新版的git代码库名")
    val repositoryName: String? = null,
    @ApiModelProperty("tag名称", required = false)
    val tagName: String? = null,
    @ApiModelProperty("用于排除的tag名称", required = false)
    val excludeTagName: String? = null,
    @ApiModelProperty("用于排除的源分支名称", required = false)
    val excludeSourceBranchName: String? = null,
    @ApiModelProperty("用于包含的源分支名称", required = false)
    val includeSourceBranchName: String? = null,
    @ApiModelProperty("tag从哪条分支创建", required = false)
    val fromBranches: String? = null,
    @ApiModelProperty("code review 状态", required = false)
    val includeCrState: List<String>? = null,
    @ApiModelProperty("code note comment", required = false)
    val includeNoteComment: String? = null,
    @ApiModelProperty("code note 类型", required = false)
    val includeNoteTypes: List<String>? = null,
    @ApiModelProperty("issue事件action")
    val includeIssueAction: List<String>? = null,
    @ApiModelProperty("是否启用回写")
    val enableCheck: Boolean? = true,
    @ApiModelProperty("mr事件action")
    val includeMrAction: List<String>? = null,
    @ApiModelProperty("push事件action")
    val includePushAction: List<String>? = null,
    @ApiModelProperty("webhook队列", required = false)
    val webhookQueue: Boolean? = false
)
