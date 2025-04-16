package main

import "time"

func handleInitialProposalMessage(task *Task) *Task {
	proposalID, ok := task.Metadata["proposalId"].(string)
	if !ok {
		task.Output = map[string]interface{}{
			"type":  "text",
			"value": "Missing or invalid proposalId.",
		}
		task.Status = StatusCompleted
		return task
	}

	if proposalID == "321" {
		message := Message{
			Timestamp: time.Now(),
			Sender:    "agent",
			Content: map[string]interface{}{
				"type":  "text",
				"value": "Proposal 321 has a price mismatch. Approved price is $100. Would you like to correct it?",
			},
		}
		task.Messages = append(task.Messages, message)
		task.Status = StatusInputRequired
		return task
	}

	return task
}
