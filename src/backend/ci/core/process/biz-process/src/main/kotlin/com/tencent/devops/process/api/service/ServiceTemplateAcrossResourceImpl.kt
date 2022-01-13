package com.tencent.devops.process.api.service

import com.tencent.devops.common.api.pojo.Result
import com.tencent.devops.common.web.RestResource
import com.tencent.devops.process.pojo.BuildTemplateAcrossInfo
import com.tencent.devops.process.service.builds.PipelineBuildTemplateAcrossInfoService
import org.springframework.beans.factory.annotation.Autowired

@RestResource
class ServiceTemplateAcrossResourceImpl @Autowired constructor(
    private val templateAcrossInfoService: PipelineBuildTemplateAcrossInfoService
) : ServiceTemplateAcrossResource {
    override fun batchCreate(
        userId: String,
        projectId: String,
        pipelineId: String,
        templateAcrossInfos: List<BuildTemplateAcrossInfo>
    ) {
        templateAcrossInfoService.batchCreate(projectId, pipelineId, null, userId, templateAcrossInfos)
    }

    override fun update(projectId: String, pipelineId: String, templateId: String, buildId: String): Result<Boolean> {
        return Result(
            templateAcrossInfoService.updateBuildId(projectId, pipelineId, templateId, buildId)
        )
    }

    override fun delete(projectId: String, pipelineId: String, templateId: String?, buildId: String?): Result<Boolean> {
        return Result(
            templateAcrossInfoService.delete(projectId, pipelineId, buildId, templateId)
        )
    }
}
