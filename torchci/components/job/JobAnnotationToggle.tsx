import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import _ from "lodash";
import { useSession } from "next-auth/react";
import React from "react";
import { JobAnnotation, JobData } from "../../lib/types";

export default function JobAnnotationToggle({
  job,
  similarJobs,
  annotation,
  repo = null,
}: {
  job: JobData;
  similarJobs?: JobData[] | null;
  annotation: JobAnnotation;
  repo?: string | null;
}) {
  const allJobs = similarJobs ?? [];
  // Double check if the job exists before adding it
  if (!_.find(allJobs, (j: JobData) => j.id === job.id)) {
    allJobs.push(job);
  }

  const [state, setState] = React.useState<JobAnnotation>(
    (annotation ?? "null") as JobAnnotation
  );
  const session = useSession();
  async function handleChange(
    _: React.MouseEvent<HTMLElement>,
    newState: JobAnnotation
  ) {
    setState(newState);
    await fetch(`/api/job_annotation/${repo ?? job.repo}/${newState}`, {
      method: "POST",
      // Also send over the list of similar jobs so that they can be annotated
      // in one API call
      body: JSON.stringify(allJobs.map((job) => job.id)),
    });
  }

  return (
    <>
      Classify failure:{" "}
      <ToggleButtonGroup
        value={state}
        exclusive
        onChange={handleChange}
        disabled={session.status !== "authenticated"}
      >
        {Object.keys(JobAnnotation).map((annotation, ind) => {
          return (
            <ToggleButton
              key={ind}
              value={annotation}
              style={{ height: "12pt", textTransform: "none" }}
            >
              {
                //@ts-ignore
                JobAnnotation[annotation]
              }
            </ToggleButton>
          );
        })}
      </ToggleButtonGroup>
    </>
  );
}
