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

package com.tencent.devops.artifactory.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.tencent.devops.artifactory.constant.PushMessageCode
import com.tencent.devops.artifactory.pojo.FastPushFileRequest
import com.tencent.devops.common.api.util.OkhttpUtils
import com.tencent.devops.common.service.utils.MessageCodeUtil
import okhttp3.Request
import okhttp3.RequestBody
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service

@Service@Suppress("ALL")
class JobServiceExt @Autowired constructor(
    private val objectMapper: ObjectMapper
) {
    @Value("\${job.nginx.url:#{null}}")
    val jobUrl: String? = null

    fun fastPushFileDevops(pushFileRequest: FastPushFileRequest, projectId: String): Long {
        val requestBody = objectMapper.writeValueAsString(pushFileRequest)
        val url = "$jobUrl/service/file/$projectId/push/"
        val taskInstanceId = sendTaskRequest(requestBody, url)
        if (taskInstanceId <= 0) {
            // 失败处理
            logger.warn("start jobDevOpsFastPushfile failed")
            throw RuntimeException(MessageCodeUtil.getCodeLanMessage(PushMessageCode.JOB_EXECUTE_FAIL))
        }
        return taskInstanceId
    }

    private fun sendTaskRequest(requestBody: String, url: String): Long {
        logger.info("request url: $url")
        logger.info("request body: $requestBody")
        val httpReq = Request.Builder()
            .url(url)
            .post(RequestBody.create(OkhttpUtils.jsonMediaType, requestBody))
            .build()
        OkhttpUtils.doHttp(httpReq).use { resp ->
            val responseStr = resp.body()!!.string()
            logger.info("response body: $responseStr")

            val response: Map<String, Any> = jacksonObjectMapper().readValue(responseStr)
            if (response["status"] == 0) {
                val responseData = response["data"] as Map<String, Any>
                val taskInstanceId = responseData["taskInstanceId"].toString().toLong()
                logger.info("start job success, taskInstanceId: $taskInstanceId")
                return taskInstanceId
            } else {
                val msg = response["message"] as String
                logger.warn("start job failed, msg: $msg")
                throw RuntimeException(MessageCodeUtil.getCodeMessage(PushMessageCode.JOB_EXECUTE_FAIL, arrayOf(msg)))
            }
        }
    }

    fun getTaskResult(projectId: String, taskInstanceId: Long, operator: String): TaskResult {
        try {
            val url = "$jobUrl/service/history/$projectId/$taskInstanceId/status"
            logger.info("Get request url: $url")
            OkhttpUtils.doGet(url).use { resp ->
                val responseStr = resp.body()!!.string()
//            val responseStr = HttpUtils.get(url)
                logger.info("responseBody: $responseStr")
                val response: Map<String, Any> = jacksonObjectMapper().readValue(responseStr)
                if (response["status"] == 0) {
                    val responseData = response["data"] as Map<String, Any>
                    val status = responseData["status"] as Int
                    return when (status) {
                        3 -> {
                            logger.info("Job execute task finished and success")
                            TaskResult(true, true, "Success")
                        }
                        4 -> {
                            logger.error("Job execute task failed")
                            TaskResult(true, false, "Job failed")
                        }
                        else -> {
                            logger.info("Job execute task running")
                            TaskResult(false, false, "Job Running")
                        }
                    }
                } else {
                    val msg = response["message"] as String
                    logger.error("job execute failed, msg: $msg")
                    throw RuntimeException("job execute failed, msg: $msg")
                }
            }
        } catch (e: Exception) {
            logger.error("execute job error", e)
            throw RuntimeException("execute job error: ${e.message}")
        }
    }

    data class TaskResult(val isFinish: Boolean, val success: Boolean, val msg: String)

    companion object {
        val logger = LoggerFactory.getLogger(this::class.java)
    }
}
