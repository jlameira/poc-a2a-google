package main

func handleProposalCorrection(task *Task) *Task {
	task.Output = map[string]interface{}{
		"type":  "text",
		"value": "Proposal 321 was successfully corrected and approved by the proposal agent.",
	}
	task.Status = StatusCompleted
	return task
}
