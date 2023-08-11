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

package com.tencent.devops.process.service

import com.tencent.devops.common.api.model.SQLLimit
import com.tencent.devops.common.api.pojo.Page
import com.tencent.devops.common.api.util.PageUtil
import com.tencent.devops.common.web.utils.I18nUtil
import com.tencent.devops.process.engine.dao.PipelineOperationLogDao
import com.tencent.devops.process.engine.dao.PipelineResVersionDao
import com.tencent.devops.process.enums.OperationLogType
import com.tencent.devops.process.pojo.PipelineOperationDetail
import com.tencent.devops.process.pojo.setting.PipelineVersionSimple
import org.jooq.DSLContext
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
@Suppress("LongParameterList")
class PipelineOperationLogService @Autowired constructor(
    private val dslContext: DSLContext,
    private val pipelineOperationLogDao: PipelineOperationLogDao,
    private val pipelineResVersionDao: PipelineResVersionDao
) {

    fun addOperationLog(
        userId: String,
        projectId: String,
        pipelineId: String,
        version: Int,
        operationLogType: OperationLogType,
        params: String,
        description: String?
    ) {
        pipelineOperationLogDao.add(
            dslContext = dslContext,
            operator = userId,
            projectId = projectId,
            pipelineId = pipelineId,
            version = version,
            operationLogType = operationLogType,
            params = params,
            description = description
        )
    }

    fun getOperationLogsInPage(
        userId: String,
        projectId: String,
        pipelineId: String,
        page: Int?,
        pageSize: Int?
    ): Page<PipelineOperationDetail> {
        val pageNotNull = page ?: 0
        val pageSizeNotNull = pageSize ?: -1
        var slqLimit: SQLLimit? = null
        if (pageSizeNotNull != -1) slqLimit = PageUtil.convertPageSizeToSQLLimit(pageNotNull, pageSizeNotNull)
        val offset = slqLimit?.offset ?: 0
        val limit = slqLimit?.limit ?: -1
        val opCount = pipelineOperationLogDao.getCountByPipeline(
            dslContext = dslContext,
            projectId = projectId,
            pipelineId = pipelineId
        )
        val opList = pipelineOperationLogDao.getListByPipeline(
            dslContext = dslContext,
            projectId = projectId,
            pipelineId = pipelineId,
            offset = offset,
            limit = limit
        )
        val versions = mutableSetOf<Int>()
        opList.forEach { versions.add(it.version) }
        val versionMap = mutableMapOf<Int, PipelineVersionSimple>()
        pipelineResVersionDao.listPipelineVersionInList(
            dslContext = dslContext,
            projectId = projectId,
            pipelineId = pipelineId,
            versions = versions
        ).forEach { versionMap[it.version] = it }
        val detailList = opList.map {
            with(it) {
                PipelineOperationDetail(
                    id = id,
                    projectId = projectId,
                    pipelineId = pipelineId,
                    version = version,
                    operator = operator,
                    operationLogType = operationLogType,
                    operationLogStr = operationLogType.getI18n(I18nUtil.getRequestUserLanguage()),
                    params = params,
                    description = description,
                    operateTime = operateTime,
                    versionName = versionMap[it.version]?.versionName,
                    versionCreateTime = versionMap[it.version]?.createTime,
                    status = versionMap[it.version]?.status
                )
            }
        }
        return Page(
            page = pageNotNull,
            pageSize = pageSizeNotNull,
            count = opCount.toLong(),
            records = detailList
        )
    }

    fun getOperatorInPage(
        projectId: String,
        pipelineId: String,
        page: Int?,
        pageSize: Int?
    ): Page<String> {
        val pageNotNull = page ?: 0
        val pageSizeNotNull = pageSize ?: -1
        var slqLimit: SQLLimit? = null
        if (pageSizeNotNull != -1) slqLimit = PageUtil.convertPageSizeToSQLLimit(pageNotNull, pageSizeNotNull)

        val offset = slqLimit?.offset ?: 0
        val limit = slqLimit?.limit ?: -1
        val size = pipelineOperationLogDao.countOperator(dslContext, projectId, pipelineId)
        val operators = pipelineOperationLogDao.getOperatorInPage(
            dslContext = dslContext,
            projectId = projectId,
            pipelineId = pipelineId,
            offset = offset,
            limit = limit
        )

        return Page(
            page = pageNotNull,
            pageSize = pageSizeNotNull,
            count = size.toLong(),
            records = operators
        )
    }
}
