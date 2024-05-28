package com.tencent.devops.repository.sdk.github.service

import com.tencent.devops.common.api.exception.SdkException
import com.tencent.devops.repository.sdk.common.enums.HttpStatus
import com.tencent.devops.repository.sdk.github.DefaultGithubClient
import com.tencent.devops.repository.sdk.github.request.GetAppInstallationForOrgRequest
import com.tencent.devops.repository.sdk.github.request.GetAppInstallationForRepoRequest
import com.tencent.devops.repository.sdk.github.response.GetAppInstallationResponse
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class GithubAppService @Autowired constructor(
    private val defaultGithubClient: DefaultGithubClient
) {

    fun getAppInstallationForRepo(request: GetAppInstallationForRepoRequest): GetAppInstallationResponse? {
        return try {
            defaultGithubClient.executeByJwt(
                request = request
            )
        } catch (e: SdkException) {
            if (e.errCode == HttpStatus.NOT_FOUND.statusCode) {
                return null
            }
            throw e
        }
    }

    fun getAppInstallationForOrg(request: GetAppInstallationForOrgRequest): GetAppInstallationResponse? {
        return try {
            defaultGithubClient.executeByJwt(
                request = request
            )
        } catch (e: SdkException) {
            if (e.errCode == HttpStatus.NOT_FOUND.statusCode) {
                return null
            }
            throw e
        }
    }
}
