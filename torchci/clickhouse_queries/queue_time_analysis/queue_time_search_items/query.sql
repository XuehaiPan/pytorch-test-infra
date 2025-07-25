SELECT
    arrayDistinct(groupArray(repo)) AS repos,
    arrayDistinct(groupArray(workflow_name)) AS workflow_names,
    arrayDistinct(groupArray(job_name)) AS job_names,
    arrayDistinct(groupArray(machine_type)) AS machine_types,
    arrayDistinct(arrayFlatten(groupArray(runner_labels))) AS runner_labels
FROM misc.oss_ci_queue_time_histogram
WHERE time >= {startTime: DateTime64} AND time < {endTime: DateTime64}
